import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export class GeminiService {
  /**
   * Generates caching-ready Alt Text for a product image.
   * Prompts the model to provide highly descriptive, WCAG-compliant screen reader text.
   */
  static async generateProductAltText(imageUrl: string, productTitle: string): Promise<string> {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not set. Returning fallback.");
      return `Image of ${productTitle}`;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Analyze the product image at the URL '${imageUrl}' for the product '${productTitle}'. Generate concise, highly descriptive alt-text optimized for screen readers and WCAG 2.1 AA compliance. Do not use phrases like "image of". Provide only the raw alt-text.`;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Gemini Alt-Text Gen Error:", error);
      return `Image of ${productTitle}`;
    }
  }

  /**
   * Translates a raw calendar payload into zero-trust semantic tags.
   */
  static async extractSemanticIntent(calendarSummary: string, description: string) {
    if (!apiKey) {
      return { intent: "general_shopping", environment: "indoor", duration: "1_day" };
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are a Zero Trust semantic extractor. You will receive a user's calendar event. 
        Extract precisely the core 'retail intent', the 'environment' context (e.g. cold, tropical, formal), and 'duration'.
        Format output strictly as JSON matching { "intent": string, "environment": string, "duration": string }.
        Do not retain any names, locations, or sensitive PII.
        
        Event Summary: ${calendarSummary}
        Description: ${description}
      `;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      // Clean markdown code blocks if the model wrapped it
      if (text.startsWith("\`\`\`json")) {
        text = text.replace(/\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
      }
      
      const parsed = JSON.parse(text);
      return {
        intent: parsed.intent || "general_shopping",
        environment: parsed.environment || "unknown",
        duration: parsed.duration || "1_day",
      };
    } catch (error) {
      console.error("Gemini Semantic Extraction Error:", error);
      return { intent: "general_shopping", environment: "unknown", duration: "1_day" };
    }
  }
}
