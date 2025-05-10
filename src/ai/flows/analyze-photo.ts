'use server';

/**
 * @fileOverview Analyzes a photo to identify key elements, emotions, and themes.
 *
 * - analyzePhoto - A function that handles the photo analysis process.
 * - AnalyzePhotoInput - The input type for the analyzePhoto function.
 * - AnalyzePhotoOutput - The return type for the analyzePhoto function.
 * - AnalyzePhotoInputSchema - The Zod schema for AnalyzePhotoInput.
 * - AnalyzePhotoOutputSchema - The Zod schema for AnalyzePhotoOutput.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePhotoInput = z.infer<typeof AnalyzePhotoInputSchema>;

export const AnalyzePhotoOutputSchema = z.object({
  elements: z.string().describe('Key elements found in the photo.'),
  emotions: z.string().describe('Emotions evoked by the photo.'),
  themes: z.string().describe('Themes present in the photo.'),
});
export type AnalyzePhotoOutput = z.infer<typeof AnalyzePhotoOutputSchema>;

export async function analyzePhoto(input: AnalyzePhotoInput): Promise<AnalyzePhotoOutput> {
  return analyzePhotoFlow(input);
}

const analyzePhotoPrompt = ai.definePrompt({
  name: 'analyzePhotoPrompt',
  input: {schema: AnalyzePhotoInputSchema},
  output: {schema: AnalyzePhotoOutputSchema},
  prompt: `You are an AI expert in analyzing photos. Please analyze the photo provided to identify the key elements, emotions, and themes present in the photo.

  Photo: {{media url=photoDataUri}}

  Elements: What are the key objects, people, or scenes in the photo?
  Emotions: What emotions does the photo evoke?
  Themes: What are the overall themes or messages conveyed by the photo?

  Please provide a detailed analysis of the photo, including the elements, emotions, and themes. Focus only on the photo itself, do not attempt to access any external websites or data.
  `, 
});

const analyzePhotoFlow = ai.defineFlow(
  {
    name: 'analyzePhotoFlow',
    inputSchema: AnalyzePhotoInputSchema,
    outputSchema: AnalyzePhotoOutputSchema,
  },
  async input => {
    const {output} = await analyzePhotoPrompt(input);
    return output!;
  }
);
