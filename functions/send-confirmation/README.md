This folder contains an example Supabase Edge Function that sends a confirmation email when an order is placed.

Notes
- This example uses SendGrid (HTTP API) and expects `SENDGRID_API_KEY` to be configured in the function's environment variables.
- Deploy this function with the Supabase CLI (`supabase functions deploy send-confirmation`).

How it works
- Checkout inserts the order into the `orders` table.
- After insert the checkout page POSTs the inserted order JSON to this function's public URL.
- The function sends an email to `order.buyer.email` and returns { ok: true }.
