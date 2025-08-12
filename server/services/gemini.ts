import { GoogleGenAI } from "@google/genai";
import type { GenerateRequest } from "@shared/schema";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" });

export interface GenerateUIResult {
  designSpec: string;
  code: string;
  framework: string;
  outputFormat: string;
}

export async function generateUI(request: GenerateRequest): Promise<GenerateUIResult> {
  const { prompt, outputFormat, framework } = request;

  try {
    // Generate design specification
    const designSpecPrompt = `As a UX/UI design expert, analyze this UI request and provide a comprehensive design specification:

"${prompt}"

Please provide:
1. Overview of the UI concept
2. Key components and their purposes
3. Layout structure and hierarchy
4. Design principles applied
5. User interaction patterns
6. Responsive design considerations

Format your response as detailed, professional design documentation.`;

    const designSpecResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: designSpecPrompt,
    });

    const designSpec = designSpecResponse.text || "Failed to generate design specification";

    // Generate code
    const codePrompt = `As a senior frontend developer, create production-ready ${outputFormat.toUpperCase()} code using ${framework} for this UI request:

"${prompt}"

Requirements:
- Use ${framework} for styling
- Ensure responsive design for mobile, tablet, and desktop
- Include proper semantic HTML
- Add hover states and micro-interactions
- Follow modern web development best practices
- Make it accessible (ARIA labels, proper contrast)
- Include placeholder content that matches the design intent

${outputFormat === 'html' ? 
  'Provide a complete HTML document with inline CSS and JavaScript if needed.' :
  'Provide React/Vue component code with proper imports and exports.'
}

Only return the code, no explanations or markdown formatting.`;

    const codeResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: codePrompt,
    });

    const code = codeResponse.text || "Failed to generate code";

    return {
      designSpec,
      code,
      framework,
      outputFormat,
    };

  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate UI using Gemini API. Please check your API key and try again.");
  }
}
