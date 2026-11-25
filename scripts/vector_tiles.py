"""Minimal Mapbox Vector Tile reader: layer names and feature properties only.

Geometry is skipped. The MVT format is protobuf; see
https://github.com/mapbox/vector-tile-spec/tree/master/2.1
"""

import gzip
import struct


def _varint(data, index):
    result = shift = 0
    while True:
        byte = data[index]
        index += 1
        result |= (byte & 0x7F) << shift
        shift += 7
        if byte < 0x80:
            return result, index


def _fields(data):
    index = 0
    while index < len(data):
        key, index = _varint(data, index)
        number, wire = key >> 3, key & 7
        if wire == 0:
            value, index = _varint(data, index)
        elif wire == 1:
            value, index = data[index:index + 8], index + 8
        elif wire == 2:
            length, index = _varint(data, index)
            value, index = data[index:index + length], index + length
        elif wire == 5:
            value, index = data[index:index + 4], index + 4
        else:
            raise ValueError(f"Unsupported protobuf wire type {wire}")
        yield number, value


def _value(data):
    for number, value in _fields(data):
        if number == 1:
            return value.decode()
        if number == 2:
            return struct.unpack("<f", value)[0]
        if number == 3:
            return struct.unpack("<d", value)[0]
        if number == 4:
            return value - (1 << 64) if value >= 1 << 63 else value
        if number == 5:
            return value
        if number == 6:
            return (value >> 1) ^ -(value & 1)
        if number == 7:
            return bool(value)
    return None


def _packed(data):
    values, index = [], 0
    while index < len(data):
        value, index = _varint(data, index)
        values.append(value)
    return values


def read_tile(data):
    """Return {layer name: [feature properties, ...]}."""
    if data[:2] == b"\x1f\x8b":
        data = gzip.decompress(data)
    layers = {}
    for number, layer in _fields(data):
        if number != 3:
            continue
        name, keys, values, features = None, [], [], []
        for field, value in _fields(layer):
            if field == 1:
                name = value.decode()
            elif field == 2:
                features.append(value)
            elif field == 3:
                keys.append(value.decode())
            elif field == 4:
                values.append(_value(value))
        decoded = []
        for feature in features:
            tags = next((_packed(value) for field, value in _fields(feature) if field == 2), [])
            decoded.append({keys[tags[i]]: values[tags[i + 1]] for i in range(0, len(tags), 2)})
        layers[name] = decoded
    return layers
