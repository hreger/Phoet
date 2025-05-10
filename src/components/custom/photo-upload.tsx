'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button'; // For a potential clear button

interface PhotoUploadProps {
  onPhotoUploaded: (photoDataUri: string, fileName: string) => void;
  disabled?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoUploaded, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    if (disabled) return;
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        const msg = 'File is too large. Max 5MB allowed.';
        setError(msg);
        toast({ title: 'Upload Error', description: msg, variant: 'destructive' });
        setPreview(null);
        setFileName(null);
        onPhotoUploaded('', ''); // Clear any previous photo
        return;
      }
      if (!file.type.startsWith('image/')) {
        const msg = 'Invalid file type. Please upload an image (PNG, JPG, GIF, WEBP).';
        setError(msg);
        toast({ title: 'Upload Error', description: msg, variant: 'destructive' });
        setPreview(null);
        setFileName(null);
        onPhotoUploaded('', ''); // Clear any previous photo
        return;
      }

      setIsProcessing(true);
      setError(null);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        onPhotoUploaded(dataUri, file.name);
        setIsProcessing(false);
        toast({ title: 'Photo Selected', description: `${file.name} is ready for poem generation.`, variant: 'default' });
      };
      reader.onerror = () => {
        const msg = 'Failed to read file.';
        setError(msg);
        toast({ title: 'Upload Error', description: msg, variant: 'destructive' });
        setIsProcessing(false);
        onPhotoUploaded('', ''); // Clear any previous photo
      };
      reader.readAsDataURL(file);
    }
  }, [onPhotoUploaded, toast, disabled]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    multiple: false,
    disabled,
    noClick: true, // We'll use our own button for click
    noKeyboard: true,
  });

  const handleClearPhoto = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    onPhotoUploaded('', ''); // Notify parent component
    toast({ title: 'Photo Cleared', description: 'Upload another photo to continue.', variant: 'default' });
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg transition-colors
                    ${isDragActive ? 'border-accent bg-accent/10 shadow-inner' : 'border-border hover:border-accent/70'}
                    ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                    flex flex-col items-center justify-center text-center space-y-2 min-h-[150px] bg-secondary/10`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
        ) : preview ? (
          <CheckCircle className="h-10 w-10 text-green-500" />
        ) : (
          <UploadCloud className={`h-10 w-10 ${isDragActive ? 'text-accent' : 'text-muted-foreground'}`} />
        )}
        
        {isProcessing ? (
          <p className="text-accent font-medium">Processing...</p>
        ) : preview ? (
          <p className="text-green-600 dark:text-green-400 font-medium">Photo Selected: {fileName}</p>
        ) : isDragActive ? (
          <p className="text-accent font-semibold">Drop the photo here...</p>
        ) : (
          <p className="text-muted-foreground">Drag & drop a photo here</p>
        )}
        {!preview && !isProcessing && <Button type="button" variant="link" onClick={open} disabled={disabled} className="text-accent font-semibold p-0 h-auto">or click to select</Button>}
        <p className="text-xs text-muted-foreground/80">PNG, JPG, GIF, WEBP up to 5MB</p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-destructive p-2 bg-destructive/10 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {preview && !isProcessing && (
        <Button variant="outline" onClick={handleClearPhoto} className="w-full text-sm" disabled={disabled}>
          Clear Photo & Upload New
        </Button>
      )}
    </div>
  );
};

export default PhotoUpload;
