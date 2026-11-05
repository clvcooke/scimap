"""Shared map-point display policy used by Python and the frontend build."""

import json
from pathlib import Path

POLICY_PATH = Path(__file__).resolve().parent.parent / "src/lib/termination-point-policy.json"
POINT_POLICY = json.loads(POLICY_PATH.read_text())
POINT_DOLLAR_ZERO_TOLERANCE = POINT_POLICY["minimum_current_loss_dollars"]
