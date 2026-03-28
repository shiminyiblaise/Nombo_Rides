import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://tusivpfkdjtpffbsdagq.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNmYTE2ZTBkLTUzODctNGE4NC05ZjhkLTFhYWE0ZmU0NzY0YiJ9.eyJwcm9qZWN0SWQiOiJ0dXNpdnBma2RqdHBmZmJzZGFncSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc0NzQ2NjQ2LCJleHAiOjIwOTAxMDY2NDYsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.g5DKCdTkzQjI_O6OpQZp9-8RmFtZznE7m1UXQamRa44';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };