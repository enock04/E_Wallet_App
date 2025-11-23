import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://iowreppdothighktxcql.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvd3JlcHBkb3RoaWdoa3R4Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTk3MjEsImV4cCI6MjA3OTM5NTcyMX0.F-j8CP8U0zxQWhTl3W9Pf5f5qcK4fwOHLNYi_UwdxTY';

export const supabase = createClient(supabaseUrl, supabaseKey);

