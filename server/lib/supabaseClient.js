const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ SUPABASE_URL or SUPABASE_ANON_KEY is missing in server/.env');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
