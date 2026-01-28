# 📋 How Enquiries Work Now

## The Complete Flow

### 1️⃣ Customer Submits an Enquiry
- Customer clicks **"❓ Enquire"** on any product card
- Redirected to `enquiry.html?product=ProductName`
- Product field auto-fills
- Customer fills: Name, Email, Message/Quantity
- Clicks **"Send Enquiry"** button

### 2️⃣ Where Does It Go?
The enquiry is saved in **two places** (for redundancy):

**Primary: Supabase Database**
- If Supabase is configured, enquiry saves to `enquiries` table
- Available for admin to view in real-time
- Professional, persistent storage

**Fallback: Browser Storage**
- If Supabase fails or not configured, saves to `localStorage`
- Available in browser's developer tools (F12 → Application)
- Useful for testing/demo mode

### 3️⃣ Admin Checks Enquiries
Option A: **Via Web Portal** (Recommended)
1. Go to your site and click **"🔓 Admin Login"**
2. Enter password: `admin123`
3. Click **"Sell (Admin)"** to go to admin panel
4. Click **"📧 Enquiries"** tab at top
5. See all customer enquiries with email, product, message
6. Click **"Reply"** to open email client
7. Click **"Delete"** to remove enquiry

Option B: **Via Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "Table Editor"
4. Select `enquiries` table
5. See all enquiries listed

## Multiple Edits Fix ✅

**Problem:** Admin could only add one product per login session, then had to refresh.

**Solution:** Form now completely resets after saving:
```javascript
form.reset();                          // Clear all fields
document.getElementById('editingId').value='';  // Clear edit mode
form.elements['id'].value = '';       // Clear ID field
form.elements['id'].disabled=false;    // Re-enable ID for new product
document.getElementById('imageUpload').value = ''; // Clear file input
```

**Result:** Admin can now add/edit multiple products in one login session without any issues.

---

## Setting Up Enquiries Persistence

### If Using Supabase (Recommended)

**Step 1: Create the Table**
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

**Step 2: That's It!**
- Enquiries now save to Supabase automatically
- Admin can view them in `admin-enquiries.html`

**Step 3 (Optional): Get Email Notifications**
- See `SETUP-ENQUIRIES.md` for Edge Function example
- Alternatively, admin can manually check `admin-enquiries.html` and reply via email

### If Not Using Supabase (Demo Mode)

- Enquiries save to browser's `localStorage`
- Open any page's developer tools (F12 → Application → Local Storage)
- Search for key: `enquiries`
- Shows array of all submitted enquiries
- This is fine for testing but doesn't persist across browsers

---

## How Forms Handle Data

### Product Form (admin.html)
**Sends to Supabase:**
```javascript
{
  id: "p1",                    // Product ID
  name: "Beaded Bracelet",     // Product name
  price: 6.50,                 // Price as number
  image: "https://...",        // Image URL or base64
  description: "..."           // Description
}
```
✅ Non-database fields are filtered out before sending

### Enquiry Form (enquiry.html)
**Sends to Supabase:**
```javascript
{
  product: "Beaded Bracelet",  // Product name
  name: "Sarah",               // Customer name
  email: "sarah@gmail.com",    // Customer email
  message: "I want 2 of these",// Customer message
  timestamp: "2024-01-15T..."  // ISO timestamp
}
```
✅ Automatically adds timestamp for tracking

### Checkout Form (checkout.html)
**Sends to Supabase:**
```javascript
{
  name: "John",                // Buyer name
  email: "john@gmail.com",     // Buyer email
  address: "123 Main St",      // Shipping address
  items: [...],                // Cart items
  total: 45.99,                // Order total
  timestamp: "2024-01-15T..."  // Order time
}
```
✅ Captures full order details for admin review

---

## File Structure

```
chittooz website/
├── index.html                    # Shop page (browse products)
├── admin.html                    # Product management (add/edit/delete)
├── admin-enquiries.html          # View customer enquiries ⭐ NEW
├── enquiry.html                  # Customer inquiry form
├── checkout.html                 # Checkout page
├── about.html                    # About page
├── contact.html                  # Contact form (optional)
├── script.js                     # Core logic (auth, cart, render)
├── styles.css                    # All styling
├── products.js                   # Default products fallback
├── supabase-config.js            # Supabase credentials
├── supabase-products.js          # Product CRUD helpers
├── SETUP-ENQUIRIES.md            # This setup guide
└── DOCUMENTATION.md              # Detailed reference
```

---

## Testing Checklist

- [ ] Hard refresh site: `Ctrl+Shift+R`
- [ ] Clear localStorage: F12 → Application → Clear all
- [ ] Test 1: Submit enquiry, see success message
- [ ] Test 2: Login as admin, see enquiry in `admin-enquiries.html`
- [ ] Test 3: Add 2+ products in one admin session (without refresh)
- [ ] Test 4: Verify products appear in Supabase `products` table
- [ ] Test 5: Click "Reply" button on enquiry (opens email)
- [ ] Test 6: Click "Delete" on enquiry (removes from list)

---

## Common Issues & Fixes

### Enquiry not saving
**Check:**
1. Browser console for errors (F12 → Console)
2. Supabase config is correct (check `supabase-config.js`)
3. Enquiries table exists in Supabase (run the SQL above)

**Fallback:** Check localStorage (F12 → Application → enquiries)

### Can't see enquiries in `admin-enquiries.html`
**Check:**
1. You're logged in as admin (password: `admin123`)
2. Supabase is configured (non-empty URL/key in `supabase-config.js`)
3. Enquiries table created in Supabase (see Step 1 above)

### Admin form not saving or resetting
**Fix:**
1. Hard refresh: Ctrl+Shift+R
2. Clear cache: F12 → Network → disable cache, refresh
3. Test in incognito window (no cached code)

---

## Admin Login Credentials

| Field | Value |
|-------|-------|
| Username | (no username required) |
| Password | `admin123` |
| URL | Click "🔓 Admin Login" on any page |

**To change password:**
Edit `script.js`, search for `ADMIN_PASSWORD` and change the value.

---

## Next Steps (Optional)

### 1. Enable Email Notifications
Follow the Edge Function example in `SETUP-ENQUIRIES.md` to automatically email admin when customers submit enquiries.

### 2. Set Up Orders Table (For Checkouts)
If you want to persist checkout orders to Supabase:
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

### 3. Customize Messages
Edit the success messages in `enquiry.html` and `admin.html`:
- Line 241: Success message for enquiry
- Line 112: Success message for product save

---

## Live Site

Your site is now live at:
👉 **https://raztute.github.io/chittooz-website**

Every time you push changes to GitHub, the site auto-updates (usually within 1-2 minutes).

Changes made in this session:
- ✅ Added admin enquiries page (`admin-enquiries.html`)
- ✅ Fixed multi-edit form reset bug
- ✅ Improved enquiry form to save to Supabase
- ✅ Added enquiry navigation link in admin panel
- ✅ Created comprehensive setup guide

Happy selling! 🎉
