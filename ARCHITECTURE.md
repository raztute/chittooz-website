# 🏗️ Architecture & Data Flow Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER SIDE                               │
├─────────────────────────────────────────────────────────────────────┤
│
│  index.html (Shop)                    enquiry.html (Enquiry Form)
│  ├─ Browse products                   ├─ Fill customer details
│  ├─ Add to cart                       ├─ Submit enquiry
│  ├─ View cart                         └─ See confirmation
│  └─ Checkout                          
│
│  about.html (Brand Story)
│  └─ Learn about Little Makers
│
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   localStorage (Demo)    │
                    ├──────────────────────────┤
                    │ cart: [...],             │
                    │ orders: [...],           │
                    │ enquiries: [...]         │
                    └──────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN SIDE                                  │
├─────────────────────────────────────────────────────────────────────┤
│
│  1. Login with password (admin123)
│                  │
│                  ▼
│  admin.html (Product Management)       admin-enquiries.html
│  ├─ Add products                       ├─ View all enquiries
│  ├─ Edit products                      ├─ Reply to customers
│  ├─ Delete products                    └─ Delete old enquiries
│  └─ Sync to Supabase                   
│
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │    Supabase (Production) │
                    ├──────────────────────────┤
                    │ products table           │
                    │ enquiries table          │
                    │ orders table             │
                    └──────────────────────────┘
```

---

## Data Flow: Customer Enquiry

```
Customer Action                    Data Storage                 Admin View
─────────────────────────────────────────────────────────────────────────

Customer clicks 
"❓ Enquire"
       │
       ▼
Redirect to enquiry.html?product=X
       │
       ├─ Product field auto-filled
       │
       ▼
Customer fills form:
  • Name
  • Email  
  • Message/Quantity
       │
       ▼
Clicks "Send Enquiry"
       │
       ├─ Creates enquiryData object
       │  {product, name, email, message, timestamp}
       │
       ├─────────────────────────────────────────────┐
       │                                             │
       ▼ (Try First)                                 ▼ (Fallback)
  Supabase Insert                              localStorage.setItem
  to 'enquiries' table                         key: 'enquiries'
       │                                             │
       ├─ Success                                   │
       └─────────────────────────────────────────────┘
                   │
                   ▼
         "✓ Enquiry Saved!"
          Success message
                   │
                   ├─────────────────────────────────────────┐
                   │                                         │
                   ▼ Option A: Web Portal                    ▼ Option B: Supabase
              admin-enquiries.html               https://supabase.com/dashboard
              ├─ Login (admin123)                ├─ Select project
              ├─ See all enquiries               ├─ Table Editor
              ├─ Click Reply → Email             └─ View enquiries table
              └─ Click Delete → Remove
```

---

## Data Flow: Admin Adds Product

```
Admin Action                   Product Storage               Shop Display
────────────────────────────────────────────────────────────────────────

1. Click "🔓 Admin Login"
   Enter password: admin123
   localStorage.adminSession = 'true'
           │
           ▼
2. Click "Sell (Admin)"
   Go to admin.html
           │
           ▼
3. Fill product form:
   • ID (unique key)
   • Name
   • Price
   • Image (URL or upload)
   • Description
           │
           ▼
4. Click "Save Product"
           │
           ├─────────────────────────────────────────┐
           │                                         │
           ▼ (Try First)                             ▼ (Fallback)
       Supabase Upsert                          localStorage merge
       to 'products' table                       with DEFAULT_PRODUCTS
           │                                         │
           ├─ Success                               │
           └─────────────────────────────────────────┘
                   │
                   ▼
         "Product saved!"
         Form fully resets
           │
           ├─ editingId = ''
           ├─ id field cleared
           ├─ image upload cleared
           └─ Ready for next product!
                   │
                   ▼
           Admin can add another product
           (no refresh needed!)
                   │
                   ▼
   ┌─────────────────────────────────────┐
   │  Customers see new product in:      │
   │  - index.html shop grid             │
   │  - Enquiry form dropdown            │
   │  - About page (if featured)         │
   └─────────────────────────────────────┘
```

---

## Data Flow: Multiple Edits Fix

### BEFORE (Broken)
```
Add Product A
    ▼
form.reset() ← Only clears field values
    ▼
editingId still = old value ← BUG!
    ▼
Add Product B
    ▼
Product B overwrites Product A
```

### AFTER (Fixed)
```
Add Product A
    ▼
