'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Share2 } from 'lucide-react';

interface ShareOptionsProps {
  photoUrl: string;
  photoFileName: string;
  poemText: string;
}

const ShareOptions: React.FC<ShareOptionsProps> = ({ photoUrl, photoFileName, poemText }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      const combinedText = `My PhotoPoem Creation\nPhoto: ${photoFileName}\n\nPoem:\n${poemText}`;
      await navigator.clipboard.writeText(combinedText);
      toast({
        title: 'Copied to Clipboard!',
        description: 'The poem and photo name are ready to be pasted.',
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: 'Error Copying',
        description: 'Could not copy to clipboard. Please try again or copy manually.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPhoto = () => {
    try {
      const link = document.createElement('a');
      link.href = photoUrl;
      
      const namePart = photoFileName.substring(0, photoFileName.lastIndexOf('.')) || 'photo-poet-image';
      const extension = photoFileName.split('.').pop() || 'png';
      link.download = `${namePart}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: 'Download Started',
        description: `Downloading ${link.download}... Check your downloads folder.`,
      });
    } catch (err) {
       console.error('Failed to download: ', err);
      toast({
        title: 'Download Error',
        description: 'Could not initiate download. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleShare = async () => {
    const shareData = {
      title: 'My PhotoPoem Creation',
      text: `Check out this poem I generated with Photo Poet!\n\nPoem:\n${poemText}\n\n(Inspired by photo: ${photoFileName})`,
      // url: window.location.href, // Optional: share a link to the app
    };

    // Attempt to convert data URI to Blob for sharing file directly, if desired
    // This can be complex and browser-dependent, especially with large files.
    // For simplicity, we'll share text. If direct image sharing is needed:
    //
    // let filesArray = [];
    // if (photoUrl.startsWith('data:image')) {
    //   try {
    //     const res = await fetch(photoUrl);
    //     const blob = await res.blob();
    //     const extension = photoFileName.split('.').pop() || 'png';
    //     const newFile = new File([blob], photoFileName, { type: blob.type || `image/${extension}` });
    //     if (navigator.canShare && navigator.canShare({ files: [newFile] })) {
    //       shareData.files = [newFile];
    //     }
    //   } catch (e) {
    //     console.error("Error creating file from data URI for sharing:", e);
    //   }
    // }
    
    if (navigator.share) { // Simpler check, navigator.canShare can be more specific
      try {
        await navigator.share(shareData);
        toast({ title: 'Shared!', description: 'Content shared successfully.' });
      } catch (err) {
        console.error('Error sharing:', err);
        if ((err as Error).name !== 'AbortError') { // User didn't cancel
          toast({ title: 'Share Error', description: 'Could not share content. Try copying instead.', variant: 'default' });
        }
      }
    } else {
      toast({
        title: 'Web Share Not Supported',
        description: 'Your browser doesn\'t support direct sharing. Poem copied to clipboard!',
        variant: 'default'
      });
      handleCopyToClipboard(); // Fallback to copy
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-primary/20">
      <h4 className="text-lg font-semibold mb-4 text-center text-foreground/80">Share Your Creation</h4>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={handleCopyToClipboard} className="flex-1 shadow-sm hover:shadow-md transition-shadow border-primary/40 hover:bg-primary/10">
          <Copy className="mr-2 h-4 w-4 text-primary" /> Copy Text
        </Button>
        <Button variant="outline" onClick={handleDownloadPhoto} className="flex-1 shadow-sm hover:shadow-md transition-shadow border-primary/40 hover:bg-primary/10">
          <Download className="mr-2 h-4 w-4 text-primary" /> Download Photo
        </Button>
         <Button variant="outline" onClick={handleShare} className="flex-1 shadow-sm hover:shadow-md transition-shadow border-primary/40 hover:bg-primary/10">
          <Share2 className="mr-2 h-4 w-4 text-primary" /> Share All
        </Button>
      </div>
    </div>
  );
};

export default ShareOptions;
