/*
  SUPABASE CONFIG (fill these values from your Supabase project)

  1. In Supabase dashboard go to Project Settings → API
     - Copy the "Project URL" value to SUPABASE_URL
     - Copy the "anon public" key to SUPABASE_ANON_KEY

  2. Optionally set SUPABASE_FUNCTION_URL to your deployed Edge Function URL
     (e.g. https://<project>.functions.supabase.co/send-confirmation)

  WARNING: Do NOT add your `service_role` key here. Keep the service_role key secret and use server-side functions for admin actions.
*/

window.SUPABASE_URL = '<REPLACE_WITH_YOUR_SUPABASE_PROJECT_URL>';
window.SUPABASE_ANON_KEY = '<REPLACE_WITH_YOUR_ANON_KEY>';
window.SUPABASE_FUNCTION_URL = ''; // optional: set to your function URL to send confirmation emails

// After filling these values, reload admin-orders.html and checkout.html to use Supabase features.
/*
  Copy this file to `supabase-config.js` and fill values from your Supabase project.

  WARNING: Never commit your `service_role` key to client-side code. Use only the anon/public key here.

  SUPABASE_URL: your project URL (e.g. https://xyzabc.supabase.co)
  SUPABASE_ANON_KEY: your anon/public API key
  SUPABASE_FUNCTION_URL: optional — URL to your Edge Function or webhook that will send confirmation emails.
    Example: 'https://<project>.functions.supabase.co/send-confirmation'
*/

window.SUPABASE_URL = 'https://vcrbvxbqstbzweehysti.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcmJ2eGJxc3RiendlZWh5c3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzM0ODUsImV4cCI6MjA4NDk0OTQ4NX0.vf6xGH2SefO4KVQ_ib_zWF38ZwBbV1WfSckwEtukKFE';
window.SUPABASE_FUNCTION_URL = ''; // optional
