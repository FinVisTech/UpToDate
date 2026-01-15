
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohyepjmdkqhqwzmqupyc.supabase.co';
const supabaseKey = 'sb_publishable_N76_nkOVLbGR3S73kKLRMQ_W3TpB62f'; // Public Anon Key

export const supabase = createClient(supabaseUrl, supabaseKey);
