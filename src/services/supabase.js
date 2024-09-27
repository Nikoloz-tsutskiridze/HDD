import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://wannxungntczlafglvyu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhbm54dW5nbnRjemxhZmdsdnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyODU2OTMsImV4cCI6MjA0Mjg2MTY5M30.kDPYx7eZ77Dmu3JrYUHd3-pPbYARyg-4jjGQd9JNhzc";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