form.reset()                          ← Clear all field values
editingId = ''                        ← Clear edit mode
id field = ''                         ← Clear ID field  
id field.disabled = false             ← Re-enable for new product
imageUpload = ''                      ← Clear file input
    ▼
renderProductList()                   ← Show updated list
    ▼
Add Product B
    ▼
Product B saves separately ✓
Product A remains unchanged ✓
```

---

## Authentication & Session Flow

```
┌─────────────────────────────────────┐
│      Customer (No Login)             │
├─────────────────────────────────────┤
│ • Browse shop                        │
│ • Add to cart                        │
│ • Submit enquiry                     │
│ • Checkout                           │
│ • No localStorage admin session      │
└─────────────────────────────────────┘
           │
           ▼ Click "🔓 Admin Login"
┌─────────────────────────────────────┐
│      Login Modal Appears             │
├─────────────────────────────────────┤
│ Prompt: "Enter admin password"       │
│ Input: admin123                      │
│ localStorage.adminSession = 'true'   │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│      Admin (Logged In)               │
├─────────────────────────────────────┤
│ • "Sell (Admin)" link visible ✓      │
│ • Edit buttons on products ✓         │
│ • Can access admin.html ✓            │
│ • Can access admin-enquiries.html ✓  │
│ • "🔒 Logout" button visible         │
└─────────────────────────────────────┘
           │
           ▼ Click "🔒 Logout"
┌─────────────────────────────────────┐
│  Session Cleared                     │
├─────────────────────────────────────┤
│ localStorage.adminSession = null     │
│ Redirect to index.html               │
│ Back to customer view                │
└─────────────────────────────────────┘
```

---

## File Dependencies & Data Flow

```
index.html (Shop)
├── products.js                  ← Default product catalog
├── script.js                    ← Cart logic, product render, auth UI
├── supabase-config.js           ← Supabase client init
├── supabase-products.js         ← Fetch products from Supabase
└── styles.css                   ← Responsive styling


admin.html (Products)
├── products.js                  ← Default products for merge
├── script.js                    ← Auth check, form handlers
├── supabase-config.js           ← Supabase client
├── supabase-products.js         ← Upload image, upsert product
└── styles.css


admin-enquiries.html (Enquiries) ⭐ NEW
├── supabase-config.js           ← Supabase client
└── Fetches from enquiries table


enquiry.html (Customer Enquiry)
├── script.js                    ← Cart, auth UI
├── supabase-config.js           ← Supabase client
└── Form saves to enquiries table


checkout.html (Orders)
├── script.js                    ← Cart items display
├── supabase-config.js           ← Supabase client
└── Form saves to orders table
```

---

## Supabase Tables Schema

### products table
```
id          TEXT (PRIMARY KEY)     - "p1", "p2", etc.
name        TEXT                   - "Beaded Bracelet"
price       NUMERIC                - 6.50
image       TEXT                   - URL or base64
description TEXT                   - Product details
created_at  TIMESTAMP              - Auto-filled
```

### enquiries table (Create this!)
```
id          UUID (PRIMARY KEY)     - Auto-generated
product     TEXT                   - "Beaded Bracelet"
name        TEXT                   - Customer name
email       TEXT                   - Customer email
message     TEXT                   - Enquiry message
timestamp   TIMESTAMPTZ            - Auto-filled
```

### orders table (Optional)
```
id          UUID (PRIMARY KEY)     - Auto-generated
name        TEXT                   - Buyer name
email       TEXT                   - Buyer email
address     TEXT                   - Shipping address
items       JSONB                  - Cart items array
total       NUMERIC                - Order total
timestamp   TIMESTAMPTZ            - Auto-filled
```

---

## Fallback Chain (What Happens If Something Fails)

```
Step 1: Try to load products
  ├─ Try Supabase fetch
  │  ├─ Success → Display Supabase products + merged with defaults
  │  └─ Fail → Fall through to Step 2
  │
  └─ Fall back to localStorage
     ├─ Success → Display localStorage products
     └─ Fail → Fall through to Step 3
     
Step 3: Use DEFAULT_PRODUCTS
  └─ Always works (hardcoded fallback)

Result: Products ALWAYS display to customer, never blank!


Step 1: Try to save enquiry
  ├─ Try Supabase insert
  │  ├─ Success → Saved to database
  │  └─ Fail → Fall through to Step 2
  │
  └─ Fall back to localStorage
     └─ Saved locally for now
     
