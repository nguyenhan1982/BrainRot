
import { GoogleGenAI, Type } from "@google/genai";
import type { ContentLog, QuizQuestion, AnalysisResult, DefinitionResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateDefinition = async (contentType: string): Promise<DefinitionResult | null> => {
    try {
        const prompt = `Cung cấp định nghĩa chi tiết và 3 ví dụ rõ ràng về nội dung "thối não" thuộc loại: "${contentType}". Giải thích ngắn gọn tại sao nó có hại cho tư duy phản biện. Định dạng câu trả lời dưới dạng JSON với các khóa 'definition' (string) và 'examples' (mảng các chuỗi).`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as DefinitionResult;

    } catch (error) {
        console.error("Error generating definition:", error);
        return null;
    }
};


export const generateQuizQuestions = async (): Promise<QuizQuestion[] | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Tạo một bài trắc nghiệm gồm 5 câu hỏi trắc nghiệm để kiểm tra khả năng nhận diện nội dung "thối não" của người dùng. Đối với mỗi câu hỏi, hãy cung cấp một kịch bản hoặc một tiêu đề nội dung. Các lựa chọn nên bao gồm một câu trả lời đúng (xác định đó là nội dung thối não và tại sao) và 2-3 câu trả lời gây nhiễu hợp lý. Bài kiểm tra nên bao gồm các loại khác nhau như tin giật gân, thông tin sai lệch và video ngắn vô nghĩa. Định dạng phản hồi dưới dạng một mảng JSON của các đối tượng, trong đó mỗi đối tượng có các khóa 'question', 'options' (mảng chuỗi) và 'correctAnswerIndex'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            correctAnswerIndex: { type: Type.INTEGER }
                        },
                        required: ["question", "options", "correctAnswerIndex"]
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as QuizQuestion[];
    } catch (error) {
        console.error("Error generating quiz questions:", error);
        return null;
    }
};

export const evaluateQuiz = async (score: number, totalQuestions: number): Promise<string | null> => {
    try {
        const prompt = `Một người dùng đã đạt được ${score} trên ${totalQuestions} điểm trong một bài kiểm tra về việc xác định nội dung "thối não". Cung cấp một phản hồi ngắn gọn, đáng khích lệ và mang tính xây dựng dựa trên số điểm này. Nếu điểm thấp, hãy đưa ra các mẹo để cải thiện. Nếu điểm cao, hãy khen ngợi kỹ năng tư duy phản biện của họ. Giữ độ dài dưới 100 từ và viết bằng tiếng Việt.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error evaluating quiz:", error);
        return "Không thể tạo phản hồi. Vui lòng thử lại.";
    }
};


export const analyzeConsumption = async (logs: ContentLog[]): Promise<AnalysisResult | null> => {
    try {
        const prompt = `Phân tích nhật ký tiêu thụ nội dung hàng ngày sau đây: ${JSON.stringify(logs)}. Mỗi mục ghi có 'type' và 'duration' tính bằng phút. Gán điểm "tiềm năng thối não" từ 1 (thấp) đến 5 (cao) cho mỗi loại nội dung. Tính toán "mức độ tiềm năng thối não" tổng thể cho ngày (từ 0 đến 100). Cung cấp một phân tích ngắn gọn về thói quen tiêu thụ của người dùng và 2-3 gợi ý có thể hành động để có một "khẩu phần thông tin" lành mạnh hơn. Định dạng phản hồi dưới dạng JSON với các khóa 'overallScore' (số), 'analysis' (chuỗi) và 'suggestions' (mảng chuỗi).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.NUMBER },
                        analysis: { type: Type.STRING },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["overallScore", "analysis", "suggestions"]
                }
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing consumption:", error);
        return null;
    }
};
