import { Hono } from "hono";
import { jwt } from 'hono/jwt'
import { sign } from 'hono/jwt'
import { secureHeaders } from 'hono/secure-headers'
import type { Env } from './core-utils';
import { UserEntity, SubscriptionEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User, AuthResponse, Subscription, PlanId, Transaction } from "@shared/types";
const JWT_SECRET = "a-very-secret-and-secure-key-for-orbitbill";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.use('*', secureHeaders());
  // --- PUBLIC AUTH ROUTES ---
  app.post('/api/users/signup', async (c) => {
    const { name, email, password } = await c.req.json();
    if (!isStr(name) || !isStr(email) || !isStr(password)) {
      return bad(c, 'Name, email, and password are required.');
    }
    try {
      const passwordHash = `mock_hash_${password}`;
      const user = await UserEntity.createUser(c.env, { name, email, passwordHash });
      await SubscriptionEntity.createForUser(c.env, user.id, 'starter');
      const payload = { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }; // 24hr expiry
      const token = await sign(payload, JWT_SECRET);
      const userResponse: User = { id: user.id, name: user.name, email: user.email };
      return ok(c, { token, user: userResponse } as AuthResponse);
    } catch (e: any) {
      return bad(c, e.message);
    }
  });
  app.post('/api/users/login', async (c) => {
    const { email, password } = await c.req.json();
    if (!isStr(email) || !isStr(password)) {
      return bad(c, 'Email and password are required.');
    }
    const userEntity = new UserEntity(c.env, email.toLowerCase());
    if (!await userEntity.exists()) {
      return bad(c, 'Invalid credentials.');
    }
    const user = await userEntity.getState();
    if (user.passwordHash !== `mock_hash_${password}`) {
      return bad(c, 'Invalid credentials.');
    }
    const payload = { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 };
    const token = await sign(payload, JWT_SECRET);
    const userResponse: User = { id: user.id, name: user.name, email: user.email };
    return ok(c, { token, user: userResponse } as AuthResponse);
  });
  // --- PROTECTED ROUTES ---
  const protectedRoutes = new Hono<{ Bindings: Env }>();
  protectedRoutes.use('*', jwt({ secret: JWT_SECRET }));
  protectedRoutes.get('/api/users/me', async (c) => {
    const payload = c.get('jwtPayload');
    const userEntity = new UserEntity(c.env, payload.email);
    if (!await userEntity.exists()) return notFound(c, 'User not found.');
    const user = await userEntity.getState();
    const userResponse: User = { id: user.id, name: user.name, email: user.email };
    return ok(c, userResponse);
  });
  protectedRoutes.put('/api/users/me', async (c) => {
    const payload = c.get('jwtPayload');
    const { name, email } = await c.req.json();
    if (!isStr(name) && !isStr(email)) return bad(c, 'At least one field (name or email) must be provided.');
    const userEntity = new UserEntity(c.env, payload.email);
    if (!await userEntity.exists()) return notFound(c, 'User not found.');
    await userEntity.patch({ name, email });
    const updatedUser = await userEntity.getState();
    const userResponse: User = { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email };
    return ok(c, userResponse);
  });
  protectedRoutes.put('/api/users/me/password', async (c) => {
    const payload = c.get('jwtPayload');
    const { currentPassword, newPassword } = await c.req.json();
    if (!isStr(currentPassword) || !isStr(newPassword)) return bad(c, 'All password fields are required.');
    const userEntity = new UserEntity(c.env, payload.email);
    if (!await userEntity.exists()) return notFound(c, 'User not found.');
    const user = await userEntity.getState();
    if (user.passwordHash !== `mock_hash_${currentPassword}`) return bad(c, 'Incorrect current password.');
    await userEntity.patch({ passwordHash: `mock_hash_${newPassword}` });
    return ok(c, { message: 'Password updated successfully.' });
  });
  protectedRoutes.delete('/api/users/me', async (c) => {
    const payload = c.get('jwtPayload');
    await UserEntity.delete(c.env, payload.email);
    await SubscriptionEntity.delete(c.env, payload.sub);
    return ok(c, { message: 'Account deleted successfully.' });
  });
  protectedRoutes.get('/api/subscriptions/me', async (c) => {
    const payload = c.get('jwtPayload');
    const subEntity = new SubscriptionEntity(c.env, payload.sub);
    if (!await subEntity.exists()) {
      const newSub = await SubscriptionEntity.createForUser(c.env, payload.sub);
      return ok(c, newSub);
    }
    return ok(c, await subEntity.getState());
  });
  protectedRoutes.put('/api/subscriptions/me', async (c) => {
    const payload = c.get('jwtPayload');
    const { planId } = await c.req.json() as { planId: PlanId };
    if (!['starter', 'pro', 'enterprise'].includes(planId)) return bad(c, 'Invalid plan ID.');
    const subEntity = new SubscriptionEntity(c.env, payload.sub);
    if (!await subEntity.exists()) return notFound(c, 'Subscription not found.');
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    await subEntity.patch({ planId, currentPeriodEnd: periodEnd.getTime() });
    return ok(c, await subEntity.getState());
  });
  protectedRoutes.get('/api/transactions', async (c) => {
    // Mock transaction data
    const mockTransactions: Transaction[] = [
      { id: 'txn_1', customer: { name: 'Liam Johnson', email: 'liam@example.com' }, type: 'Sale', status: 'Approved', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), amount: 250.00 },
      { id: 'txn_2', customer: { name: 'Olivia Smith', email: 'olivia@example.com' }, type: 'Sale', status: 'Approved', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), amount: 150.00 },
      { id: 'txn_3', customer: { name: 'Noah Williams', email: 'noah@example.com' }, type: 'Sale', status: 'Approved', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), amount: 350.00 },
    ];
    return ok(c, mockTransactions);
  });
  app.route('/', protectedRoutes);
}