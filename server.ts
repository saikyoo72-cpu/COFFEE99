import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser("coffee99-secret-key"));

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://mvzylepgbvfbgupanelf.supabase.co";
const supabaseServiceKey = process.env.COFFEE99_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_zZLHCEtjVoL-tF-LevFu4Q_rPKjT6Qs";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Middleware to verify admin session
const verifyAdmin = (req: any, res: any, next: any) => {
  const { branchId } = req.params;
  const session = req.signedCookies[`admin_session_${branchId}`];
  
  if (session === "true") {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// API health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    secureMode: !!supabaseServiceKey,
    databaseUrl: !!supabaseUrl
  });
});

// Admin Login Endpoint
app.post("/api/admin/login", async (req, res) => {
  const { password, branchId } = req.body;
  
  if (!branchId) {
    return res.status(400).json({ success: false, message: "Branch ID is required" });
  }
  
  try {
    const { data: settings, error } = await supabaseAdmin
      .from("admin_settings")
      .select("password")
      .eq("branch_id", branchId)
      .single();

    let validPassword = process.env.ADMIN_PASSWORD || "aspirion007";
    
    if (!error && settings && settings.password) {
      validPassword = settings.password;
    }

    if (password === validPassword) {
      setAdminCookie(res, branchId);
      return res.json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid access key" });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// Helper to set admin cookie
function setAdminCookie(res: any, branchId: string) {
  res.cookie(`admin_session_${branchId}`, "true", {
    httpOnly: true,
    signed: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "none",
    secure: true
  });
}

// Public Fetch Branch Settings
app.get("/api/settings/:branchId", async (req, res) => {
  const { branchId } = req.params;
  console.log(`[API] Fetching settings for branch: ${branchId}`);
  
  // Default fallback settings
  const fallbackSettings = {
    store_name: "Coffee99",
    store_email: "contact@coffee99.com",
    store_address: "Shivmandir, Siliguri, West Bengal"
  };

  try {
    if (!supabaseUrl || supabaseUrl.includes("mvzylepgbvfbgupanelf")) {
      console.log(`[API] Using fallback settings for ${branchId} (Supabase not configured)`);
      return res.json(fallbackSettings);
    }

    const { data, error } = await supabaseAdmin
      .from("admin_settings")
      .select("store_name, store_email, store_address")
      .eq("branch_id", branchId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`[API] No settings found for ${branchId}, using fallback`);
        return res.json(fallbackSettings);
      }
      console.error(`[Supabase Error] Fetching settings for ${branchId}:`, error);
      throw error;
    }
    
    console.log(`[API] Settings found for ${branchId}:`, !!data);
    res.json(data || fallbackSettings);
  } catch (err: any) {
    console.error(`[API Error] Settings for ${branchId}:`, err.message);
    // Always return something valid to prevent frontend "Failed to fetch" or JSON parse errors
    res.json(fallbackSettings);
  }
});

// Admin Update Settings
app.post("/api/admin/update-settings/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;
  const { newPassword, storeName, storeEmail, storeAddress } = req.body;

  try {
    const updates: any = { 
      branch_id: branchId, 
      updated_at: new Date().toISOString()
    };
    
    if (newPassword && newPassword.length >= 4) updates.password = newPassword;
    if (storeName) updates.store_name = storeName;
    if (storeEmail) updates.store_email = storeEmail;
    if (storeAddress) updates.store_address = storeAddress;

    const { error } = await supabaseAdmin
      .from("admin_settings")
      .upsert(updates, { onConflict: 'branch_id' });

    if (error) throw error;
    res.json({ success: true, message: "Settings updated successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to update settings" });
  }
});

// Fetch Admin Settings
app.get("/api/admin/settings/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from("admin_settings")
      .select("store_name, store_email, store_address")
      .eq("branch_id", branchId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || {});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Verify Endpoint
app.get("/api/admin/verify/:branchId", (req, res) => {
  const { branchId } = req.params;
  const session = req.signedCookies[`admin_session_${branchId}`];
  
  if (session === "true") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// Admin Logout Endpoint
app.post("/api/admin/logout/:branchId", (req, res) => {
  const { branchId } = req.params;
  res.clearCookie(`admin_session_${branchId}`);
  res.json({ success: true });
});

// Fetch all orders for a branch
app.get("/api/admin/orders/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("branch_id", branchId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Update order status
app.patch("/api/admin/orders/:branchId/:orderId", verifyAdmin, async (req, res) => {
  const { branchId, orderId } = req.params;
  const { status } = req.body;
  
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("branch_id", branchId)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Delete an order
app.delete("/api/admin/orders/:branchId/:orderId", verifyAdmin, async (req, res) => {
  const { branchId, orderId } = req.params;
  const { error } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("id", orderId)
    .eq("branch_id", branchId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Clear all orders for a branch
app.delete("/api/admin/orders/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;
  const { error } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("branch_id", branchId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Fetch menu availability
app.get("/api/admin/menu-availability/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from("menu_availability")
      .select("item_id")
      .eq("branch_id", branchId)
      .eq("is_available", false);

    if (error) throw error;
    res.json(data.map((d: any) => d.item_id));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update menu availability
app.post("/api/admin/menu-availability/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;
  const { itemId, isAvailable } = req.body;
  
  try {
    const { error } = await supabaseAdmin
      .from("menu_availability")
      .upsert({
        branch_id: branchId,
        item_id: itemId,
        is_available: isAvailable,
        updated_at: new Date().toISOString()
      }, { onConflict: 'branch_id,item_id' });

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
async function startServer() {
  console.log(`[Server] Setting up app in ${process.env.NODE_ENV || "development"} mode`);
  
  if (process.env.NODE_ENV !== "production") {
    console.log("[Vite] Initializing Vite middleware...");
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("[Vite] Middleware initialized");
    } catch (err) {
      console.error("[Vite] Failed to initialize middleware:", err);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    console.log(`[Server] Serving static files from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("[Global Error]", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
