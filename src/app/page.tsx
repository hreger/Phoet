'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generatePoem } from '@/ai/flows/generate-poem';
import PhotoUpload from '@/components/custom/photo-upload';
import PoemDisplay from '@/components/custom/poem-display';
import ShareOptions from '@/components/custom/share-options';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  const handlePhotoUpload = (photoDataUri: string, fileName: string) => {
    setUploadedPhoto(photoDataUri);
    setPhotoFileName(fileName);
    setGeneratedPoem(null); 
    setError(null);
  };

  const handleGeneratePoem = async () => {
    if (!uploadedPhoto) {
      toast({
        title: 'No Photo Uploaded',
        description: 'Please upload a photo first to generate a poem.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPoem(null);

    try {
      const result = await generatePoem({ photoDataUri: uploadedPhoto });
      setGeneratedPoem(result.poem);
      toast({
        title: 'Poem Generated!',
        description: 'Your poetic masterpiece is ready.',
        variant: 'default',
        duration: 5000,
      });
    } catch (e: any) {
      console.error('Error generating poem:', e);
      const errorMessage = e.message || 'Failed to generate poem. The AI might be busy or encountered an issue. Please try again later.';
      setError(errorMessage);
      toast({
        title: 'Poem Generation Failed',
        description: errorMessage,
        variant: 'destructive',
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
      <header className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif tracking-tight text-primary">
          Photo Poet
        </h1>
        <p className="text-muted-foreground mt-3 text-md md:text-lg max-w-xl mx-auto">
          Unveil the hidden verses within your images. Upload a photo and let AI weave a unique poem inspired by its essence.
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-secondary/20">
            <CardTitle className="text-2xl md:text-3xl text-secondary-foreground">Your Canvas</CardTitle>
            <CardDescription className="text-secondary-foreground/80">Upload your image to begin the poetic journey.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <PhotoUpload onPhotoUploaded={handlePhotoUpload} disabled={isLoading} />
            {uploadedPhoto && (
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-semibold text-foreground/90">Preview:</h3>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border-2 border-border shadow-md bg-muted/20">
                  <Image
                    src={uploadedPhoto}
                    alt={photoFileName || 'Uploaded photo'}
                    layout="fill"
                    objectFit="contain"
                    className="transform transition-transform duration-300 hover:scale-105"
                    data-ai-hint="uploaded image"
                  />
                </div>
                <Button
                  onClick={handleGeneratePoem}
                  disabled={isLoading || !uploadedPhoto}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? 'Crafting Poem...' : 'Craft Poem'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/20">
            <CardTitle className="text-2xl md:text-3xl text-primary-foreground">Poetic Reflection</CardTitle>
             <CardDescription className="text-primary-foreground/80">Witness the AI's lyrical interpretation of your image.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <PoemDisplay poem={generatedPoem} isLoading={isLoading} error={error} />
            {generatedPoem && !isLoading && !error && (
              <ShareOptions
                photoUrl={uploadedPhoto!}
                photoFileName={photoFileName || 'photo.png'}
                poemText={generatedPoem}
              />
            )}
          </CardContent>
        </Card>
      </main>
      
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear ?? new Date().getFullYear()} Photo Poet. All rights reserved. Crafted with AI.</p>
      </footer>
    </div>
  );
}
