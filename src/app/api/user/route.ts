import { db } from "@/db";
import { users } from "@/db/schema";
import { generateUserKey, hashUserKey } from "@/lib/crypto";
import { NextRequest, NextResponse } from "next/server";

interface CreateUserDTO {
  username: string;
  email?: string;
  key?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateUserDTO;

    if (!body.username) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const userKey = body.key ?? generateUserKey();
    const encryptedKey = hashUserKey(userKey);

    await db.insert(users).values({
      username: body.username,
      email: body.email,
      createdAt: new Date(),
      userKey: encryptedKey,
    });

    return NextResponse.json(
      { success: true, message: "User created", userKey },
      { status: 201 },
    );
  } catch (error) { 
    console.error("Error saving expense:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
