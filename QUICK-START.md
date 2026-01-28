# ⚡ Quick Start Guide

## What Was Just Fixed

### 1. ✅ Multiple Edit Issue - FIXED
**Problem:** Admin could only add one product per login, then had to refresh.  
**Solution:** Form now completely resets after each save (no refresh needed).  
**Result:** Add 2, 3, or 10+ products in one login session!

### 2. ✅ Enquiry System - IMPLEMENTED  
**Problem:** How do enquiries work? Where do they go?  
**Solution:** Enquiries save to Supabase database + admin portal to view/reply.  
**Result:** Professional enquiry management system with 3 ways to access.

---

## Testing (5 minutes)

### Test 1: Multiple Product Edits
```
1. Visit: https://raztute.github.io/chittooz-website
2. Click "🔓 Admin Login" → Enter: admin123
3. Click "Sell (Admin)"
4. Fill form:
   - ID: product1
   - Name: Test Product 1
   - Price: 9.99
   - Click "Save Product"
5. Notice form fully clears
6. Fill form again:
   - ID: product2
   - Name: Test Product 2
   - Price: 14.99
   - Click "Save Product"
7. Both products appear in list ✓
```

### Test 2: Customer Enquiry
```
1. Go to shop (index.html)
2. Click "❓ Enquire" on any product
3. Fill form:
   - Name: John Smith
   - Email: john@example.com
   - Message: "Can I buy 2 of these?"
4. Click "Send Enquiry"
5. See: "✓ Enquiry sent!" ✓
```

### Test 3: Admin Views Enquiry
```
1. Click "🔓 Admin Login" → admin123
2. Click "Sell (Admin)"
3. Click "📧 Enquiries" tab
4. See John's enquiry listed ✓
5. Click "Reply" → Email opens with pre-filled response
```

---

## Setup Checklist

### ✅ Already Done (You're Good!)
- [x] Static HTML site created
- [x] Supabase integrated
- [x] GitHub Pages deployment
- [x] Admin password protection
- [x] Multiple edit form reset
- [x] Enquiry system with admin portal
- [x] Responsive design
- [x] Product image support

### 📋 Still To Do (Optional but Recommended)

#### Step 1: Create Enquiries Table in Supabase
Go to Supabase Dashboard → SQL Editor, paste this:
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

**Why:** Persist enquiries to database (instead of just browser).

#### Step 2 (Optional): Set Up Email Notifications
See `SETUP-ENQUIRIES.md` for instructions on sending auto-emails.

**Why:** Admin gets notified immediately when customer enquires.

#### Step 3: Create Orders Table (If Needed)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB,
  total NUMERIC,
  timestamp TIMESTAMPTZ DEFAULT now()
);
```

**Why:** Track all customer orders.

---

## Daily Use

### For Customers
1. Visit: https://raztute.github.io/chittooz-website
2. Browse products → Add to cart
3. Click "❓ Enquire" to send inquiry
4. Checkout with details

### For You (Admin)
1. Click "🔓 Admin Login" (password: `admin123`)
2. Go to "Sell (Admin)" to add/edit/delete products
3. Go to "📧 Enquiries" to see customer messages
4. Reply to enquiries via email

---

## File Reference

| File | Purpose | Access |
|------|---------|--------|
| `index.html` | Product shop | Everyone |
| `enquiry.html` | Send enquiries | Everyone |
| `checkout.html` | Place orders | Everyone |
| `about.html` | Brand story | Everyone |
| `admin.html` | Manage products | Admin only |
| `admin-enquiries.html` | View enquiries | Admin only |

---

## URL Cheat Sheet

| Page | URL |
|------|-----|
| Shop | `https://raztute.github.io/chittooz-website` |
| Admin Products | `https://raztute.github.io/chittooz-website/admin.html` |
| Admin Enquiries | `https://raztute.github.io/chittooz-website/admin-enquiries.html` |
| Enquiry Form | `https://raztute.github.io/chittooz-website/enquiry.html` |
| Checkout | `https://raztute.github.io/chittooz-website/checkout.html` |
| About | `https://raztute.github.io/chittooz-website/about.html` |

