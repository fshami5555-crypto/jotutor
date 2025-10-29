import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a lesson plan using the Gemini API.
 * @param subject The subject of the lesson.
 * @param level The educational level (e.g., elementary, high school).
 * @param topic The specific topic for the lesson plan.
 * @returns A string containing the generated lesson plan.
 */
export const generateLessonPlan = async (subject: string, level: string, topic: string): Promise<string> => {
    const model = 'gemini-2.5-flash';

    const prompt = `
        أنشئ خطة درس مفصلة باللغة العربية.
        المادة: ${subject}
        المرحلة الدراسية: ${level}
        موضوع الدرس: ${topic}

        يجب أن تتضمن الخطة ما يلي:
        1.  **الأهداف التعليمية:** (ماذا سيتعلم الطالب بنهاية الدرس؟)
        2.  **المواد والأدوات اللازمة:** (أي شيء مطلوب للدرس)
        3.  **مقدمة ونشاط استهلالي:** (لجذب انتباه الطلاب)
        4.  **شرح المفاهيم الأساسية:** (خطوات شرح الدرس)
        5.  **نشاط تطبيقي:** (تمرين عملي لترسيخ المفهوم)
        6.  **التقييم والواجب المنزلي:** (كيفية قياس فهم الطلاب وما يجب عليهم فعله بعد الدرس)
        
        اجعل الخطة واضحة ومنظمة وسهلة المتابعة للمعلم.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error('Error generating lesson plan:', error);
        throw new Error('Failed to generate lesson plan from Gemini API.');
    }
};

/**
 * Translates a JSON object's values to a target language using the Gemini API.
 * @param content The JSON object to translate.
 * @param targetLanguage The target language (e.g., "English").
 * @returns A new JSON object with translated string values.
 */
export const translateContent = async (content: object, targetLanguage: string): Promise<any> => {
    const model = 'gemini-2.5-pro'; // Use a powerful model for reliable JSON translation

    const prompt = `
        You are an expert localization specialist. Translate all Arabic string values in the following JSON object to professional, natural-sounding ${targetLanguage}.
        The context is for an educational tutoring platform named "JoTutor".
        
        RULES:
        - DO NOT translate the JSON keys. The keys must remain exactly the same.
        - Preserve the original JSON structure EXACTLY.
        - Keep all non-string values (numbers, booleans, nulls) as they are.
        - For arrays of strings, translate each string element in the array.
        - The final output MUST be a single, valid JSON object and nothing else.

        JSON to translate:
        ${JSON.stringify(content, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        let jsonStr = response.text.trim();
        // Clean up potential markdown wrappers from the response
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
        }

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Error translating content:', error);
        throw new Error('Failed to translate content using Gemini API.');
    }
};