import { db } from "@/db";
import { users } from "@/db/schema";
import { generateUserKey, hashUserKey } from "@/lib/crypto";
import bcrypt from "bcryptjs";
import type { PostgresError } from "postgres";
import { NextRequest, NextResponse } from "next/server";
import type { CreateUserDTO } from "@/lib/dtos/user";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateUserDTO;

    if (!body.username || !body.email || !body.password) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const encryptedPassword = await bcrypt.hash(body.password, 10);

    const userKey = generateUserKey(body.username);
    const hashedUserKey = hashUserKey(userKey);

    const [newUser] = await db
      .insert(users)
      .values({
        username: body.username,
        fullName: body.fullName,
        email: body.email,
        createdAt: new Date(),
        password: encryptedPassword,
        userKey: hashedUserKey,
        deleted: false,
      })
      .returning({ id: users.id });

    return NextResponse.json(
      { success: true, message: "User created", key: userKey, id: newUser.id },
      { status: 201 },
    );
  } catch (e: unknown) {
    const error = e as Error & { cause?: PostgresError };
    const code = error.cause?.code;
    if (code === "23505") {
      const detail = error.cause?.detail || "";
      const field = detail.includes("email") ? "email" : "username";

      return NextResponse.json(
        {
          error: `${field} already exists.`,
          key: field,
        },
        { status: 409 },
      );
    }

    console.error("Error saving user:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
