import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";
import path from 'path';
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";

console.log("[Server] Starting server script...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err);
});

// Initialize Supabase Client
const rawSupabaseUrl = (process.env.VITE_SUPABASE_URL || "").trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

// Ensure URL is correctly formatted
let supabaseUrl = rawSupabaseUrl;
if (supabaseUrl) {
  // If it's just a 20-char project ID (and doesn't look like a URL)
  if (!supabaseUrl.includes(".") && supabaseUrl.length === 20) {
    supabaseUrl = `${supabaseUrl}.supabase.co`;
  }
  
  // Custom check for common placeholder
  if (supabaseUrl.includes("your-project-id")) {
    console.error("[Server] ERROR: Supabase URL still contains 'your-project-id'. Please update VITE_SUPABASE_URL in your secrets.");
  }
  
  // Ensure it has a protocol
  if (!supabaseUrl.startsWith("http")) {
    supabaseUrl = `https://${supabaseUrl}`;
    console.log(`[Server] Normalizing Supabase URL: ${supabaseUrl}`);
  }
}

console.log(`[Server] Supabase URL configured: ${!!supabaseUrl} (${supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'none'})`);
console.log(`[Server] Supabase Service Key configured: ${!!supabaseServiceKey}`);

let isSupabaseAvailable = false;
let isCheckingConnectivity = false;
let lastCheckTime = 0;

async function checkSupabaseConnectivity(force = false): Promise<boolean> {
  if (!supabaseUrl || !supabaseServiceKey) {
    isSupabaseAvailable = false;
    return false;
  }

  // Custom check for common placeholder
  if (supabaseUrl.includes("your-project-id") || supabaseUrl.includes("[YOUR_PROJECT_ID]")) {
    isSupabaseAvailable = false;
    return false;
  }

  const now = Date.now();
  // Cache connection state for 1 minute unless forced
  if (!force && lastCheckTime > 0 && (now - lastCheckTime) < 60000) {
    return isSupabaseAvailable;
  }

  if (isCheckingConnectivity) {
    return isSupabaseAvailable;
  }

  isCheckingConnectivity = true;
  try {
    const urlToTest = supabaseUrl.endsWith('/') ? supabaseUrl : `${supabaseUrl}/`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
    
    const testFetch = await fetch(urlToTest, { 
      method: "HEAD", 
      signal: controller.signal,
      headers: { "Accept": "*/*" }
    });
    
    clearTimeout(timeoutId);
    isSupabaseAvailable = testFetch.ok || (testFetch.status >= 200 && testFetch.status < 500);
  } catch (e: any) {
    const msg = e.message || String(e);
    if (msg.includes("ENOTFOUND") || msg.includes("fetch failed") || msg.includes("failed to fetch") || msg.includes("timeout") || msg.includes("aborted")) {
      console.log(`[Supabase Status Check] Dormant (Database connection bypassed. Admin fallbacks and local memory caches are active).`);
    } else {
      console.log(`[Supabase Status Check] Dormant (${msg}). Local memory fallback mode active.`);
    }
    isSupabaseAvailable = false;
  } finally {
    isCheckingConnectivity = false;
    lastCheckTime = Date.now();
  }

  return isSupabaseAvailable;
}

// Check connectivity initially on startup
checkSupabaseConnectivity(true).catch(() => {});

let supabase: any;
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log("[Server] Supabase client initialized");
  } else {
    console.warn("[Server] Supabase credentials missing (Url: " + !!supabaseUrl + ", Key: " + !!supabaseServiceKey + ")");
  }
} catch (err) {
  console.error("[Server] Failed to initialize Supabase client:", err);
}

const app = express();
const PORT = 3000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins for public API routes
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Cache-Control", "X-Requested-With"]
}));
app.use(express.json());
app.use(cookieParser(process.env.COFFEE99_SECRET_KEY || "coffee99-secret-key-fallback"));

