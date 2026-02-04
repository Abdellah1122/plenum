const { createClient } = require('@supabase/supabase-js');

// Load env if running locally (requires dotenv, but we can assume env vars are present in CI/CD)
// If running locally without dotenv package, ensure variables are passed or loaded.
// For simplicity in this project context where nextjs loads env:
// We will just read process.env.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.');
    process.exit(1);
}

const supabase = createClient(url, key);

async function ping() {
    console.log('Pinging Supabase to prevent sleep...');
    // Simple query to wake up the DB
    const { data, error } = await supabase.from('profiles').select('count').limit(1).single();

    if (error) {
        console.error('Ping failed:', error.message);
        process.exit(1);
    }

    console.log('Ping successful! Supabase is awake.');
}

ping();
