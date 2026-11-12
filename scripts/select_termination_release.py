#!/usr/bin/env python3
"""Prepare or apply a verified selection; default is read-only. Also supports rollback.

Only completed immutable uploads are eligible. Both pointers retain an audit copy
of their previous contents. A failed/uncertain pointer write is never retried here.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
from urllib.request import Request, urlopen
import uuid

from termination_point_policy import POINT_POLICY

PUBLIC_BASE = 'https://data.scienceimpacts.org'


def fetch(url):
    request = Request(url, headers={'Cache-Control': 'no-cache', 'User-Agent': 'scimap-release-selector', 'Accept-Encoding': 'identity'})
    with urlopen(request, timeout=60) as response:
        return response.read()


def remote(*args):
    result = subprocess.run(['rclone', *map(str, args)], capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(f'rclone {args[0]} failed; selection not confirmed')
    return result.stdout


def prepare(record):
    if record.get('status') != 'published':
        raise ValueError('Only a completed published upload may be selected')
    release_id = record['release_id']
    if not release_id or any(c not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-' for c in release_id):
        raise ValueError('Invalid release ID')
    url = f'{PUBLIC_BASE}/terminations/releases/{release_id}/manifest.json'
    if record.get('public_url') != url.rsplit('/', 1)[0]:
        raise ValueError('Unexpected public release location')
    body = fetch(url)
    if hashlib.sha256(body).hexdigest() != record['manifest_sha256']:
        raise ValueError('Public manifest checksum mismatch')
    manifest = json.loads(body)
    if manifest.get('schema_version') != 1 or manifest.get('release_id') != release_id or manifest.get('validation', {}).get('status') != 'passed' or manifest.get('release_validation', {}).get('status') != 'passed' or not manifest.get('approval_candidate'):
        raise ValueError('Unsupported or unvalidated release')
    if any(manifest['code'][repo].get('dirty', True) for repo in ('scimap', 'SciMap_Maps')):
        raise ValueError('Release was generated from a dirty checkout')
    policy = manifest.get('institution_points', {})
    if policy.get('minimum_current_loss_dollars') != POINT_POLICY['minimum_current_loss_dollars'] or policy.get('requires_positive_current_grant_count') is not True:
        raise ValueError('Unsupported institution point policy')
    samples = {sample['path']: sample for sample in record.get('public_samples', [])}
    artifacts = manifest['artifacts']
    required = [*artifacts['tables'].values(), *artifacts['downloads'].values(), artifacts['institutions'], artifacts['state_totals']]
    for item in required:
        sample = samples.get(item['path'], {})
        if sample.get('matches') is not True or sample.get('sha256') != item['sha256']:
            raise ValueError('Upload record lacks public artifact verification: ' + item['path'])
    return {'schema_version': 1, 'release_id': release_id, 'manifest_url': url,
            'manifest_sha256': record['manifest_sha256'], 'as_of': manifest['as_of'],
            'reporting_week': manifest['reporting_week']}


def select(args):
    record = json.loads(Path(args.upload_record).read_text())
    selection = prepare(record)
    target = f'{args.remote.rstrip("/")}/terminations/{args.pointer}.json'
    if args.pointer == 'website-release' and (not args.approved_by or not args.reason):
        raise ValueError('Website selection/rollback requires --approved-by and --reason recording actual team authorization')
    if args.historical and args.pointer == 'latest-validated':
        raise ValueError('Historical replays cannot update latest-validated')
    # Read via the authenticated object store so CDN cache cannot hide a newer pointer.
    names = remote('lsf', args.remote.rstrip('/') + '/terminations/', '--max-depth', '1').splitlines()
    old = json.loads(remote('cat', target)) if args.pointer + '.json' in names else None
    if args.pointer == 'latest-validated' and old and old['as_of'] > selection['as_of']:
        raise ValueError('Refusing to move latest-validated backwards')
    selection['selected_at'] = datetime.now(timezone.utc).isoformat()
    if args.approved_by:
        selection['approved_by'] = args.approved_by
    if args.reason:
        selection['reason'] = args.reason
    audit = {'status': 'prepared', 'pointer': args.pointer, 'previous': old, 'selection': selection}
    print(json.dumps(audit, indent=2))
    if not args.apply:
        return audit
    if not args.record:
        raise ValueError('--apply requires a new local --record path')
    audit_path = Path(args.record)
    # Exclusive create: reusing a record must not replay an uncertain write.
    with audit_path.open('x') as output:
        json.dump(audit, output, indent=2)
    try:
        with tempfile.TemporaryDirectory(prefix='scimap-selection-') as tmp:
            history = Path(tmp) / 'audit.json'
            history.write_text(json.dumps(audit, indent=2) + '\n')
            remote('copyto', history, f'{args.remote.rstrip("/")}/terminations/selections/{uuid.uuid4().hex}.json')
            pointer = Path(tmp) / 'pointer.json'
            pointer.write_text(json.dumps(selection, indent=2) + '\n')
            audit['status'] = 'write_started'
            audit_path.write_text(json.dumps(audit, indent=2) + '\n')
            remote('copyto', pointer, target, '--header-upload', 'Cache-Control: no-cache', '--header-upload', 'Content-Type: application/json')
            if json.loads(remote('cat', target)) != selection:
                raise RuntimeError('Object-store pointer differs after write')
            public_url = f'{PUBLIC_BASE}/terminations/{args.pointer}.json?verify={uuid.uuid4().hex}'
            if json.loads(fetch(public_url)) != selection:
                raise RuntimeError('Public pointer verification failed')
        audit['status'] = 'selected'
    except BaseException:
        audit['status'] = 'unconfirmed' if audit['status'] == 'write_started' else 'failed_before_write'
        raise
    finally:
        audit_path.write_text(json.dumps(audit, indent=2) + '\n')
    return audit


def parse_args(argv=None):
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--upload-record', required=True)
    p.add_argument('--pointer', choices=['latest-validated', 'website-release'], required=True)
    p.add_argument('--remote', default='r2:scimap-data')
    p.add_argument('--apply', action='store_true')
    p.add_argument('--historical', action='store_true')
    p.add_argument('--approved-by')
    p.add_argument('--reason')
    p.add_argument('--record')
    return p.parse_args(argv)


if __name__ == '__main__':
    select(parse_args())
