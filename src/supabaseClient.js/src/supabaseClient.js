import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'sb_publishable_nbbT_om7rJ_8ZUHuH9cpjA_QRndiTaD'

const supabaseAnonKey = 'sb_publishable_nbbT_om7rJ_8ZUHuH9cpjA_QRndi...' // 👈 შენი დაკოპირებული Publishable key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
