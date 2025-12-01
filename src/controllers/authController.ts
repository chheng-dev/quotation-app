import bcrypt from "bcryptjs";
import { userModel } from "../models/userModel";
import { roleModel } from "../models/roleModel";
import { signAccessToken, verifyAccessToken, verifyRefreshToken } from "../lib/jwt";

export class AuthController {
  static async authorize(email: string, password: string) {
    const user = await userModel.findByEmail(email);
    if (!user) return null;
    
    const valid = await userModel.verifyPassword(email, password);
    if (!valid) return null;

    return user;
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async login(email: string, password: string) {
    const user = await userModel.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");
        
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");

    const userRolesRow = await userModel.getUserRoles(user.id);
    const roleIds = userRolesRow.map(ur => ur.roleId);
    const permissions = await roleModel.getRolePermissions(roleIds as number[]);

    const accessToken = signAccessToken({ id: user.id})
    const refreshToken = signAccessToken({ id: user.id});

    return {
      user,
      roles: roleIds,
      permissions,
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    const payload = verifyAccessToken(token);
    return payload;
  }

  async verifyRefreshToken(token: string) {
    const payload = verifyRefreshToken(token);
    return payload;
  }

  async getUserWithPermissions(userId: number) {
    const user = await userModel.findById(userId);
    if (!user) return null;

    const userRolesRow = await userModel.getUserRoles(userId);
    const roleIds = userRolesRow.map(ur => ur.roleId).filter((id): id is number => id !== null);
    const permissions = await roleModel.getRolePermissions(roleIds);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: roleIds,
      permissions: permissions.map(p => ({ resource: p.resource, action: p.action })),
    };
  }
}

export const authController = new AuthController();