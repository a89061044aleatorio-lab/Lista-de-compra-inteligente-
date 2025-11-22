import { createClient } from '@supabase/supabase-js';

// Credenciais do Supabase
const supabaseUrl = 'https://mcepmblqrgcrmusjcqjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZXBtYmxxcmdjcm11c2pjcWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NzY3ODcsImV4cCI6MjA3OTM1Mjc4N30._bMxM610IjcIDNtqED5ZRJu_d6ptwlwdN5mLhixGZTs';

export const supabase = createClient(supabaseUrl, supabaseKey);