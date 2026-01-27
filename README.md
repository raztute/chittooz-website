# Kids Crafts Shop (Static)

Simple static e-commerce demo to sell handmade kids crafts (beads, crochet, keychains).

Usage
- Open [index.html](index.html) in a browser.
- Browse products and click "Add to cart". Cart persists in `localStorage`.
- Click "Checkout" to place an order. Orders are saved to `localStorage` (demo only).

Admin / Add product
- Open [admin.html](admin.html).
- Add a product with a unique `id`. This saves to `localStorage` and appears in `index.html`.

Notes
- This is a static demo (no backend, no real payments). For production add a server and payment gateway.

Local server (quick test)
- From PowerShell in the project folder run one of these commands to serve files at http://localhost:8000:

```powershell
py -3 -m http.server 8000
# or if `py` isn't available
python -m http.server 8000
```

- With Node.js you can use `npx http-server . -p 8000`.

Testing contacts and orders
- Contact: open [contact.html](contact.html), submit the form. Messages are saved to `localStorage` under the `contacts` key.
- Orders: place an order on [checkout.html](checkout.html). Orders are saved to `localStorage` under the `orders` key.
- To inspect saved data open browser DevTools → Application (or Storage) → Local Storage → select this origin and view `contacts`, `orders`, or `products`.
 - To inspect saved data open browser DevTools → Application (or Storage) → Local Storage → select this origin and view `contacts`, `orders`, or `products`.

Tip: clearing `localStorage` will remove demo orders and contacts.

---

Supabase integration (optional)

Create a Supabase project at https://app.supabase.com and note your Project URL and anon/public API key.

1) Table schema
Run this SQL in the Supabase SQL editor to create a simple `orders` table:

```sql
create extension if not exists pgcrypto;
create table public.orders (
	id uuid default gen_random_uuid() primary key,
	buyer jsonb,
	items jsonb,
	total numeric,
	status text,
	created timestamptz default now()
);
```

2) Add config file
- Copy `supabase-config.example.js` to `supabase-config.js` and fill `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Optionally set `SUPABASE_FUNCTION_URL` (see next).

3) Checkout behavior
- With `supabase-config.js` present the checkout page will insert orders into the `orders` table instead of saving locally. If `SUPABASE_FUNCTION_URL` is set the checkout will POST the inserted order to that URL to trigger a confirmation email.

4) Sending confirmation emails
- Supabase Edge Functions can be used to send transactional emails (SendGrid, SMTP, etc.). Create an Edge Function `/send-confirmation` that accepts the order JSON and sends the email, then set `SUPABASE_FUNCTION_URL` in `supabase-config.js` to point to it.

Sample Edge Function pseudocode (Node) using SendGrid:

```js
// handler.js (edge function)
export default async (req, res) => {
	const { order } = await req.json();
	// send using your email provider API (SendGrid example)
	await fetch('https://api.sendgrid.com/v3/mail/send', {
		method: 'POST',
		headers: { 'Authorization': 'Bearer <SENDGRID_KEY>', 'Content-Type': 'application/json' },
		body: JSON.stringify({ /* build email to order.buyer.email */ })
	});
	return res.json({ ok: true });
}
```

Security notes
- Do NOT put your Supabase `service_role` key into client-side `supabase-config.js`. Use only the anon/public key in client code and use server-side functions for sensitive operations.
- Consider enabling Row Level Security (RLS) and writing policies to protect data. For admin actions prefer using server-side endpoints or functions that use the `service_role` key.

Admin orders view
- For Supabase-backed orders open [admin-orders.html](admin-orders.html) (requires `supabase-config.js`).
- For the local/demo mode (when orders are saved to `localStorage`) open [admin-orders-local.html](admin-orders-local.html). It shows saved orders and lets you edit buyer details or delete orders. This page asks for a demo password (`admin`).

