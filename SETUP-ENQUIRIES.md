# Setting Up Enquiries in Supabase

## Step 1: Create the Enquiries Table

Go to your Supabase dashboard and run this SQL in the SQL Editor:

```sql
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
);
```

## Step 2: Enable Row Level Security (Optional but Recommended)

```sql
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert enquiries
CREATE POLICY "Allow anyone to insert enquiries"
ON enquiries FOR INSERT
WITH CHECK (true);

-- Allow authenticated users (admin) to select all enquiries
CREATE POLICY "Allow admin to view all enquiries"
ON enquiries FOR SELECT
USING (true);
```

## Step 3: View Enquiries

Now when customers submit the enquiry form:
1. **Via Web**: Go to `admin-enquiries.html` (must be logged in as admin)
2. **Via Supabase**: Check the `enquiries` table in your Supabase dashboard

## How It Works

### Customer Submits Enquiry
- Form saves to Supabase `enquiries` table
- Fallback to localStorage if Supabase not configured
- Customer sees success message

### Admin Checks Enquiries
- Open `admin-enquiries.html` (requires password: `admin123`)
- See all enquiries with customer name, email, product, and message
- Click "Reply" to open email client with pre-filled reply
- Click "Delete" to remove old enquiries

## Optional: Email Notifications

To send automatic emails when customers submit enquiries, you can use a Supabase Edge Function.

Example Edge Function (TypeScript):

```typescript
// supabase/functions/send-enquiry-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    )

    // Get the enquiry from database
    const { data } = await supabaseClient
      .from('enquiries')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)

    if (!data || data.length === 0) {
      return new Response("No enquiry found", { status: 404 })
    }

    const enquiry = data[0]

    // Send email via SendGrid (requires SendGrid API key)
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY")
    if (!sendgridApiKey) {
      console.warn("SENDGRID_API_KEY not set")
      return new Response("Email service not configured", { status: 400 })
    }

    const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sendgridApiKey}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "your-admin-email@example.com" }],
            subject: `New Enquiry: ${enquiry.product}`,
          },
        ],
        from: { email: "noreply@littlemakesjewelry.com" },
        content: [
          {
            type: "text/html",
            value: `
              <h2>New Enquiry Received</h2>
              <p><strong>Product:</strong> ${enquiry.product}</p>
              <p><strong>Name:</strong> ${enquiry.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>
              <p><strong>Message:</strong></p>
              <p>${enquiry.message.replace(/\n/g, '<br>')}</p>
              <p><small>Received: ${new Date(enquiry.timestamp).toLocaleString()}</small></p>
            `,
          },
        ],
      }),
    })

    if (!emailResponse.ok) {
      throw new Error(`SendGrid error: ${emailResponse.status}`)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
```

To deploy this:
1. Install Supabase CLI: `npm install -g supabase`
2. Create the function: `supabase functions new send-enquiry-email`
3. Paste the code above
4. Set environment: `supabase secrets set SENDGRID_API_KEY="your-key"`
5. Deploy: `supabase functions deploy send-enquiry-email`

## Troubleshooting

### "Could not find 'enquiries' table"
- Run the SQL to create the table (see Step 1 above)
- Make sure you ran it in your Supabase project's SQL Editor

### Enquiries not saving
- Check browser console for errors (F12 → Console)
- Verify Supabase URL and anon key in `supabase-config.js`
- If Supabase fails, check localStorage instead (F12 → Application → Local Storage → enquiries)

### Can't access `admin-enquiries.html`
- You must be logged in as admin first
- Password is `admin123` (set in `script.js`)
- Click "🔓 Admin Login" on any page

