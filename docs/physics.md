# Physics Notes

This project simulates **1D motion** along a horizontal axis with:

- Two rigid bodies (squares) with masses `m1`, `m2`
- Velocities `v1`, `v2`
- Kinetic friction on a flat surface
- Collisions between the two bodies and with left/right walls

The goal is a simple, visually testable model rather than a full rigid-body engine.

## State

For each body we track:

- position: `x`
- velocity: `v`
- mass: `m`

We integrate with a fixed time step `dt`.

## Friction Model

We model **kinetic friction** as a constant-magnitude force:

- Normal force: `N = m g`
- Kinetic friction: `F_f = μ N = μ m g`

Acceleration is therefore:

`a = F_f / m = μ g`

We apply it opposite the direction of motion:

`v(t + dt) = v(t) - sign(v(t)) * μ g * dt`

To avoid numerical jitter near zero, we use a small threshold:

- if `|v| <= ε`, snap to `v = 0`
- if the update would cross through zero in a single step, clamp to `v = 0`

This approximates static friction behavior without modeling full stick-slip dynamics.

## Object–Object Collision (1D)

For an **ideal elastic collision** in 1D, the post-collision velocities derive from:

1. Conservation of momentum
2. Conservation of kinetic energy

The closed-form solution:

`v1' = ((m1 - m2) * v1 + 2 m2 v2) / (m1 + m2)`

`v2' = ((m2 - m1) * v2 + 2 m1 v1) / (m1 + m2)`

### Restitution

The UI includes a restitution factor `r` (near 1). In this implementation we apply it as a simple scaling:

`v1_new = r * v1'`

`v2_new = r * v2'`

This is a pragmatic “energy loss knob” that reduces kinetic energy after collision. It is **not** a full coefficient-of-restitution derivation (which would typically define relative velocity along the collision normal).

## Wall Collisions

Walls are treated as fixed, perfectly massive objects:

- If a square intersects a wall boundary, we clamp the position to the boundary
- Velocity reverses and is scaled by a wall restitution `r_wall`:

`v_new = -r_wall * v`

## Invariants and Sanity Checks

When `r = 1` (ideal elastic collision) and ignoring friction/walls:

- Momentum is conserved: `p = m1 v1 + m2 v2`
- Kinetic energy is conserved: `KE = 1/2 m1 v1^2 + 1/2 m2 v2^2`

With friction and `r < 1`, total kinetic energy is expected to decrease over time.
