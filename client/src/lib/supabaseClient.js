import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxatddmqpxcbqxrsftxr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YXRkZG1xcHhjYnF4cnNmdHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTc3MDgsImV4cCI6MjA5MDI5MzcwOH0.yU2-evqmpe0RECBO1SWty9M80z25kZmsQ7Trp7ym_UI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
