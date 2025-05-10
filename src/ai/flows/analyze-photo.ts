'use server';

/**
 * @fileOverview Analyzes a photo to identify key elements, emotions, and themes using an AI flow.
 * This file defines the server-side flow logic for photo analysis.
 * Schemas are imported from '@/ai/schemas/photo-analysis-schemas'.
 *
 * Exports:
 * - analyzePhoto: An async function that takes AnalyzePhotoInput and returns AnalyzePhotoOutput.
 * - AnalyzePhotoInput: The TypeScript type for the input to the analyzePhoto flow.
 * - AnalyzePhotoOutput: The TypeScript type for the output from the analyzePhoto flow.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzePhotoInputSchema,
  AnalyzePhotoOutputSchema,
  type AnalyzePhotoInput,
  type AnalyzePhotoOutput,
} from '@/ai/schemas/photo-analysis-schemas';

// Export only the async function and types as per 'use server' and Genkit guidelines
export type { AnalyzePhotoInput, AnalyzePhotoOutput };

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
  async (input: AnalyzePhotoInput) => { // Corrected from (input => { to async (input: AnalyzePhotoInput) => {
    const {output} = await analyzePhotoPrompt(input);
    return output!;
  }
);
