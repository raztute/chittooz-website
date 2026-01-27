// Supabase products helper. Uses global SUPABASE_URL and SUPABASE_ANON_KEY.
// Provides: fetchProducts(), uploadImageFile(file) -> publicUrl, upsertProduct(product), deleteProduct(id)
// This file expects the UMD supabase client to be loaded (see checkout/admin pages).

function _getSupabaseClient(){
  // Return cached client if available
  if(window.supabaseClient) return window.supabaseClient;
  
  // Otherwise try to create one
  const createClient = (window.supabase && window.supabase.createClient)
    || (window.supabaseJs && window.supabaseJs.createClient)
    || (window.Supabase && window.Supabase.createClient);
  if(!createClient) throw new Error('Supabase client library not loaded');
  if(!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) throw new Error('Supabase config missing');
  
  window.supabaseClient = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  return window.supabaseClient;
}

async function fetchProductsFromSupabase(){
  try{
    const supabase = _getSupabaseClient();
    const { data, error } = await supabase.from('products').select('*').order('id', {ascending:true});
    if(error) throw error;
    return data || [];
  }catch(e){ console.warn('fetchProductsFromSupabase error', e); return null; }
}

// Upload image to bucket 'product-images' and return public URL. Expects bucket to be public or uses signed URL.
async function uploadImageToSupabase(file){
  if(!file) return null;
  try{
    const supabase = _getSupabaseClient();
    const filename = `prod_${Date.now()}_${Math.random().toString(36).slice(2,9)}_${file.name}`;
    const bucket = supabase.storage.from('product-images');
    const { error: upErr } = await bucket.upload(filename, file, { cacheControl: '3600', upsert: false });
    if(upErr){ throw upErr; }
    // get public URL
    const { publicURL, error: urlErr } = bucket.getPublicUrl(filename);
    if(urlErr) throw urlErr;
    return publicURL;
  }catch(e){ console.warn('uploadImageToSupabase error', e); return null; }
}

async function upsertProductToSupabase(product){
  try{
    const supabase = _getSupabaseClient();
    // insert or update based on id
    const payload = Object.assign({}, product);
    const { data, error } = await supabase.from('products').upsert(payload, { onConflict: ['id'] }).select().single();
    if(error) throw error;
    return data;
  }catch(e){ console.warn('upsertProductToSupabase error', e); throw e; }
}

async function deleteProductFromSupabase(id){
  try{
    const supabase = _getSupabaseClient();
    const { data, error } = await supabase.from('products').delete().eq('id', id);
    if(error) throw error;
    return data;
  }catch(e){ console.warn('deleteProductFromSupabase error', e); throw e; }
}

// expose globals
window.fetchProductsFromSupabase = fetchProductsFromSupabase;
window.uploadImageToSupabase = uploadImageToSupabase;
window.upsertProductToSupabase = upsertProductToSupabase;
window.deleteProductFromSupabase = deleteProductFromSupabase;
