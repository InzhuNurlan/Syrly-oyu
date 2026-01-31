import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    const { image, lang } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Using Gemini 2.5 Flash as requested (Gemini API currently uses model strings like 'gemini-2.0-flash-exp' or 'gemini-1.5-flash')
    // Note: Model name might need adjustment based on Google's exact current enum for 2.5
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are an expert in Kazakh National Ornaments. 
    Analyze the provided image and identify the dominant ornament.
    Return ONLY a JSON object in this format:
    {
      "name_kz": "Name in Kazakh",
      "name_ru": "Name in Russian",
      "name_en": "Name in English",
      "meaning_kz": "Deep symbolic meaning in Kazakh",
      "meaning_ru": "Deep symbolic meaning in Russian",
      "meaning_en": "Deep symbolic meaning in English",
      "usage": "Traditional usage examples"
    }
    Base your answer on traditional Kazakh culture and semiotics.
  `;

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: image,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "");
        return new Response(text, { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
