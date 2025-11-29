import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ImpactLevel, RecommendationType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePlugins = async (pluginList: string): Promise<AnalysisResult> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    Analyze the following list of WordPress plugins for performance impact, redundancy, and optimization opportunities. 
    Act as a senior WordPress Performance Engineer.

    Plugin List:
    ${pluginList}

    Provide a strict JSON response.
    
    For 'redundancyGroup', if multiple plugins serve the same purpose (e.g., two contact form plugins, or two SEO plugins), assign them the same short string ID (e.g., 'forms', 'seo'). If unique, leave it empty or null.
    For 'bloatScore', rate from 1 (very lightweight) to 10 (extremely heavy/bloated).
    For 'impactLevel', use 'High', 'Medium', or 'Low'.
    For 'recommendation', use 'Keep', 'Delete', 'Replace with Lighter Plugin', or 'Replace with Code'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert WordPress developer specializing in performance optimization (Core Web Vitals) and minimalism.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallHealthScore: { type: Type.NUMBER, description: "0 to 100, where 100 is perfect" },
            estimatedLoadTimeImpact: { type: Type.STRING, description: "Estimated added load time (e.g., '+0.5s')" },
            summary: { type: Type.STRING, description: "Brief executive summary of the analysis" },
            plugins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impactLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  bloatScore: { type: Type.NUMBER },
                  functionality: { type: Type.STRING },
                  reasonForImpact: { type: Type.STRING },
                  recommendation: { type: Type.STRING, enum: ["Keep", "Delete", "Replace with Lighter Plugin", "Replace with Code"] },
                  redundancyGroup: { type: Type.STRING, nullable: true },
                  alternative: {
                    type: Type.OBJECT,
                    nullable: true,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["plugin", "code"] }
                    }
                  }
                },
                required: ["name", "category", "impactLevel", "bloatScore", "functionality", "reasonForImpact", "recommendation"]
              }
            }
          },
          required: ["overallHealthScore", "estimatedLoadTimeImpact", "summary", "plugins"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(response.text);

    // Post-process to organize redundancy groups for the UI
    const redundancyGroups: Record<string, string[]> = {};
    if (result.plugins) {
      result.plugins.forEach((p: any) => {
        if (p.redundancyGroup) {
          if (!redundancyGroups[p.redundancyGroup]) {
            redundancyGroups[p.redundancyGroup] = [];
          }
          redundancyGroups[p.redundancyGroup].push(p.name);
        }
      });
    }

    // Filter out groups with only 1 item (false positives from AI sometimes)
    const cleanedRedundancyGroups: Record<string, string[]> = {};
    Object.entries(redundancyGroups).forEach(([key, value]) => {
      if (value.length > 1) {
        cleanedRedundancyGroups[key] = value;
      }
    });

    return {
      ...result,
      redundancyGroups: cleanedRedundancyGroups
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze plugins. Please try again.");
  }
};
