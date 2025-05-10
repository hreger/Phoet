/**
 * @fileOverview Defines Zod schemas and TypeScript types for photo analysis.
 * These schemas are used by the photo analysis AI flow and related tools.
 * This file does not use the 'use server' directive and can be imported by
 * server-side flows or other modules as needed.
 *
 * Exports:
 * - AnalyzePhotoInputSchema: Zod schema for the input of the photo analysis flow.
 * - AnalyzePhotoInput: TypeScript type inferred from AnalyzePhotoInputSchema.
 * - AnalyzePhotoOutputSchema: Zod schema for the output of the photo analysis flow.
 * - AnalyzePhotoOutput: TypeScript type inferred from AnalyzePhotoOutputSchema.
 */

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
