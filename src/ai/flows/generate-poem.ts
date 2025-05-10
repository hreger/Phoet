// The AI flow for generating poems from photos.

'use server';

/**
 * @fileOverview Generates a poem inspired by an image.
 *
 * - generatePoem - A function that generates a poem based on the analysis of a photo.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  analyzePhoto,
  // Import schemas from the new central location
  // type AnalyzePhotoInput, // Already imported below
  // type AnalyzePhotoOutput, // Already imported below
} from './analyze-photo';
import {
  AnalyzePhotoInputSchema,
  AnalyzePhotoOutputSchema,
  type AnalyzePhotoInput,
  type AnalyzePhotoOutput,
} from '@/ai/schemas/photo-analysis-schemas';


const GeneratePoemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to inspire the poem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('A poem inspired by the photo.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

// Export only the async function and types
export type { GeneratePoemInput, GeneratePoemOutput };

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const analyzePhotoTool = ai.defineTool(
  {
    name: 'analyzePhoto', // Name registered with Genkit, used by LLM in prompts
    description: 'Analyzes a photo and extracts key elements, emotions, and themes by calling the analyzePhoto flow.',
    inputSchema: AnalyzePhotoInputSchema, // Use imported schema
    outputSchema: AnalyzePhotoOutputSchema, // Use imported schema
  },
  async (input: AnalyzePhotoInput): Promise<AnalyzePhotoOutput> => {
    // Call the imported analyzePhoto flow
    const analysisResult = await analyzePhoto(input);
    return analysisResult;
  }
);

const poemPrompt = ai.definePrompt({
  name: 'poemPrompt',
  input: {schema: GeneratePoemInputSchema},
  output: {schema: GeneratePoemOutputSchema},
  tools: [analyzePhotoTool], // Pass the variable holding the tool definition
  prompt: `You are a poet laureate, skilled in crafting evocative poems.

  First, use the analyzePhoto tool to analyze the photo. The tool will return an object containing 'elements', 'emotions', and 'themes' from the photo.

  Then, compose a poem inspired by the analysis of the photo. The poem should capture the key elements, emotions, and themes identified in the analysis. The poem should be no more than 10 lines.

  Photo: {{media url=photoDataUri}}
  `,
});

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async (input: GeneratePoemInput) => { // Corrected from (input => { to async (input: GeneratePoemInput) => {
    const {output} = await poemPrompt(input);
    return output!;
  }
);
