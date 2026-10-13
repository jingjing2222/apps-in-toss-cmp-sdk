import assert from 'node:assert/strict';

export function getNpmTag(version) {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta|rc)\d+)?$/.exec(version ?? '');
  assert.ok(match, 'Use a version such as 1.0.0 or 1.0.0-alpha01');
  return match[4] ?? 'latest';
}
