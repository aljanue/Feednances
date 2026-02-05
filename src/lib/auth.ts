"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hash } from "bcryptjs";
import { generateUserKey, hashUserKey } from "@/lib/crypto";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
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
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (password.length < 8) {
    return { error: "Password is too short." };
  }

  try {
    // 1. Hashing de seguridad
    const hashedPassword = await hash(password, 10);
    
    // 2. Generación de API Key para Atajos de iOS
    const userKey = generateUserKey(username);
    const hashedUserKey = hashUserKey(userKey);

    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      userKey: hashedUserKey,
      createdAt: new Date(),
    });

  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("unique")) {
      return { error: "The email or username already exists." };
    }
    return { error: "Internal server error." };
  }

  redirect("/login?registered=true");
}