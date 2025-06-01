import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khzmkwfrbsnpfpooxnlg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoem1rd2ZyYnNucGZwb294bmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDYwOTIsImV4cCI6MjA2NDM4MjA5Mn0.NQRJMWUlfwkIXAUZ3W4wFeDZHSa4UdWf-cVZvpmhN1o'

export const supabase = createClient(supabaseUrl, supabaseKey)
