const { supabase } = require('../lib/supabaseClient');

/**
 * Robustly verify a Supabase JWT.
 * Now uses the official Supabase SDK to support both symmetric (HS256) 
 * and asymmetric (ES256) algorithms issued by the cloud provider.
 */
async function verifySupabaseToken(token) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Supabase Auth error:', error?.message || 'User not found');
      throw new Error('Invalid token');
    }

    return user; // Returns user object with .id (matches decoded.sub)
  } catch (err) {
    console.error('JWT Verification failed:', err.message);
    throw new Error('Invalid token');
  }
}

module.exports = { verifySupabaseToken };
