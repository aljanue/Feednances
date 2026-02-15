import { Adapter } from "next-auth/adapters";
import {
  createAdapterUser,
  getAdapterUser,
  getAdapterUserByEmail,
  getUserByAccountProvider,
  updateAdapterUser,
  deleteAdapterUser,
  linkAdapterAccount,
  unlinkAdapterAccount,
} from "@/lib/data/auth-adapter.queries";

export function CustomDrizzleAdapter(): Adapter {
  return {
    async createUser(data) {
      const [newUser] = await createAdapterUser({
        id: data.id || undefined,
        email: data.email,
        fullName: data.name ?? null,
        username: data.email.split("@")[0],
        emailVerified: data.emailVerified ?? null,
        image: data.image ?? null,
      });
      return {
        id: newUser.id,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
        image: newUser.image,
        name: newUser.fullName,
      };
    },

    async getUser(id) {
      const user = await getAdapterUser(id);
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        name: user.fullName,
      };
    },

    async getUserByEmail(email) {
      const user = await getAdapterUserByEmail(email);
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        name: user.fullName,
      };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const user = await getUserByAccountProvider(provider, providerAccountId);
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        name: user.fullName,
      };
    },

    async updateUser(data) {
      if (!data.id)
        return {
          id: "",
          email: "",
          emailVerified: null,
          image: null,
          name: null,
        };
      const [updatedUser] = await updateAdapterUser(data.id, {
        email: data.email ?? undefined,
        fullName: data.name ?? null,
        emailVerified: data.emailVerified ?? null,
        image: data.image ?? null,
      });
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        name: updatedUser.fullName,
      };
    },

    async deleteUser(id) {
      await deleteAdapterUser(id);
    },

    async linkAccount(account) {
      await linkAdapterAccount({
        userId: account.userId as string,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: (account.refresh_token as string) || null,
        access_token: (account.access_token as string) || null,
        expires_at: (account.expires_at as number) || null,
        token_type: (account.token_type as string) || null,
        scope: (account.scope as string) || null,
        id_token: (account.id_token as string) || null,
        session_state: (account.session_state as string) || null,
      });
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await unlinkAdapterAccount(provider, providerAccountId);
    },
  };
}
