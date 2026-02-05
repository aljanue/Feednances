import { Adapter } from "next-auth/adapters";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export function CustomDrizzleAdapter(): Adapter {
  return {
    async createUser(data) {
      try {
        console.log("🚀🚀🚀🚀🚀🚀🚀 creating user with data: ", data);
        const [newUser] = await db
          .insert(users)
          .values({
            id: data.id || undefined,
            email: data.email,
            fullName: data.name,
            username: data.email.split("@")[0],
            emailVerified: data.emailVerified,
            image: data.image,
          })
          .returning();
        console.log("✨ Registro de usuario creado con éxito:", newUser);
        return {
          id: newUser.id,
          email: newUser.email,
          emailVerified: newUser.emailVerified,
          image: newUser.image,
          name: newUser.fullName,
        };
      } catch (error) {
        console.error("🔥 Error crítico en insert de usuario:", error);
        throw error;
      }
    },

    async getUser(id) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
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
      console.log("📧 Buscando usuario por email:", email);
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!user) {
        console.log(
          "🆕 Email no encontrado. Auth.js debería proceder a createUser.",
        );
        return null;
      }
      console.log(
        "✅ Email encontrado. Auth.js vinculará esta sesión al ID:",
        user.id,
      );

      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        name: user.fullName,
      };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      console.log("🔍 Buscando cuenta:", { provider, providerAccountId });
      const account = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId),
        ),
      });
      if (!account) {
        console.log("❌ No se encontró cuenta vinculada.");
        return null;
      }
      console.log(
        "✅ Cuenta encontrada, buscando usuario con ID:",
        account.userId,
      );
      const user = await db.query.users.findFirst({
        where: eq(users.id, account.userId),
      });
      console.log(
        user
          ? "👤 Usuario recuperado de la cuenta."
          : "⚠️ Cuenta existe pero el usuario NO.",
      );
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
      const [updatedUser] = await db
        .update(users)
        .set({
          email: data.email,
          fullName: data.name,
          emailVerified: data.emailVerified,
          image: data.image,
        })
        .where(eq(users.id, data.id))
        .returning();
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        name: updatedUser.fullName,
      };
    },

    async deleteUser(id) {
      await db.delete(users).where(eq(users.id, id));
    },

    async linkAccount(account) {
      console.log(
        "🔗 Vinculando proveedor a usuario. userId:",
        account.userId,
        "Provider:",
        account.provider,
      );
      await db.insert(accounts).values({
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
      console.log("✅ Vinculación completada en tabla 'account'");
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId),
          ),
        );
    },
  };
}
