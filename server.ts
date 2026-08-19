/**
 * Fleet Intelligence Smart AI - Express Server Entry Point
 * Handles API endpoints, server-side Gemini AI Orchestrator, and Vite Development Middleware
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { mockVehicles, mockDrivers, mockTrips, mockAlerts, mockAIInsights, mockTenant, mockGeofences } from "./src/constants/mockData";
import { FLEET_OPENAPI_SPEC } from "./src/services/api/openApiSpec";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Security Headers Middleware
  app.use((req, res, next) => {
    const requestId = (req.headers["x-request-id"] as string) || `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    res.setHeader("X-Request-ID", requestId);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  // OpenAPI Specification Docs Route
  app.get("/api/docs", (_req, res) => {
    res.json(FLEET_OPENAPI_SPEC);
  });

  app.get("/developer/docs", (_req, res) => {
    res.json(FLEET_OPENAPI_SPEC);
  });

  // Public Health Check (Safe - No internal secrets exposed)
  app.get("/api/v1/health", (_req, res) => {
    res.json({
      status: "healthy",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // /api/v1/vehicles
  // ==========================================
  app.get("/api/v1/vehicles", (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    let list = [...mockVehicles];
    if (req.query.status) list = list.filter(v => v.status === req.query.status);
    if (req.query.branch) list = list.filter(v => v.branchId === req.query.branch);

    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        requestId: res.getHeader("X-Request-ID"),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        environment: (req.headers["x-api-key"] as string)?.startsWith("flt_test_") ? "SANDBOX" : "PRODUCTION",
      },
    });
  });

  app.get("/api/v1/vehicles/:id", (req, res) => {
    const v = mockVehicles.find(item => item.id === req.params.id);
    if (!v) {
      return res.status(404).json({
        success: false,
        error: { code: "VEHICLE_NOT_FOUND", message: `Vehicle ${req.params.id} not found` },
        meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
      });
    }
    res.json({
      success: true,
      data: v,
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  app.get("/api/v1/vehicles/:id/location", (req, res) => {
    const v = mockVehicles.find(item => item.id === req.params.id);
    if (!v) {
      return res.status(404).json({
        success: false,
        error: { code: "VEHICLE_NOT_FOUND", message: `Vehicle ${req.params.id} not found` },
        meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
      });
    }
    res.json({
      success: true,
      data: {
        vehicleId: v.id,
        plateNumber: v.plateNumber,
        latitude: v.latestTelemetry?.location.lat || -6.2941,
        longitude: v.latestTelemetry?.location.lng || 106.8821,
        speed: v.latestTelemetry?.location.speed || 54.2,
        heading: v.latestTelemetry?.location.heading || 112,
        ignition: v.status === "moving" || v.status === "idle",
        timestamp: new Date().toISOString(),
        accuracy: 98.8,
        address: v.latestTelemetry?.location.address || "Tol Jakarta-Cikampek KM 28.5",
      },
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  app.get("/api/v1/vehicles/:id/telemetry", (req, res) => {
    const v = mockVehicles.find(item => item.id === req.params.id);
    if (!v) {
      return res.status(404).json({
        success: false,
        error: { code: "VEHICLE_NOT_FOUND", message: `Vehicle ${req.params.id} not found` },
        meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
      });
    }
    res.json({
      success: true,
      data: {
        vehicleId: v.id,
        speed: v.latestTelemetry?.location.speed || (v.status === "moving" ? 58.4 : 0),
        fuelLevelPercent: v.latestTelemetry?.fuelLevelPercent || 76.5,
        fuelLevelLiters: v.latestTelemetry?.fuelLevelLiters || 153.0,
        temperatureCelsius: v.latestTelemetry?.engineTempCelsius || 85.5,
        batteryVoltage: v.latestTelemetry?.batteryVoltage || 24.1,
        odometerKm: v.latestTelemetry?.odometerKm || v.odometerKm,
        engineHours: v.latestTelemetry?.engineHours || v.engineHours,
        ignition: v.status === "moving" || v.status === "idle",
        engineRpm: v.latestTelemetry?.engineRpm || (v.status === "moving" ? 1620 : 0),
      },
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  // ==========================================
  // /api/v1/drivers
  // ==========================================
  app.get("/api/v1/drivers", (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    let list = [...mockDrivers];
    if (req.query.status) list = list.filter(d => d.status === req.query.status);

    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit).map(d => ({
      id: d.id,
      name: d.name,
      nik: "••••••••••••••••",
      phone: "+62 812-****-8819", // Masked PII
      status: d.status,
      license: `${d.simType} (Masked)`,
      vehicleAssignment: d.assignedVehicleId,
      safetyScore: d.score?.safetyScore || 94,
    }));

    res.json({
      success: true,
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        requestId: res.getHeader("X-Request-ID"),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    });
  });

  // ==========================================
  // /api/v1/trips, geofences, alerts
  // ==========================================
  app.get("/api/v1/trips", (_req, res) => {
    res.json({
      success: true,
      data: mockTrips,
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  app.get("/api/v1/geofences", (_req, res) => {
    res.json({
      success: true,
      data: mockGeofences,
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  app.get("/api/v1/alerts", (_req, res) => {
    res.json({
      success: true,
      data: mockAlerts,
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  // ==========================================
  // /api/v1/reports (Async Job Creation)
  // ==========================================
  app.post("/api/v1/reports", (req, res) => {
    const { reportType, format } = req.body;
    const jobId = `job_rep_${Date.now().toString(36)}`;
    res.status(202).json({
      success: true,
      data: {
        jobId,
        reportType: reportType || "fleet",
        format: format || "PDF",
        status: "PENDING",
        message: "Async report job enqueued. Poll /api/v1/reports/jobs/:jobId for completion status.",
        createdAt: new Date().toISOString(),
      },
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  app.get("/api/v1/reports/jobs/:jobId", (req, res) => {
    res.json({
      success: true,
      data: {
        jobId: req.params.jobId,
        status: "COMPLETED",
        progress: 100,
        downloadUrl: `/api/v1/reports/jobs/${req.params.jobId}/download`,
        fileSize: "2.4 MB",
        rowCount: 85,
        completedAt: new Date().toISOString(),
      },
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  // ==========================================
  // /api/v1/ai (Predictive AI API)
  // ==========================================
  app.post("/api/v1/ai/fleet/analyze", (_req, res) => {
    res.json({
      success: true,
      data: {
        fleetHealthScore: 92.4,
        utilizationRatePercent: 78.6,
        averageKmPerLiter: 3.42,
        anomalies: [
          {
            vehicleId: "veh_01",
            type: "EXCESSIVE_IDLE",
            description: "Unit mengalami idle 45 menit di Depo Cikarang dengan AC aktif.",
          },
        ],
        recommendations: [
          "Aktifkan auto-engine cutoff alert setelah 15 menit idle berkepanjangan.",
        ],
      },
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  app.post("/api/v1/ai/fuel/analyze", (_req, res) => {
    res.json({
      success: true,
      data: {
        fuelEfficiencyRating: "OPTIMAL",
        anomalies: [
          {
            vehicleId: "veh_01",
            phrasing: "Possible rapid fuel volume reduction detected. Suspected fuel siphon or sensor fluctuation.",
            confidenceScore: 0.84,
          },
        ],
      },
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  app.post("/api/v1/ai/assistant", (req, res) => {
    const message = req.body?.message || "";
    res.json({
      success: true,
      data: {
        reply: `Halo! Saya AI Fleet Assistant. Memantau ${mockVehicles.length} armada aktif. Pertanyaan: "${message}" telah diproses.`,
        telemetryContext: { totalVehicles: mockVehicles.length, totalDrivers: mockDrivers.length },
      },
      meta: { requestId: res.getHeader("X-Request-ID"), timestamp: new Date().toISOString(), version: "1.0.0" },
    });
  });

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      platform: "Fleet Intelligence Smart AI",
      version: "1.0.0-enterprise",
      tenant: mockTenant.name,
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/vehicles", (_req, res) => {
    res.json({ status: "success", data: mockVehicles });
  });

  app.get("/api/drivers", (_req, res) => {
    res.json({ status: "success", data: mockDrivers });
  });

  app.get("/api/trips", (_req, res) => {
    res.json({ status: "success", data: mockTrips });
  });

  app.get("/api/alerts", (_req, res) => {
    res.json({ status: "success", data: mockAlerts });
  });

  app.get("/api/ai/insights", (_req, res) => {
    res.json({ status: "success", data: mockAIInsights });
  });

  // AI Provider Health Check
  app.get("/api/ai/health", (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
    res.json({
      status: "ok",
      primaryProvider: {
        name: "Google Gemini 2.5 Flash Enterprise",
        configured: hasKey,
        status: hasKey ? "ONLINE" : "STANDBY",
      },
      fallbackProvider: {
        name: "Telematics Smart Rule Engine (Built-in)",
        configured: true,
        status: "ONLINE",
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Full-Stack Server-side AI Orchestration Route
  app.post("/api/ai/orchestrate", async (req, res) => {
    try {
      const { prompt, systemInstruction, temperature, context, tools } = req.body;
      if (!prompt) {
        return res.status(400).json({ status: "error", message: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      let replyText = "";
      let providerUsed = "Google Gemini 2.5 Flash Enterprise";
      let isFallback = false;

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const baseInstruction = systemInstruction || `Anda adalah Fleet Intelligence Smart AI Assistant untuk perusahaan telematika logistik ${mockTenant.name}.
Jawab dalam Bahasa Indonesia dengan gaya profesional, berbasis data telemetri real-time, dan berikan rekomendasi aksi jika relevan.`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${baseInstruction}\n\nPermintaan Pengguna: ${prompt}`,
          });

          replyText = response.text || "Hasil orkestrasi AI selesai.";
        } catch (err: any) {
          console.warn("[AI Orchestrator] Gemini API error, executing intelligent fallback rule engine:", err.message);
          replyText = generateFallbackAiReply(prompt);
          providerUsed = "Telematics Smart Rule Engine (Built-in)";
          isFallback = true;
        }
      } else {
        replyText = generateFallbackAiReply(prompt);
        providerUsed = "Telematics Smart Rule Engine (Built-in)";
        isFallback = true;
      }

      const tokenEstimate = Math.round((prompt.length + replyText.length) / 4);

      return res.json({
        status: "success",
        reply: replyText,
        text: replyText,
        provider: providerUsed,
        isFallback,
        usage: {
          promptTokens: Math.round(prompt.length / 4),
          completionTokens: Math.round(replyText.length / 4),
          totalTokens: tokenEstimate,
          estimatedCostIdr: Math.round(tokenEstimate * 0.25),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("AI Orchestration Error:", error);
      return res.status(500).json({ status: "error", message: error.message || "AI Error" });
    }
  });

  // AI Vision Analysis Route (Computer Vision for Tires, Brakes & Pre-trip Defects)
  app.post("/api/ai/vision-analyze", async (req, res) => {
    try {
      const { imageBase64, mimeType, prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && imageBase64) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                text: prompt || "Analisis foto komponen kendaraan armada ini. Identifikasi tanda-tanda keausan, kerusakan, kebocoran, atau risiko keselamatan."
              },
              {
                inlineData: {
                  data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
                  mimeType: mimeType || "image/jpeg"
                }
              }
            ]
          });

          return res.json({
            status: "success",
            analysis: response.text || "Analisis visual selesai.",
            timestamp: new Date().toISOString()
          });
        } catch (err: any) {
          console.warn("Vision API error fallback:", err.message);
        }
      }

      // Fallback Vision response
      return res.json({
        status: "success",
        analysis: "Analisis visual pra-perjalanan (Pre-Trip Inspection): Komponen ban terdeteksi dengan keausan tapak sekitar 35%. Tidak terdeteksi retakan struktural besar atau tonjolan samping.",
        detectedIssues: [
          { component: "Tire Tread", severity: "LOW", description: "Keausan normal operasional" }
        ],
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  });

  // Backward Compatible AI Ask Route
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ status: "error", message: "Prompt required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      let replyText = "";

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const systemInstruction = `Anda adalah Fleet Intelligence Smart AI Assistant untuk perusahaan telematika logistik Indonesia (${mockTenant.name}).
Jawab dalam Bahasa Indonesia dengan gaya profesional, presisi, dan berbasis data telemetri armada real-time.
Data armada saat ini:
- Total Kendaraan: ${mockVehicles.length} (Moving: ${mockVehicles.filter(v => v.status === 'moving').length}, Idle: ${mockVehicles.filter(v => v.status === 'idle').length})
- Total Driver: ${mockDrivers.length}
- Peringatan Kritis: ${mockAlerts.filter(a => a.severity === 'critical').length} (Overspeed & Maintenance)
Berikan jawaban ringkas, solutif, dan sertakan rekomendasi tindakan jika relevan.`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${systemInstruction}\n\nPertanyaan Pengguna: ${prompt}`,
          });

          replyText = response.text || "Maaf, sistem AI sedang memproses data armada.";
        } catch (err) {
          console.error("Gemini API Error, fallback to rule engine:", err);
          replyText = generateFallbackAiReply(prompt);
        }
      } else {
        replyText = generateFallbackAiReply(prompt);
      }

      return res.json({
        status: "success",
        reply: replyText,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("AI Ask Error:", error);
      return res.status(500).json({ status: "error", message: error.message || "AI Error" });
    }
  });

  // Helper Fallback AI Engine
  function generateFallbackAiReply(prompt: string): string {
    const p = prompt.toLowerCase();
    if (p.includes("bbm") || p.includes("fuel") || p.includes("boros")) {
      return `Berdasarkan analisis Fuel AI terhadap ${mockVehicles.length} kendaraan:\n• Konsumsi rata-rata armada saat ini adalah 3.4 KM/Liter.\n• Armada B 9211 TJP mengalami peningkatan idle 45 menit yang memicu boros BBM sekitar 12.8% hari ini.\n• Rekomendasi: Lakukan evaluasi waktu tunggu loading di Depo Cikarang dan aktifkan peringatan mati mesin otomatis setelah 15 menit idle.`;
    }
    if (p.includes("overspeed") || p.includes("kecepatan") || p.includes("bahaya")) {
      return `Terdeteksi 1 peringatan overspeed kritis hari ini:\n• Kendaraan B 9482 UTX (Driver: Sutrisno Hartono) melaju 92 km/jam di Tol Cikampek KM 18 (Batas 80 km/jam).\n• Skor keselamatan driver Sutrisno saat ini: 94/100.\n• Rekomendasi: Kirimkan pesan peringatan batas kecepatan otomatis ke unit GPS/telepon driver.`;
    }
    if (p.includes("servis") || p.includes("maintenance") || p.includes("bengkel") || p.includes("kir")) {
      return `Ringkasan Pemeliharaan Armada (${mockTenant.name}):\n• Kendaraan B 9211 TJP perlu servis berkala 110.000 KM & Uji KIR jatuh tempo dalam 17 hari.\n• AI memprediksi kampas rem Hino B 9482 UTX perlu diperiksa dalam 1.200 KM mendatang.\n• Work Order WO-2026-0805 sedang diproses di Depo Tanjung Priok.`;
    }
    return `Halo! Saya Fleet Intelligence AI Assistant untuk ${mockTenant.name}.\n\nSaat ini memantau ${mockVehicles.length} kendaraan (${mockVehicles.filter(v => v.status === 'moving').length} sedang bergerak di rute Trans-Jawa & Jabodetabek).\n\nAda yang dapat saya bantu mengenai status lokasi, efisiensi BBM, perilaku driver, atau penjadwalan maintenance?`;
  }

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fleet Intelligence AI] Express server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
