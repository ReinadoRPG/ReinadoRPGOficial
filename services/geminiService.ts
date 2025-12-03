import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AiMode, AspectRatio, ImageSize } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerationOptions {
  prompt: string;
  mode: AiMode;
  imageOptions?: {
    aspectRatio: AspectRatio;
    imageSize: ImageSize;
  };
}

export const generateResponse = async (options: GenerationOptions): Promise<{ text?: string; image?: string }> => {
  const { prompt, mode, imageOptions } = options;

  try {
    // 1. Image Generation (gemini-3-pro-image-preview)
    if (mode === AiMode.CREATIVE && imageOptions) {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: imageOptions.aspectRatio,
            imageSize: imageOptions.imageSize,
          },
        },
      });

      let text = "";
      let image = "";

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          } else if (part.text) {
            text += part.text;
          }
        }
      }
      
      return { text: text || "Aqui está sua imagem gerada.", image };
    }

    // 2. Thinking Mode (gemini-3-pro-preview)
    if (mode === AiMode.THINKING) {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 32768, // Max budget for pro
          },
          // Do not set maxOutputTokens when using thinking budget as per guidelines
        },
      });
      return { text: response.text };
    }

    // 3. Fast Mode (gemini-2.5-flash-lite)
    if (mode === AiMode.FAST) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-latest', // Explicit mapping for flash lite
        contents: prompt,
      });
      return { text: response.text };
    }

    // 4. Standard Default (gemini-2.5-flash)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é o assistente oficial do ReinadoRPG, um servidor de Minecraft medieval. Responda como um sábio mago ou cavaleiro, usando termos da época.",
      }
    });
    return { text: response.text };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Perdão, aventureiro. Os ventos da magia estão turbulentos e não consegui processar seu pedido. Tente novamente mais tarde." };
  }
};