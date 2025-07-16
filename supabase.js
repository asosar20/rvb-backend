const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gdchzhslbyfefiykhkea.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkY2h6aHNsYnlmZWZpeWtoa2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MjgzNjQsImV4cCI6MjA2ODIwNDM2NH0.opjH4kxRD6DxYKAsEWtUgJQO14eae3Zb7_A3iwkmzPw'
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase
