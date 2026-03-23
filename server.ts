import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://mvzylepgbvfbgupanelf.supabase.co";
const supabaseServiceKey = process.env.COFFEE99_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_zZLHCEtjVoL-tF-LevFu4Q_rPKjT6Qs";

// Use service key if available for admin operations, otherwise fallback to anon key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser("coffee99-secret-key"));

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
      // 1. Check Master Password first (Global override)
      const masterPassword = process.env.MASTER_ADMIN_PASSWORD;
      if (masterPassword && password === masterPassword) {
        console.log(`[Auth] Master password used for branch: ${branchId}`);
        setAdminCookie(res, branchId);
        return res.json({ success: true });
      }

      // 2. Check if there's a custom password in the database for this branch
      const { data: settings, error } = await supabaseAdmin
        .from("admin_settings")
        .select("password")
        .eq("branch_id", branchId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error(`[Auth] Database error for branch ${branchId}:`, error.message);
      }

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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (increased from 24h for better multi-device experience)
      sameSite: "none", // Required for AI Studio iframe
      secure: true      // Required for SameSite=None
    });
  }

  // Public Fetch Branch Settings (for dynamic branding)
  app.get("/api/settings/:branchId", async (req, res) => {
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

  // Admin Update Settings Endpoint
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

      // Upsert the settings for this branch
      const { error } = await supabaseAdmin
        .from("admin_settings")
        .upsert(updates, { onConflict: 'branch_id' });

      if (error) throw error;
      res.json({ success: true, message: "Settings updated successfully" });
    } catch (err: any) {
      console.error("Update settings error:", err);
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
      console.error("Fetch settings error:", err);
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

  // --- Admin Order Management Routes ---

  // Fetch all orders for a branch
  app.get("/api/admin/orders/:branchId", verifyAdmin, async (req, res) => {
    const { branchId } = req.params;
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("branch_id", branchId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Supabase Fetch Error:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  });

  // Update order status
  app.patch("/api/admin/orders/:branchId/:orderId", verifyAdmin, async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  // Delete an order
  app.delete("/api/admin/orders/:branchId/:orderId", verifyAdmin, async (req, res) => {
    const { orderId } = req.params;
    const { error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", orderId);

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
