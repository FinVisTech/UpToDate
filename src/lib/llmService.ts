import { supabase } from './supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI
// NOTE: In Vite, env vars are exposed via import.meta.env
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = googleApiKey ? new GoogleGenerativeAI(googleApiKey) : null;

/**
 * Generates a system prompt based on the provided tree data using Google Gemini.
 */
export async function generateSystemPrompt(treeData: any, type: string): Promise<string> {
    if (!genAI) {
        throw new Error("Missing Google API Key. Please configure VITE_GOOGLE_API_KEY in .env");
    }

    // 1. Flatten the tree data
    const context = formatTreeData(treeData, type);

    // 2. Construct the prompt for the Low Level LLM (Gemini)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const instruction = `
You are an expert AI prompt engineer. Your task is to generate a highly effective System Prompt for a High-Level LLM (like GPT-4 or Claude 3.5 Sonnet).

The High-Level LLM will be used by a user to manage and track the following product/entity daily.
Your output must be ONLY the System Prompt text, ready to be pasted into the High-Level LLM's configuration.

DATA CONTEXT:
${context}

REQUIREMENTS FOR THE GENERATED SYSTEM PROMPT:
1. Role: define the AI as an expert analyst for this specific domain.
2. Context: Include key details from the data structure (Name, Description, Stakeholders, Strategy).
3. Objective: The AI should search the web daily for news, competitor updates, and market shifts relevant to this entity.
4. Structure: The output prompt should be structured with "Role", "Context", "Daily Instructions", and "Output Format".
5. Tone: Professional, strategic, and actionable.

Generate the System Prompt now.
`;

    try {
        const result = await model.generateContent(instruction);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error calling Google Gemini:", error);
        throw new Error("Failed to generate system prompt via API.");
    }
}

/**
 * Helper to format tree data into a string representation
 */
function formatTreeData(data: any, type: string): string {
    return JSON.stringify({
        type,
        name: data.name,
        description: data.description || 'No description provided.',
        link: data.link || 'No link provided.',
        stakeholders: data.stakeholders || 'None listed',
        strategic_details: data.details || {},
        product_structure: data.subProducts || []
    }, null, 2);
}

/**
 * Saves the generated prompt to Supabase
 */
export async function saveGeneratedPrompt(itemId: string, configId: string, promptContent: string, sourceSnapshot: any) {
    const { error } = await supabase
        .from('generated_prompts')
        .insert({
            item_id: itemId,
            config_id: configId,
            prompt_content: promptContent,
            source_data_snapshot: sourceSnapshot
        });

    if (error) {
        console.error('Error saving generated prompt:', error);
        throw error;
    }
}
