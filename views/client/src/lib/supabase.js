import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bwftfzyszjfumreaevda.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZnRmenlzempmdW1yZWFldmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTcwOTIsImV4cCI6MjA1OTYzMzA5Mn0.wgUJAWJB0DlLE45NHPBgS3vPlHnm8R-MEMlRcb6m7cs"

export const supabase = createClient(supabaseUrl, supabaseKey)