import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, ZoomIn, ZoomOut, RotateCw, Image as ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName: string;
  onDownload?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fileName,
  onDownload
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // Create a thumbnail URL based on the image URL
  useEffect(() => {
    if (imageUrl) {
      // For placeholder images, create a smaller version
      if (imageUrl.includes('picsum.photos')) {
        const thumbnailSize = 200;
        const parts = imageUrl.split('/');
        const idIndex = parts.findIndex(part => part === 'seed') + 1;
        if (idIndex > 0 && idIndex < parts.length) {
          // Replace dimensions with thumbnail size
          const id = parts[idIndex];
          setThumbnailUrl(`https://picsum.photos/seed/${id}/${thumbnailSize}/${thumbnailSize}`);
        } else {
          setThumbnailUrl(imageUrl);
        }
      } else if (imageUrl.startsWith('data:')) {
        // For data URLs, we use the same image since we can't resize it easily
        setThumbnailUrl(imageUrl);
      } else {
        // For regular URLs, we could append a query parameter for resize services
        // This is just a placeholder implementation
        setThumbnailUrl(imageUrl);
      }
    }
  }, [imageUrl]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
    setIsImageLoaded(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetView();
      }
    }}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="pr-10">{fileName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow flex items-center justify-center overflow-hidden relative my-4 h-[60vh]">
          {/* Thumbnail shown while full image loads */}
          {!isImageLoaded && thumbnailUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
              <img
                src={thumbnailUrl}
                alt="Loading preview"
                className="max-w-full max-h-full object-contain filter blur-[2px]"
                style={{ opacity: 0.7 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/80 rounded-full p-2">
                  <ZoomIn className="h-8 w-8 animate-pulse text-primary" />
                </div>
              </div>
            </div>
          )}
          
          {/* Full image */}
          <img
            src={imageUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain transition-transform"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              opacity: isImageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              console.error('Failed to load image:', e);
              // Show error state
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Fallback if image fails to load */}
          {isImageLoaded === false && !thumbnailUrl && (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4" />
              <p>Unable to load image</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex-shrink-0 flex justify-between sm:justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4 mr-1" />
              Zoom In
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4 mr-1" />
              Zoom Out
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="h-4 w-4 mr-1" />
              Rotate
            </Button>
          </div>
          <div className="flex space-x-2">
            {onDownload && (
              <Button variant="secondary" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
            <Button variant="default" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview; 