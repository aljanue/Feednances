import {  NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/data/system.queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = performance.now();

  try {
    await checkDatabaseHealth();

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