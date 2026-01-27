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
// Example function URL formats (replace <project> with your project ref):
// - If deployed via Supabase Functions (recommended):
//   https://<project>.functions.supabase.co/send-confirmation
// - If using Functions v1 URL format: (older projects)
//   https://<project>.supabase.co/functions/v1/send-confirmation
// Set this to your deployed function URL to enable automatic confirmation emails.
