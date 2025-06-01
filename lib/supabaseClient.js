import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://TON-PROJET.supabase.co'
const supabaseKey = 'TON-CLÉ-API-PUBLIC'

export const supabase = createClient(supabaseUrl, supabaseKey)
