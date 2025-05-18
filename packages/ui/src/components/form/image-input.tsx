import React, { useEffect, useState } from "react";
import {
  ImagePlus,
  X,
  Maximize2,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Download,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button, Input, Dialog, DialogContent } from "../../index";

interface ImageInputProps {
  iconImage?: React.ReactNode;
  value?: string | File;
  onChange?: (file?: File) => void;
  label?: string;
  className?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  iconImage,
  label,
  value,
  onChange,
  className,
  width = 1000,
  height = 500,
  ...rest
}) => {
  const [preview, setPreview] = useState<string>("");
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const displayUrl = URL.createObjectURL(value);
      setPreview(displayUrl);

      return () => URL.revokeObjectURL(displayUrl);
    }
  }, [value]);

  useEffect(() => {
    if (!showFullPreview) {
      setZoom(1);
      setRotation(0);
    }
  }, [showFullPreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange?.(file);
    } else {
      setPreview("");
      onChange?.(undefined);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview("");
    onChange?.(undefined);
  };

  const handleExpandImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowFullPreview(true);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    if (!preview) return;
    const link = document.createElement("a");
    link.href = preview;
    link.download = `image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-2">
      <label
        className={cn(
          "relative block border-2 border-dashed rounded-lg w-full h-96 group text-center hover:border-primary focus-within:border-primary transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
          className
        )}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full"
              width={width}
              height={height}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-white/90 hover:bg-white text-gray-800"
                  onClick={handleExpandImage}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="rounded-full"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-muted/20">
            <div className="w-20 h-20 rounded-full flex items-center justify-center">
              {iconImage || (
                <ImagePlus className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{label}</p>
          </div>
        )}
        <Input
          type="file"
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          {...rest}
        />
      </label>

      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-4xl p-1 bg-black/90">
          <div className="relative w-full h-[80vh] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center overflow-auto">
              {preview && (
                <div
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.2s ease",
                  }}
                >
                  <img
                    src={preview}
                    alt="Full preview"
                    className="object-contain"
                    width={1200}
                    height={800}
                  />
                </div>
              )}
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-none text-white"
                onClick={() => setShowFullPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-full">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-none text-white h-8 w-8"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-none text-white h-8 w-8"
                onClick={handleResetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-none text-white h-8 w-8"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-none text-white h-8 w-8"
                onClick={handleRotate}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-none text-white h-8 w-8"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              {Math.round(zoom * 100)}% | {rotation}°
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};