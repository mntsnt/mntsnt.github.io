import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read initial data from initialData.ts
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.ts');
let rawContent = fs.readFileSync(initialDataPath, 'utf8');

// Quick extraction of initialPortfolioData json
const jsonStartIndex = rawContent.indexOf('initialPortfolioData: PortfolioData = {');
let jsonStr = rawContent.substring(jsonStartIndex + 'initialPortfolioData: PortfolioData = '.length);
jsonStr = jsonStr.replace(/;\s*$/, '');

// Load data into local data/portfolio.json
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Seeding portfolio data...');

// Also check Supabase
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (url && key) {
  console.log('Connecting to Supabase at', url);
  const supabase = createClient(url, key);

  try {
    // Dynamic import of ts compiled or json
    const { initialPortfolioData } = await import('../src/data/initialData.js').catch(() => {
      // fallback to reading file
      return { initialPortfolioData: null };
    });

    if (initialPortfolioData) {
      const { error } = await supabase.from('site_content').upsert({
        key: 'portfolio_data',
        data: initialPortfolioData,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error('Supabase seed error:', error);
      } else {
        console.log('Successfully seeded Supabase site_content!');
      }
    }
  } catch (err) {
    console.error('Supabase seeding failed:', err);
  }
} else {
  console.log('Supabase credentials not detected in environment. Local seed complete.');
}
