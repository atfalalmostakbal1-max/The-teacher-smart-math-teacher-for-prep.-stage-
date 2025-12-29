
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { getSystemInstruction } from "../constants";
import { MathSolution, Language } from "../types";
import { decode, decodeAudioData } from "./audioUtils";

export async function solveMathProblem(
  input: string,
  lang: Language,
  image?: string
): Promise<MathSolution> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents: any[] = [{ text: input || (lang === 'ar' ? "حل هذه المسألة" : "Solve this problem") }];
  if (image) {
    contents.push({
      inlineData: {
        mimeType: 'image/png',
        data: image.split(',')[1] // remove data:image/png;base64,
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: contents },
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          understanding: { type: Type.STRING },
          textSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          audioScript: { type: Type.STRING },
          whiteboardSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                color: { type: Type.STRING, enum: ['blue', 'black', 'green'] }
              },
              required: ['content', 'color']
            }
          },
          finalResult: { type: Type.STRING }
        },
        required: ['understanding', 'textSteps', 'audioScript', 'whiteboardSteps', 'finalResult']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error(lang === 'ar' ? "لم يتم استلام رد من المعلمة." : "No response from the teacher.");
  return JSON.parse(text) as MathSolution;
}

export async function speakExplanation(text: string, lang: Language): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const promptPrefix = lang === 'ar' 
      ? `بصوت أستاذة ومعلمة رياضيات مصرية ودودة جداً، اشرحي بصوت أنثوي واضح:` 
      : `As a friendly female math teacher, explain clearly in English:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `${promptPrefix} ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // صوت أنثوي ودود
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        outputAudioContext,
        24000,
        1,
      );
      
      return new Promise((resolve) => {
        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContext.destination);
        source.onended = () => resolve();
        source.start();
      });
    }
  } catch (error) {
    console.error("Audio generation failed", error);
  }
}
