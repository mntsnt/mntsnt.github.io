import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPortfolioData, savePortfolioData } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getPortfolioData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedData = await request.json();
    await savePortfolioData(updatedData);

    // Instant live site revalidation
    revalidatePath('/');
    revalidatePath('/admin');

    return NextResponse.json({
      success: true,
      message: 'Portfolio updated successfully.',
    });
  } catch (err) {
    console.error('Save portfolio error:', err);
    return NextResponse.json(
      { error: 'Failed to save changes.' },
      { status: 500 }
    );
  }
}
