import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses, users, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// DTO (Data Transfer Object): Contrato de lo que esperamos recibir del móvil
interface CreateExpenseDTO {
  amount: number;
  concept: string;
  categoryName: string; // Category Name (e.g., "Food", "Transport")
  apiKey: string;       // User Api Key
  date?: string;        // Optional: If not provided, use current date
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateExpenseDTO = (await req.json()) as CreateExpenseDTO;
    const apiKey = req.headers.get('x-api-key') || body.apiKey || '';

    if (!body.amount || !body.concept || !body.categoryName) {
      return NextResponse.json({ error: 'Missing input in body' }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.apiKey, apiKey),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const category = await db.query.categories.findFirst({
      where: eq(categories.name, body.categoryName),
    });

    if (!category) {
      return NextResponse.json({ error: `Category '${body.categoryName}' not found.` }, { status: 400 });
    }

    await db.insert(expenses).values({
      amount: body.amount.toString(),
      concept: body.concept,
      categoryId: category.id,
      userId: user.id,
      date: body.date ? new Date(body.date) : new Date(),
    });

    return NextResponse.json({ success: true, message: 'Expense saved' }, { status: 201 });

  } catch (error) {
    console.error('Error saving expense:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}