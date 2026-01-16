import test from 'node:test';
import assert from 'node:assert/strict';

import {
  elasticCollision1D,
  applyFriction1D,
  momentum,
  kineticEnergy
} from '../src/physics.js';

test('elastic collision: equal masses swap velocities (r=1)', () => {
  const { v1New, v2New } = elasticCollision1D({ m1: 2, v1: 3, m2: 2, v2: -1, restitution: 1 });
  assert.equal(v1New, -1);
  assert.equal(v2New, 3);
});

test('elastic collision: momentum conserved when restitution=1', () => {
  const input = { m1: 5, v1: 2, m2: 3, v2: -1 };
  const pBefore = momentum(input);

  const { v1New, v2New } = elasticCollision1D({ ...input, restitution: 1 });
  const pAfter = momentum({ m1: input.m1, v1: v1New, m2: input.m2, v2: v2New });

  // Floating point-safe check
  assert.ok(Math.abs(pBefore - pAfter) < 1e-12);
});

test('friction: reduces speed and never flips sign', () => {
  const v0 = 4;
  const v1 = applyFriction1D({ v: v0, mu: 0.3, dt: 0.1 });
  assert.ok(v1 < v0);
  assert.ok(v1 >= 0);

  // Large dt should clamp to 0 rather than cross into negative.
  const v2 = applyFriction1D({ v: 0.2, mu: 0.7, dt: 10 });
  assert.equal(v2, 0);
});

test('kinetic energy decreases when restitution < 1 (in this model)', () => {
  const input = { m1: 5, v1: 2, m2: 3, v2: -1 };
  const eBefore = kineticEnergy(input);

  const { v1New, v2New } = elasticCollision1D({ ...input, restitution: 0.98 });
  const eAfter = kineticEnergy({ m1: input.m1, v1: v1New, m2: input.m2, v2: v2New });

  assert.ok(eAfter < eBefore);
});
