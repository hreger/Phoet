'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, BookOpenText } from 'lucide-react';

interface PoemDisplayProps {
  poem: string | null;
  isLoading: boolean;
  error: string | null;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem, isLoading, error }) => {
  const [displayedPoem, setDisplayedPoem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (poem && !isLoading && !error) {
      setDisplayedPoem(poem);
      // Trigger fade-in after a short delay to ensure DOM update
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Delay clearing the poem to allow fade-out animation
      const timer = setTimeout(() => {
        if (!isLoading && !error) { // Only clear if not loading a new poem or showing an error
           setDisplayedPoem(null);
        }
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [poem, isLoading, error]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[20rem] text-muted-foreground space-y-4 p-6 rounded-lg bg-secondary/30 border border-secondary/50 shadow-inner">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="text-lg font-medium">Crafting your poem...</p>
        <p className="text-sm text-center">Letting the muses inspire us. This might take a moment.</p>
      </div>
    );
  }

  if (error && !isLoading) { // Ensure error is shown only if not loading
    return (
      <div className="flex flex-col items-center justify-center min-h-[20rem] text-destructive space-y-4 p-6 rounded-lg bg-destructive/10 border border-destructive/30 shadow-inner">
        <AlertTriangle className="h-12 w-12" />
        <p className="text-lg font-semibold">Oops! An Error Occurred.</p>
        <p className="text-sm text-center max-w-md">{error}</p>
      </div>
    );
  }
  
  // Initial placeholder or if poem is cleared
  if (!displayedPoem && !isLoading && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[20rem] text-muted-foreground space-y-4 p-6 rounded-lg bg-secondary/30 border border-secondary/50 shadow-inner">
        <BookOpenText className="h-16 w-16 opacity-50" />
        <p className="text-lg font-medium">Your poem will appear here.</p>
        <p className="text-sm text-center">Upload a photo and click "Craft Poem" to see the magic.</p>
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${isVisible && displayedPoem ? 'opacity-100' : 'opacity-0'}`}
      aria-live="polite"
    >
      {displayedPoem && (
         <div className="p-4 sm:p-6 bg-primary/5 rounded-lg shadow-inner min-h-[20rem] border border-primary/20">
          <pre className="whitespace-pre-wrap font-poem text-base sm:text-lg leading-relaxed text-foreground/90 bg-transparent p-0">
            {displayedPoem}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PoemDisplay;