Result: Enquiry ALWAYS saves, even offline!
```

---

## Performance & Caching

### Browser Cache Busting
All scripts loaded with version parameter:
```html
<script src="script.js?v=2"></script>
<script src="supabase-config.js?v=2"></script>
```

When you update code:
1. Change `?v=2` to `?v=3`
2. Users automatically load fresh code (no stale cache)

### Storage Optimization
- **localStorage**: ~5-10MB limit per domain
- **Supabase**: Unlimited (cloud database)
- **Images**: Hosted on Supabase Storage (not localStorage)

---

## Security Notes

⚠️ **Current Setup:**
- Admin password stored in `script.js` (client-side)
- Suitable for: Demo, internal use, low-security sites
- Not suitable for: Production e-commerce with sensitive data

✅ **To improve security:**
1. Use Supabase Auth (OAuth, email verification)
2. Enable Row Level Security (RLS) policies
3. Move admin logic to backend (Edge Functions)
4. Use environment variables for secrets (not hardcoded)

---

## Deployment: How Updates Work

```
Your Computer                GitHub                   GitHub Pages
─────────────────────────────────────────────────────────────────

You make changes
    │
    ▼
git add .
git commit -m "message"
git push origin main
    │
    ├──────────────────→ Push to GitHub repo
    │                   │
    │                   ▼
    │                   Webhook triggers
    │                   │
    │                   ▼
    │                   Build & Deploy
    │                   │
    │                   ├──────────────────→ Live at:
    │                   │                   https://raztute.github.io/
    │                   │                   chittooz-website
    │                   │
    │                   └─ Takes 1-2 minutes
    │
    └─ Your local site still running
       (for testing before push)
```

---

## Testing Workflow

```
1. Local Testing (localhost)
   └─ Make changes
   └─ Test in browser
   └─ Check console for errors

2. Push to GitHub
   └─ git add -A
   └─ git commit -m "..."
   └─ git push

3. Wait 1-2 minutes

4. Test Live Site
   └─ Visit https://raztute.github.io/chittooz-website
   └─ Hard refresh: Ctrl+Shift+R
   └─ Clear cache: F12 → Network → disable cache
   └─ Open in incognito window (zero cache)

5. If not updated
   └─ Wait another minute
   └─ Check GitHub Pages settings (in repo)
   └─ Verify gh-pages branch exists
```

---

## Troubleshooting Decision Tree

```
Product doesn't appear in shop?
├─ Check Supabase products table
│  └─ Is it there? Yes → Check if Supabase scripts loaded (F12)
│     └─ No fix: Hard refresh (Ctrl+Shift+R)
│  └─ Is it there? No → Check localStorage (F12 → Application)
│     └─ No → Add product via admin.html
│
├─ Check if default products load
│  └─ Open index.html
│  └─ Should see 6 default products
│  └─ If not → Check products.js loaded (F12 → Sources)
│
└─ Check console errors (F12 → Console)
   └─ Fix any shown errors


Enquiry doesn't save?
├─ Check if Supabase configured
│  ├─ Visit supabase-config.js
│  ├─ Is SUPABASE_URL filled in? 
│  │  └─ No → Add your Project URL
│  └─ Is SUPABASE_ANON_KEY filled in?
│     └─ No → Add your anon key
│
├─ Check if enquiries table exists
│  ├─ Go to Supabase Dashboard
│  ├─ SQL Editor → Paste CREATE TABLE SQL
│  └─ Run it
│
├─ Check localStorage fallback
│  ├─ F12 → Application → Local Storage
│  ├─ Look for 'enquiries' key
│  ├─ Is data there? Yes → Fallback works!
│  └─ No → Check console errors
│
└─ Check admin-enquiries.html
   ├─ Are you logged in? (Click "🔓 Admin Login")
   ├─ Is password correct? (admin123)
   └─ Does table show enquiries?


Admin can't edit second product?
├─ Is form fully resetting after save?
│  └─ Check all fields clear
│  └─ Check "editingId" console.log
│
├─ Do you need to refresh between edits?
│  └─ No, new form reset fixes this
│  └─ Hard refresh site (Ctrl+Shift+R)
│
└─ Check product duplication
   └─ F12 → Application → localStorage → products
   └─ Are both products in the list?
```

