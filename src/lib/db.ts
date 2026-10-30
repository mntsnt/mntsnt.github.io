import fs from 'fs';
import path from 'path';
import { PortfolioData, MessageItem } from '@/types/portfolio';
import { initialPortfolioData } from '@/data/initialData';
import { getSupabaseAdmin } from './supabase/admin';

const DATA_DIR = path.join(process.cwd(), 'data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', 'portfolio_data')
        .maybeSingle();

      if (!error && data?.data) {
        return data.data as PortfolioData;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local file storage:', err);
    }
  }

  // Local file fallback
  try {
    ensureDataDir();
    if (fs.existsSync(PORTFOLIO_FILE)) {
      const content = fs.readFileSync(PORTFOLIO_FILE, 'utf8');
      return JSON.parse(content);
    } else {
      fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(initialPortfolioData, null, 2), 'utf8');
      return initialPortfolioData;
    }
  } catch (err) {
    console.error('Error reading local portfolio data:', err);
    return initialPortfolioData;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await supabase.from('site_content').upsert(
        {
          key: 'portfolio_data',
          data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
      if (error) {
        console.error('Supabase upsert error:', error);
      }
    } catch (err) {
      console.error('Failed to save to Supabase:', err);
    }
  }

  // Also keep local file in sync
  try {
    ensureDataDir();
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local portfolio data:', err);
    throw err;
  }
}

export async function getMessages(): Promise<MessageItem[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as MessageItem[];
      }
    } catch (err) {
      console.warn('Supabase getMessages failed, falling back to local file storage:', err);
    }
  }

  try {
    ensureDataDir();
    if (fs.existsSync(MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveMessage(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<MessageItem> {
  const newMessage: MessageItem = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: msg.name,
    email: msg.email,
    subject: msg.subject,
    message: msg.message,
    read: false,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.from('messages').insert({
        id: newMessage.id,
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject,
        message: newMessage.message,
        read: false,
        created_at: newMessage.created_at,
      });
    } catch (err) {
      console.warn('Failed to save message to Supabase, continuing with local:', err);
    }
  }

  try {
    ensureDataDir();
    const current = await getMessages();
    const updated = [newMessage, ...current];
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save message to local storage:', err);
  }

  return newMessage;
}

export async function updateMessage(id: string, updates: Partial<MessageItem>): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.from('messages').update(updates).eq('id', id);
    } catch (err) {
      console.warn('Supabase message update failed:', err);
    }
  }

  try {
    ensureDataDir();
    const current = await getMessages();
    const updated = current.map((m) => (m.id === id ? { ...m, ...updates } : m));
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to update local message:', err);
  }
}

export async function deleteMessage(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.from('messages').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase message delete failed:', err);
    }
  }

  try {
    ensureDataDir();
    const current = await getMessages();
    const updated = current.filter((m) => m.id !== id);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to delete local message:', err);
  }
}
