import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/simple';
import { deleteBuyer } from '@/lib/actions/buyer';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    await deleteBuyer(id, user.id);
    revalidatePath('/buyers');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete buyer error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete buyer' },
      { status: 500 }
    );
  }
}
