import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRequestSchema } from "@shared/schema";
import { generateUI } from "./services/gemini";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate UI endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      // Validate request body
      const validatedData = generateRequestSchema.parse(req.body);
      
      // Generate UI using Gemini
      const result = await generateUI(validatedData);
      
      // Store generation in storage
      await storage.createGeneration({
        prompt: validatedData.prompt,
        designSpec: result.designSpec,
        code: result.code,
        outputFormat: validatedData.outputFormat,
        framework: validatedData.framework,
      });
      
      res.json(result);
    } catch (error) {
      console.error("Generate UI error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: error.errors,
        });
      }
      
      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message || "Failed to generate UI",
        });
      }
      
      res.status(500).json({
        message: "An unexpected error occurred while generating UI",
      });
    }
  });

  // Get recent generations
  app.get("/api/generations", async (req, res) => {
    try {
      const generations = await storage.getRecentGenerations(10);
      res.json(generations);
    } catch (error) {
      console.error("Get generations error:", error);
      res.status(500).json({
        message: "Failed to retrieve generations",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
