import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    roles?: number[];
    permissions?: { resource: string; action: string }[];
  }

  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: number[];
      permissions?: { resource: string; action: string }[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles?: number[];
    permissions?: { resource: string; action: string }[];
  }
}
