// Loads products (merges localStorage 'products' with defaults) and renders them.
const productsEl = document.getElementById('products');
const template = document.getElementById('product-template');
const cartBtn = document.getElementById('cartBtn');
const cartCountEl = document.getElementById('cart-count');
const cartModal = document.getElementById('cartModal');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('closeCart');

// Admin authentication constants
const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password
const ADMIN_SESSION_KEY = 'adminSession';

// Check if user is in admin mode
function isAdminLoggedIn(){
  try{ return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'; }catch(e){ return false; }
}

// Update admin UI visibility based on login state
function updateAdminUI(){
  const adminLink = document.getElementById('adminLink');
  const adminToggleBtn = document.getElementById('adminToggleBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  
  if(isAdminLoggedIn()){
    if(adminLink) adminLink.style.display = 'inline-block';
    if(adminToggleBtn) adminToggleBtn.style.display = 'none';
    if(adminLogoutBtn) adminLogoutBtn.style.display = 'inline-block';
  }else{
    if(adminLink) adminLink.style.display = 'none';
    if(adminToggleBtn) adminToggleBtn.style.display = 'inline-block';
    if(adminLogoutBtn) adminLogoutBtn.style.display = 'none';
  }
}

// Admin login modal handlers (if on index.html)
if(document.getElementById('adminLoginModal')){
  document.getElementById('adminToggleBtn').addEventListener('click', ()=>{
    document.getElementById('adminLoginModal').style.display = 'flex';
    document.getElementById('adminPasswordInput').focus();
  });
  
  document.getElementById('adminCancelBtn').addEventListener('click', ()=>{
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminLoginError').style.display = 'none';
  });
  
  document.getElementById('adminLoginBtn').addEventListener('click', ()=>{
    const password = document.getElementById('adminPasswordInput').value;
    if(password === ADMIN_PASSWORD){
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      document.getElementById('adminLoginModal').style.display = 'none';
      document.getElementById('adminPasswordInput').value = '';
      updateAdminUI();
    }else{
      document.getElementById('adminLoginError').textContent = 'Incorrect password';
      document.getElementById('adminLoginError').style.display = 'block';
    }
  });
  
  document.getElementById('adminPasswordInput').addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
      document.getElementById('adminLoginBtn').click();
    }
  });
  
  document.getElementById('adminLogoutBtn').addEventListener('click', ()=>{
    if(confirm('Logout from admin mode?')){
      localStorage.removeItem(ADMIN_SESSION_KEY);
      updateAdminUI();
    }
  });
}

function loadProducts(){
  try{
    const stored = JSON.parse(localStorage.getItem('products')||'null');
    const defaults = Array.isArray(window.DEFAULT_PRODUCTS) ? window.DEFAULT_PRODUCTS : [];
    if(Array.isArray(stored)){
      // merge stored (admin) products with defaults, keeping stored items first
      const storedIds = new Set(stored.map(p=>p.id));
      const merged = stored.concat(defaults.filter(p=>!storedIds.has(p.id)));
      return merged;
    }
  }catch(e){}
  return window.DEFAULT_PRODUCTS || [];
}