---

## Passwords & Keys

| Item | Value | Where |
|------|-------|-------|
| Admin Password | `admin123` | Any page → "🔓 Admin Login" |
| Supabase URL | `https://vcrbvxbqstbzweehysti.supabase.co` | `supabase-config.js` |
| Supabase Key | `eyJh...` (in your config) | `supabase-config.js` |

---

## Making Changes

### To add a product (as admin):
1. Login → "Sell (Admin)"
2. Fill form → "Save Product"
3. Done! Appears in shop immediately

### To edit a product (as admin):
1. Login → "Sell (Admin)"
2. Click "Edit" on product
3. Change details → "Save Product"
4. Done! Updated immediately

### To change admin password:
1. Edit `script.js`
2. Find: `ADMIN_PASSWORD = 'admin123'`
3. Change to your password
4. Push to GitHub

### To change website name:
1. Edit `index.html`, `admin.html`, `about.html`
2. Change `<h1>Little Makers Jewelry</h1>` to your name
3. Push to GitHub

---

## Pushing Changes to GitHub

```powershell
# In VS Code terminal:
cd c:\Users\sarik\OneDrive\Desktop\roshan\chittooz\ website

git add -A
git commit -m "Your description"
git push origin main

# Wait 1-2 minutes, then refresh the live site
```

---

## Troubleshooting

### Site looks outdated?
- Hard refresh: `Ctrl+Shift+R`
- Or clear cache: F12 → Network → disable cache

### Form not saving?
- Check browser console: F12 → Console
- Hard refresh the page

### Can't login as admin?
- Password is: `admin123`
- Make sure you typed it exactly

### Products not showing?
- Hard refresh the site
- Check Supabase is configured in `supabase-config.js`

### Need help?
- See `ARCHITECTURE.md` for detailed diagrams
- See `HOW-ENQUIRIES-WORK.md` for enquiry details
- See `SETUP-ENQUIRIES.md` for Supabase setup

---

## What's New in This Update

```
📅 Latest Changes:
✨ Added admin-enquiries.html - View all customer enquiries
✨ Fixed multi-edit bug - Add multiple products in one session
✨ Improved form reset - Complete field clearing
✨ Added comprehensive docs - Architecture, guides, quick-start
✨ Enhanced admin UI - Added "📧 Enquiries" navigation link
```

---

## Stats

| Metric | Value |
|--------|-------|
| Products supported | Unlimited (Supabase) |
| Cart items | Unlimited |
| Enquiries per month | Unlimited |
| Admin users | 1 (password protected) |
| Storage limit | 5-10MB (localStorage) + Unlimited (Supabase) |
| Speed | Instant (static pages) |
| Cost | Free (GitHub Pages + Supabase free tier) |

---

## Next Ideas (Future)

- [ ] Email notifications on enquiry
- [ ] Customer accounts & order history
- [ ] Product reviews/ratings
- [ ] Inventory tracking
- [ ] Payment integration (Stripe/PayPal)
- [ ] SMS alerts
- [ ] Analytics dashboard

---

## Support

**All documentation:**
- `README.md` - Original setup guide
- `DOCUMENTATION.md` - Detailed reference
- `HOW-ENQUIRIES-WORK.md` - Enquiry system guide
- `SETUP-ENQUIRIES.md` - Supabase setup
- `ARCHITECTURE.md` - System architecture
- `QUICK-START.md` - This file

**GitHub Repo:**
https://github.com/raztute/chittooz-website

**Live Site:**
https://raztute.github.io/chittooz-website

---

## Feedback

If something isn't working or you have questions:
1. Check the relevant `.md` file above
2. Check browser console (F12 → Console) for error messages
3. Try hard refresh (Ctrl+Shift+R)
4. Try in incognito window (no cached code)

Happy selling! 🎉

