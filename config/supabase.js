
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = "https://wtopxfdjnjqwhtqmwnsz.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0b3B4ZmRqbmpxd2h0cW13bnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTUzNzQsImV4cCI6MjA1NjYzMTM3NH0.8KI_0-GUraxFYLrOauafUfbU2ZxCCPylEN2EJ0EDwww"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

