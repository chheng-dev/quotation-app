import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { userRoles, users } from '../lib/db/schema';
import { BaseModel } from './baseModel';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export class UserModel extends BaseModel<User> {
  constructor() {
    super(users);
  }

  async getUserRoles(userId: number) {
    return db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId))
      .orderBy(userRoles.roleId);
  }

  async beforeCreate(data: Partial<User>): Promise<Partial<User>> {
    if (data.name) {
      const nameExists = await this.findOne({ name: data.name! } as Partial<User>);
      if (nameExists) throw new Error('Name is already in use');
    }
    if (data.email) {
      const emailExists = await this.findByEmail(data.email!);
      if (emailExists) throw new Error('Email already in use');
    }
    if (data.code) {
      const codeExists = await this.findByCode(data.code!);
      if (codeExists) throw new Error('Code is already in use');
    }

    return data;
  }

  async beforeUpdate(data: Partial<User>): Promise<Partial<User>> {
    const user = await this.findByCode(data.code!);
    if (!user) {
      throw new Error('User not found');
    }

    return data;
  }

  /**
   * Create a new user with hashed password
   */
  async createUser(
    data: NewUser & { password: string },
  ): Promise<User> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);
    const passwordConfirmation = passwordHash; // Same as hash for confirmation

    const userData: NewUser = {
      ...data,
      passwordHash,
      passwordConfirmation,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await this.create(userData as any);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email } as Partial<User>);
  }

  /**
   * Find user by code
   */
  async findByCode(code: string): Promise<User | null> {
    return await this.findOne({ code } as Partial<User>);
  }

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return null;
    }

    return user;
  }

  /**
   * Update password
   */
  async updatePassword(userId: number, newPassword: string): Promise<User | null> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    return await this.updateById(userId, {
      passwordHash,
      passwordConfirmation: passwordHash,
    } as Partial<User>);
  }

  /**
   * Activate user account
   */
  async activateUser(userId: number): Promise<User | null> {
    return await this.updateById(userId, {
      isActive: true,
      isVerified: true,
    } as Partial<User>);
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(userId: number): Promise<User | null> {
    return await this.updateById(userId, {
      isActive: false,
    } as Partial<User>);
  }

  /**
   * Get active users only
   */
  async findActiveUsers(): Promise<User[]> {
    return await this.findMany({ isActive: true } as Partial<User>);
  }

  /**
   * Get verified users only
   */
  async findVerifiedUsers(): Promise<User[]> {
    return await this.findMany({
      isActive: true,
      isVerified: true,
    } as Partial<User>);
  }

  /**
   * Search users by name or email
   */
  async searchUsers(searchTerm: string): Promise<User[]> {
    const results = await db.select().from(users).where(eq(users.name, searchTerm));
    return results;
  }

  async getCurrentUser(userId: number): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.id, userId), eq(users.isActive, true)))
      .limit(1);
    return result.length ? result[0] : null;
  }
}

// Export singleton instance
export const userModel = new UserModel();