// Request Logger
app.use((req, res, next) => {
  if (!req.url.startsWith('/@vite') && !req.url.startsWith('/src') && !req.url.startsWith('/node_modules')) {
    console.log(`[Server] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
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
app.get("/api/health", async (req, res) => {
  console.log("[API] Health check requested");
  
  const connected = await checkSupabaseConnectivity(true);

  res.json({ 
    status: "ok", 
    supabase: !!supabase && !!supabaseUrl && !!supabaseServiceKey,
    supabaseConnectivity: connected,
    time: new Date().toISOString()
  });
});

// Admin Login Endpoint
app.post("/api/admin/login", async (req, res) => {
  const { password, branchId } = req.body;
  
  if (!branchId) {
    return res.status(400).json({ success: false, message: "Branch ID is required" });
  }
  
  try {
    let validPassword = process.env.ADMIN_PASSWORD || "aspirion007";

    const isAvailable = await checkSupabaseConnectivity(false);
    if (supabase && isAvailable) {
      const { data: settings, error } = await supabase
        .from("admin_settings")
        .select("*")
        .eq("branch_id", branchId)
        .maybeSingle();

      if (error) {
        console.error("[Auth] Supabase fetch error, continuing with fallback:", error);
      } else if (settings && settings.password) {
        validPassword = settings.password;
      }
    } else {
      console.warn("[Auth] Supabase not initialized or offline, using environment fallback password");
    }

    if (password === validPassword) {
      setAdminCookie(res, branchId);
      return res.json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid access key" });
    }
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error during login: " + (err.message || "Unknown error") });
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
    store_address: "Shivmandir, Near Sri Nara Singha Vidyapith, Siliguri, West Bengal"
  };

  try {
    const isAvailable = await checkSupabaseConnectivity(false);
    if (supabase && isAvailable) {
      let settings = null;
      let error = null;
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts <= maxAttempts) {
        try {
          const response = await supabase
            .from("admin_settings")
            .select("*")
            .eq("branch_id", branchId)
            .maybeSingle();
          
          settings = response.data;
          error = response.error;
          
          // If it's a fetch error, we might want to retry
          if (error && (error.message?.includes('fetch failed') || error.message?.includes('TypeError'))) {
            attempts++;
            if (attempts <= maxAttempts) {
              console.log(`[API] Supabase fetch failed, retrying (${attempts}/${maxAttempts})...`);
              await new Promise(resolve => setTimeout(resolve, 500 * attempts));
              continue;
            }
          }
          break; // Success or non-retryable error
        } catch (fetchErr: any) {
          if (fetchErr.message?.includes('fetch failed') && attempts < maxAttempts) {
            attempts++;
            console.log(`[API] Supabase fetch caught exception, retrying (${attempts}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 500 * attempts));
            continue;
          }
          throw fetchErr;
        }
      }
      
      if (!error && settings) {
        console.log(`[API] Settings found in Supabase for ${branchId}`);
        return res.json({
          store_name: settings.store_name || fallbackSettings.store_name,
          store_email: settings.store_email || fallbackSettings.store_email,
          store_address: settings.store_address || fallbackSettings.store_address,
          db_connected: true,
          source: 'supabase'
        });
      }

      if (error) {
        console.error(`[API] Supabase fetching error details for ${branchId}:`, {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          url: supabaseUrl.substring(0, 20) + '...'
        });
      }
    }

    // Final fallback
    console.log(`[API] Using hardcoded fallback for ${branchId}`);
    res.json({ ...fallbackSettings, db_connected: false, source: 'fallback' });
    
  } catch (err: any) {
    console.error(`[API Error] Settings for ${branchId}:`, err.message || err);
    res.json({ ...fallbackSettings, db_connected: false, error: err.message });
  }
});

