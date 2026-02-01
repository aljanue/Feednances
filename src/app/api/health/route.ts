import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = performance.now();

  try {
    await db.execute(sql`SELECT 1`);

    const duration = Math.round(performance.now() - start);

    return NextResponse.json(
      { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected'
        },
        latency: `${duration}ms`
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Health check failed:', error);

    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected'
        },
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 503 }
    );
  }
}