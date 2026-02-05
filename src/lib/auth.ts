"use server";

import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    throw error;
  }
}

export async function registerUser(prevState: unknown, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (/\s/.test(username)) {
    return { error: "Username cannot contain spaces." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!/[A-Z]/.test(password)) {
    return { error: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { error: "Password must contain at least one lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { error: "Password must contain at least one number." };
  }
  if (!/[!@#$%^&*(),.?":{}|<>\[\]\\;'`~_+\-=/]/.test(password)) {
    return { error: "Password must contain at least one special character." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      username,
      fullName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      const errorCause = (error as { cause?: { code?: string } }).cause;
      
      if (errorCause?.code === '23505' || errorMessage.includes("unique") || errorMessage.includes("duplicate")) {
        return { error: "Couldn't create an account with this information. Try different credentials or sign in.", shouldClear: true, clearId: Date.now() };
      }
    }
    console.error("🚀🚀🚀🚀🚀🚀 Registration error:", error);
    return { error: "Something went wrong. Please try again later." };
  }

  redirect("/login?registered=true");
}

export async function setUserPassword(prevState: unknown, formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "You must be logged in to set a password." };
  }

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!/[A-Z]/.test(password)) {
    return { error: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { error: "Password must contain at least one lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { error: "Password must contain at least one number." };
  }
  if (!/[!@#$%^&*(),.?":{}|<>\[\]\\;'`~_+\-=/]/.test(password)) {
    return { error: "Password must contain at least one special character." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const hashedPassword = await hash(password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error setting password:", error);
    return { error: "Something went wrong. Please try again." };
  }
}