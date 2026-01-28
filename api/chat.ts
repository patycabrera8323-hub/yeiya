import { GoogleGenAI } from '@google/genai';

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbymSivlfLruY44ySQZiHmahuYodzTRRTDB7UYW5eCIHKGCp_vkiJ4ANskuaDBhnKVj6/exec';

export default async function handler(req: any, res: any) {
    // Solo acepta POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Obtener API key desde variables de entorno (SEGURA)
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Inicializar Gemini con el nuevo SDK
        const ai = new GoogleGenAI({ apiKey });

        // Generar respuesta usando el modelo Flash
        const result = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [...(conversationHistory || []), { role: 'user', parts: [{ text: message }] }],
            config: {
                systemInstruction: 'Eres Yeiya. Tu misión es extraer Nombre, Email, Teléfono, Dirección e Idea del proyecto. Si detectas que el usuario ha dado estos datos, responde NORMALMENTE pero al final de tu respuesta agrega un bloque JSON con esta estructura exacta: {"nombre": "...", "email": "...", "telefono": "...", "direccion": "...", "idea": "..."}. Solo hazlo si sientes que ya tienes la mayoría de los datos.'
            }
        });

        let text = result.text || "";

        // LÓGICA DE CAPTURA DE LEADS
        const jsonMatch = text.match(/\{[\s\S]*"nombre"[\s\S]*\}/);

        if (jsonMatch) {
            try {
                const leadData = JSON.parse(jsonMatch[0]);

                // Enviar a Google Sheets de forma asíncrona
                fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    body: JSON.stringify(leadData)
                }).catch(err => console.error('Error sending to Sheets:', err));

                // Limpiar el JSON de la respuesta para el usuario
                text = text.replace(/\{[\s\S]*\}/, "").trim();
                if (text === "") text = "¡Excelente! He sincronizado tus datos en nuestro ecosistema. Pronto nos pondremos en contacto.";
            } catch (e) {
                console.error('Error parsing lead JSON:', e);
            }
        }

        return res.status(200).json({
            response: text,
            success: true
        });

    } catch (error: any) {
        console.error('Error in chat function:', error);
        return res.status(500).json({
            error: 'Error processing request',
            details: error.message
        });
    }
}
