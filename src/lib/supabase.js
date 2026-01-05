import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://nqvacjuvzmdvcqjwmorc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdmFjanV2em1kdmNxandtb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NTMwNTgsImV4cCI6MjA4MzEyOTA1OH0.IZA7C6CbHztUvcKoB5dQowsgu_6Kwmq6MA_UvYyQE1w'
)
