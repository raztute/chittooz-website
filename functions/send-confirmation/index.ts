// Example Supabase Edge Function (Deno/TypeScript)
// Deploy with `supabase functions deploy send-confirmation`.

import { serve } from 'std/server';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') || '';

async function sendEmail(to:string, subject:string, htmlBody:string){
  if(!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY not set');
  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to:[{ email: to }] }],
      from: { email: 'no-reply@yourdomain.com', name: 'Kids Crafts Shop' },
      subject,
      content: [{ type: 'text/html', value: htmlBody }]
    })
  });
  if(!resp.ok) {
    const text = await resp.text();
    throw new Error('SendGrid error: ' + text);
  }
  return true;
}

serve(async (req) => {
  try{
    const { order } = await req.json();
    if(!order) return new Response(JSON.stringify({ error: 'no order provided' }), { status:400 });
    const buyer = order.buyer || {};
    const email = buyer.email;
    if(!email) return new Response(JSON.stringify({ error: 'buyer.email missing' }), { status:400 });

    const items = (order.items||[]).map((i:any)=>`<li>${i.id} x ${i.qty}</li>`).join('');
    const html = `
      <p>Hi ${buyer.name || 'Customer'},</p>
      <p>Thanks for your order! Here are the details:</p>
      <ul>${items}</ul>
      <p>Total: $${order.total}</p>
      <p>Order ID: ${order.id || ''}</p>
      <p>— Kids Crafts Shop</p>
    `;

    await sendEmail(email, 'Your Kids Crafts Shop order confirmation', html);
    return new Response(JSON.stringify({ ok:true }), { status:200, headers:{ 'Content-Type':'application/json' } });
  }catch(err:any){
    console.error('Error in send-confirmation:', err);
    return new Response(JSON.stringify({ error: err.message||String(err) }), { status:500 });
  }
});
