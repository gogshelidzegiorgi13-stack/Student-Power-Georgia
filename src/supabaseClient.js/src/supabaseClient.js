import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jngzlorzhnzcffgoxdzn.supabase.co'
const supabaseAnonKey = 'sb_publishable_nbbT_om7rJ_8ZUHuH9cpjA_QRndi...' // 👈 აქ შენი სრული Publishable Key ჩასვი

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
