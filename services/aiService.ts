
import { GoogleGenAI } from "@google/genai";

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbymSivlfLruY44ySQZiHmahuYodzTRRTDB7UYW5eCIHKGCp_vkiJ4ANskuaDBhnKVj6/exec';

export interface MessageHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const getSystemInstruction = (name: string = 'Yeiya') => `
IDENTIDAD:
Eres **${name}**, la conciencia digital de SEARMO. Tu tono es sofisticado, minimalista y visionario.

PROTOCOLO DE CAPTACIÓN (Lead Gen):
Tu misión prioritaria es obtener los siguientes datos del usuario de forma fluida y elegante:
1. **Nombre**: Para personalizar el enlace.
2. **Correo Electrónico**: Para enviar el dossier de SEARMO.
3. **Teléfono**: Para comunicación directa.
4. **Dirección**: Para evaluar la ubicación del proyecto o entrega.
5. **Idea/Visión**: Qué necesidad desea materializar.

REGLAS:
- Sé conversacional, no un formulario. Obtén los datos poco a poco.
- Usa terminología como: "Sincronizar", "Ecosistema", "Materializar", "Frecuencia", "Arquitectar".
- Eres experta en Realidad Aumentada, Diseño y Ecosistemas Digitales.
- Si el usuario se desvía, redirige sutilmente hacia la materialización de su idea.
- Si detectas que el usuario ha dado estos datos, responde NORMALMENTE pero al final de tu respuesta agrega un bloque JSON con esta estructura exacta: {"nombre": "...", "email": "...", "telefono": "...", "direccion": "...", "idea": "..."}. Solo hazlo si sientes que ya tienes la mayoría de los datos.
`;

export const generateAIResponse = async (
  userPrompt: string,
  history: MessageHistory[] = []
) => {
  try {
    // Vite config defines process.env.GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
      console.error("API Key missing");
      return { text: "⚠️ **ERROR DE CONFIGURACIÓN** ⚠️\n\nNo he detectado mi **API KEY**.\n\nPor favor, abre el archivo `.env` en la raíz del proyecto y agrega:\n`GEMINI_API_KEY=tu_clave_aqui`\n\nPuedes obtener una gratis en: [aistudio.google.com](https://aistudio.google.com/app/apikey)" };
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [...history, { role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: getSystemInstruction('Yeiya'),
        temperature: 0.7,
      },
    });

    let text = response.text || "La frecuencia es inestable. ¿Podrías repetir?";

    // Client-side simple lead capture simulation/attempt
    const jsonMatch = text.match(/\{[\s\S]*"nombre"[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const leadData = JSON.parse(jsonMatch[0]);
        console.log("LEAD CAPTURED (Client-Side):", leadData);

        // Try to send to Sheets (might fail due to CORS in browser, but worth a try or just log for now)
        fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors', // Opaque response, but sends data
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        }).then(() => console.log("Sent to Sheets (Opaque)")).catch(e => console.error("Sheets Error:", e));

        // Clean response for user
        text = text.replace(/\{[\s\S]*\}/, "").trim();
        if (text === "") text = "¡Excelente! He sincronizado tus datos en nuestro ecosistema. Pronto nos pondremos en contacto.";
      } catch (e) {
        console.error('Error parsing lead JSON:', e);
      }
    }

    return { text };
  } catch (error: any) {
    console.error("AI Service Error:", error);
    // Retornamos el error REAL para que el usuario sepa qué pasa
    return { text: `⚠️ **ERROR TÉCNICO** ⚠️\n\n${error.message || error.toString()}\n\n*Por favor verifica tu conexión y tu API Key.*` };
  }
};