// Admin Update Settings
app.post("/api/admin/update-settings/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;
  const { newPassword, storeName, storeEmail, storeAddress } = req.body;

  const isAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isAvailable) {
    return res.status(503).json({ success: false, message: "Database service unavailable" });
  }

  try {
    const updates: any = { 
      branch_id: branchId, 
      updated_at: new Date().toISOString()
    };
    
    if (newPassword && newPassword.length >= 4) updates.password = newPassword;
    if (storeName) updates.store_name = storeName;
    if (storeEmail) updates.store_email = storeEmail;
    if (storeAddress) updates.store_address = storeAddress;

    const { error } = await supabase
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

  const isAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isAvailable) {
    return res.json({
      store_name: "Coffee99",
      store_email: "contact@coffee99.com",
      store_address: "Shivmandir, Siliguri",
      warning: "Database offline"
    });
  }

  try {
    const { data: settings, error } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("branch_id", branchId)
      .maybeSingle();
    
    if (error) throw error;
    if (!settings) return res.json({});
    
    res.json({
      store_name: settings.store_name,
      store_email: settings.store_email,
      store_address: settings.store_address
    });
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

  const isAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isAvailable) {
    return res.json([]);
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("branch_id", branchId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
app.patch("/api/admin/orders/:branchId/:orderId", verifyAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  const isAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isAvailable) {
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an order
app.delete("/api/admin/orders/:branchId/:orderId", verifyAdmin, async (req, res) => {
  const { orderId } = req.params;

  const isAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isAvailable) {
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Clear all orders for a branch
app.delete("/api/admin/orders/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;

  const isAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isAvailable) {
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("branch_id", branchId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch menu availability
app.get("/api/admin/menu-availability/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;

  const isAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isAvailable) {
    return res.json([]);
  }

  try {
    const { data, error } = await supabase
      .from("menu_availability")
      .select("item_id")
      .eq("branch_id", branchId)
      .eq("is_available", false);

    if (error) throw error;

    res.json(data.map(item => item.item_id));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update menu availability
app.post("/api/admin/menu-availability/:branchId", verifyAdmin, async (req, res) => {
  const { branchId } = req.params;
  const { itemId, isAvailable } = req.body;
  
  const isDbAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isDbAvailable) {
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    const { error } = await supabase
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

// Delete a video
app.delete("/api/admin/videos/:branchId/:videoId", verifyAdmin, async (req, res) => {
  const { videoId } = req.params;
  console.log(`[Server] Attempting to delete video: ${videoId}`);

  const isAvailable = await checkSupabaseConnectivity(false);
  if (!supabase || !isAvailable) {
    console.error("[Server] Supabase client not initialized or database offline");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    // 1. Get video details to find storage path
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select("embed_url")
      .eq("id", videoId)
      .maybeSingle();

    if (fetchError) {
      console.error("[Server] Fetch video error:", JSON.stringify(fetchError));
      throw fetchError;
    }

    if (!video) {
      console.warn(`[Server] Video not found: ${videoId}`);
      return res.status(404).json({ error: "Video not found" });
    }

    // 2. Delete from Storage if it's a Supabase URL
    if (video.embed_url && video.embed_url.includes('/storage/v1/object/public/video/')) {
      // Extract filename correctly even if there are query params
      const urlPath = video.embed_url.split('?')[0];
      const fileName = urlPath.split('/').pop();
      
      if (fileName) {
        console.log(`[Server] Deleting file from storage: ${fileName}`);
        const { error: storageError } = await supabase.storage
          .from("video")
          .remove([fileName]);
        
        if (storageError) {
          console.error("[Server] Storage deletion error:", JSON.stringify(storageError));
          // Continue anyway to delete DB record
        }
      }
    }

    // 3. Delete from Database
    console.log(`[Server] Deleting record from database: ${videoId}`);
    const { error: dbError } = await supabase
      .from("videos")
      .delete()
      .eq("id", videoId);

    if (dbError) {
      console.error("[Server] Database deletion error:", JSON.stringify(dbError));
      throw dbError;
    }

    console.log(`[Server] Successfully deleted video: ${videoId}`);
    res.json({ success: true });
  } catch (err: any) {
    console.error("[Server] Video deletion critical error:", err.message || err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
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
    console.log(`[Server] >>> SUCCESS <<< Server is listening on port ${PORT}`);
    console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
  });
}

console.log("[Server] Calling startServer()...");
startServer().catch(err => {
  console.error("[Server] FATAL ERROR during startServer():", err);
});

export default app;
