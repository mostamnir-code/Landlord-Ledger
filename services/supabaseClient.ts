// In a real project, you would import this from the library
// import { createClient } from '@supabase/supabase-js';
const { createClient } = (window as any).supabase;

const supabaseUrl = 'https://gbylisuqixmgebdokfol.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdieWxpc3VxaXhtZ2ViZG9rZm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyOTAwNjQsImV4cCI6MjA3ODg2NjA2NH0.6SmDAcbbzewyV_NVAzxwB26WxTwFBhgU-_kbmxTo_vk';

const isConfigured = !!(supabaseUrl && supabaseKey && createClient);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!isConfigured) {
  console.error("Supabase URL, Key, or client is not available. The app will not function correctly.");
}
