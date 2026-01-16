// Minimal physics helpers extracted for testability.
// These mirror the equations used in index.html.

/**
 * Compute post-collision velocities for a 1D collision.
 *
 * Ideal elastic collision (r = 1) derives from:
 *  - Conservation of momentum
 *  - Conservation of kinetic energy
 *
 * We apply restitution r (0..1+) as a simple modifier on the resulting
 * velocities (matches the approach used in index.html).
 */
export function elasticCollision1D({ m1, v1, m2, v2, restitution = 1 }) {
  if (!(m1 > 0) || !(m2 > 0)) throw new Error('Masses must be > 0');
  const denom = m1 + m2;
  if (denom === 0) throw new Error('Invalid masses');

  const v1New = (((m1 - m2) * v1 + 2 * m2 * v2) / denom) * restitution;
  const v2New = (((m2 - m1) * v2 + 2 * m1 * v1) / denom) * restitution;

  return { v1New, v2New };
}

/**
 * Apply kinetic friction as constant deceleration a = mu * g.
 *
 * Returns updated velocity after dt seconds. Includes a small threshold
 * to snap to zero (static stop), matching index.html behavior.
 */
export function applyFriction1D({ v, mu, g = 9.81, dt, staticThreshold = 0.01 }) {
  if (dt < 0) throw new Error('dt must be >= 0');
  const a = Math.max(0, mu) * g;

  if (Math.abs(v) <= staticThreshold) return 0;

  // v <- v - sign(v) * a * dt, but don’t overshoot past 0.
  const vNext = v - Math.sign(v) * a * dt;
  if (Math.sign(vNext) !== Math.sign(v)) return 0;
  return vNext;
}

export function momentum({ m1, v1, m2, v2 }) {
  return m1 * v1 + m2 * v2;
}

export function kineticEnergy({ m1, v1, m2, v2 }) {
  return 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
}
