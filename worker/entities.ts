import { IndexedEntity, Index, type Env } from "./core-utils";
import type { User, Subscription, PlanId } from "@shared/types";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users_by_email";
  static readonly initialState: User = { id: "", name: "", email: "" };
  static override keyOf(state: any): string {
    return (state as User).email.toLowerCase();
  }
  static async createUser(env: Env, details: Omit<User, 'id'>): Promise<User> {
    const email = details.email.toLowerCase();
    const user: User = { ...details, id: crypto.randomUUID(), email };
    const inst = new this(env, email);
    if (await inst.exists()) {
      throw new Error("User with this email already exists.");
    }
    await inst.save(user);
    const idx = new Index<string>(env, this.indexName);
    await idx.add(email);
    return user;
  }
}
export class SubscriptionEntity extends IndexedEntity<Subscription> {
  static readonly entityName = "subscription";
  static readonly indexName = "subscriptions_by_user";
  static readonly initialState: Subscription = {
    id: "",
    userId: "",
    planId: "starter",
    status: "active",
    currentPeriodEnd: 0,
    createdAt: 0
  };
  static override keyOf(state: any): string {
    return (state as Subscription).userId;
  }
  static async createForUser(env: Env, userId: string, planId: PlanId = 'starter'): Promise<Subscription> {
    const now = Date.now();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    const sub: Subscription = {
      id: userId, // Use userId as the unique ID for the entity
      userId,
      planId,
      status: 'active',
      currentPeriodEnd: periodEnd.getTime(),
      createdAt: now
    };
    return this.create(env, sub);
  }
}