async function renderProducts(){
  const list = await loadProductsAsync();
  productsEl.innerHTML='';
  list.forEach(p=>{
    const node = template.content.cloneNode(true);
    const imgEl = node.querySelector('.product-img');
    imgEl.src = p.image || '';
    // graceful fallback if image fails to load
    imgEl.onerror = function(){ this.onerror=null; this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="20">Image not available</text></svg>' };
    node.querySelector('.product-img').alt = p.name;
    node.querySelector('.product-name').textContent = p.name;
    node.querySelector('.product-desc').textContent = p.description || '';
    node.querySelector('.product-price').textContent = `$${(parseFloat(p.price)||0).toFixed(2)}`;
    const btn = node.querySelector('.add-btn');
    btn.addEventListener('click', ()=> addToCart(p.id));
    // Show Edit button only when logged in as admin
    if(isAdminLoggedIn()){
      const meta = node.querySelector('.product-meta');
      const editBtn = document.createElement('button'); editBtn.className='edit-btn'; editBtn.textContent='✏️ Edit';
      editBtn.style.marginLeft = '8px'; editBtn.style.backgroundColor = '#ffc107'; editBtn.style.color = '#000'; editBtn.style.border = 'none'; editBtn.style.padding = '8px 12px'; editBtn.style.borderRadius = '4px'; editBtn.style.cursor = 'pointer'; editBtn.style.fontSize = '14px'; editBtn.addEventListener('click', ()=>{
        window.location.href = 'admin.html?id='+encodeURIComponent(p.id);
      });
      meta.appendChild(editBtn);
    }
    productsEl.appendChild(node);
  });
}

// Async product loader: uses Supabase when configured, otherwise merges localStorage & defaults
async function loadProductsAsync(){
  // try Supabase first
  if(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.fetchProductsFromSupabase){
    try{
      const remote = await window.fetchProductsFromSupabase();
      if(Array.isArray(remote)) return remote;
    }catch(e){ console.warn('Error fetching products from Supabase', e); }
  }
  // fallback to localStorage merged with defaults
  return loadProducts();
}

function getCart(){
  try{return JSON.parse(localStorage.getItem('cart'))||[];}catch(e){return []}
}
function saveCart(c){localStorage.setItem('cart',JSON.stringify(c)); updateCartCount();}

function addToCart(productId){
  const list = loadProducts();
  const product = list.find(p=>p.id===productId);
  if(!product) return alert('Product not found');
  const cart = getCart();
  const entry = cart.find(i=>i.id===productId);
  if(entry) entry.qty += 1; else cart.push({id:productId,qty:1});
  saveCart(cart);
  showCart();
}

function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  cartCountEl.textContent = count;
}

function showCart(){
  const cart = getCart();
  const list = loadProducts();
  cartItemsEl.innerHTML='';
  let total=0;
  cart.forEach(item=>{
    const prod = list.find(p=>p.id===item.id);
    if(!prod) return;
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}">
      <div style="flex:1">
        <div>${prod.name}</div>
        <small>$${prod.price.toFixed(2)} x ${item.qty}</small>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button data-id="${prod.id}" class="inc">+</button>
        <button data-id="${prod.id}" class="dec">-</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
    // cart image fallback
    const cartImg = div.querySelector('img');
    if(cartImg){ cartImg.onerror = function(){ this.onerror=null; this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23f3f3f3"/></svg>' } }
    total += prod.price * item.qty;
  });
  cartTotalEl.textContent = total.toFixed(2);
  cartModal.classList.remove('hidden');
  // attach inc/dec
  cartItemsEl.querySelectorAll('.inc').forEach(b=>b.addEventListener('click', (e)=>{
    const id=e.target.dataset.id; changeQty(id,1);
  }));
  cartItemsEl.querySelectorAll('.dec').forEach(b=>b.addEventListener('click', (e)=>{
    const id=e.target.dataset.id; changeQty(id,-1);
  }));
}

function changeQty(id,delta){
  const cart = getCart();
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) {
    const idx = cart.findIndex(i=>i.id===id); cart.splice(idx,1);
  }
  saveCart(cart);
  showCart();
}

cartBtn.addEventListener('click', showCart);
closeCartBtn?.addEventListener('click', ()=>cartModal.classList.add('hidden'));

// On load
updateAdminUI(); // Check and update admin UI visibility
renderProducts(); updateCartCount();

// Debug: expose loaded products to console for inspection
console.debug('Loaded products (merged):', loadProducts());

// Also refresh product list when admin updates localStorage (other tab)
window.addEventListener('storage', (e)=>{ if(e.key==='products'){ renderProducts(); } if(e.key==='cart'){ updateCartCount(); } });
