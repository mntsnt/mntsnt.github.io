import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAdminSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(originalName);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;

    // Try Supabase Storage first if available
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { error: uploadErr } = await supabase.storage
          .from('portfolio-assets')
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from('portfolio-assets')
            .getPublicUrl(fileName);

          return NextResponse.json({
            url: publicUrlData.publicUrl,
            fileName,
          });
        }
      } catch (e) {
        console.warn('Supabase storage upload failed, saving locally:', e);
      }
    }

    // Local file fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName,
    });
  } catch (err) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
