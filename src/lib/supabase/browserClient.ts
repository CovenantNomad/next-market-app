import { createBrowserClient } from '@supabase/ssr'
import { supabaseKey, supabaseUrl } from '../constants'

const supabase = createBrowserClient(supabaseUrl, supabaseKey)

export default supabase