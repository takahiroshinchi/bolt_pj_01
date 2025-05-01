import { NextResponse } from 'next/server';
import { getDatabaseContents } from '@/lib/api/db';

export async function GET() {
  try {
    const contents = await getDatabaseContents();
    return NextResponse.json(contents);
  } catch (error) {
    console.error('APIエラー:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}