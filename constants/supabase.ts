import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://cejbonokkxcgpekfcpjj.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlamJvbm9ra3hjZ3Bla2ZjcGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MDczMjcsImV4cCI6MjA3Mzk4MzMyN30.WN4TkIv5kH9eVtYh0mFd5iQwU9XW9skHdsVJMOpbwrE';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock as any,
    },
  })