"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";

interface ImageInputProps {
  iconImage?: React.ReactNode;
  value?: string[] | File[];
  onChange?: (files?: File[]) => void;
  label?: string;
  className?: string;
  width?: number;
  height?: number;
  multiple?: boolean;
  [key: string]: any;
}

export const ImageInputMulti: React.FC<ImageInputProps> = ({
  iconImage,
  label,
  value = [],
  onChange,
  className,
  width = 500,
  height = 500,
  multiple = true,
  ...rest
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  useEffect(() => {
    const urls = (value || []).map((v) =>
      typeof v === "string" ? v : URL.createObjectURL(v)
    );
    setPreviews(urls);

    return () => {
      value?.forEach((v) => {
        if (v instanceof File) URL.revokeObjectURL(URL.createObjectURL(v));
      });
    };
  }, [value]);

  useEffect(() => {
    if (!showFullPreview) {
      setZoom(1);
      setRotation(0);
    }
  }, [showFullPreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newValue = multiple ? [...(value || []), ...files] : [files[0]];
      onChange?.(newValue as File[]);
    }
    event.target.value = "";
  };

  const handleRemoveImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);

    const newValues = [...(value || [])];
    newValues.splice(index, 1);

    setPreviews(newPreviews);
    onChange?.(newValues as File[]);
  };

  const handleExpandImage = (index: number) => {
    setCurrentPreviewIndex(index);
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
    const current = previews[currentPreviewIndex];
    if (!current) return;
    const link = document.createElement("a");
    link.href = current;
    link.download = `image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "w-full",

          "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center",

          className
        )}
      >
        {previews.map((url, index) => (
          <div
            key={index}
            className={cn(
              "relative rounded-xl overflow-hidden group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700",
              !multiple
                ? "w-48 h-48"
                : previews.length === 1
                  ? "w-64 h-64"
                  : "aspect-square"
            )}
          >
            <img
              src={url || "/placeholder.svg"}
              alt={`Preview ${index}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              width={width}
              height={height}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="flex gap-3">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm h-10 w-10 transition-all duration-200 hover:scale-110"
                  onClick={() => handleExpandImage(index)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="rounded-full shadow-lg backdrop-blur-sm h-10 w-10 transition-all duration-200 hover:scale-110"
                  onClick={(e) => handleRemoveImage(e, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {((!multiple && previews.length === 0) ||
          (multiple && previews.length < 9)) && (
          <label
            className={cn(
              "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center hover:border-primary hover:bg-primary/5 cursor-pointer bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 transition-all duration-300 hover:shadow-lg group",
              !multiple
                ? "w-full h-48"
                : previews.length === 0
                  ? "w-64 h-64"
                  : "aspect-square"
            )}
          >
            <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors duration-300 p-6">
              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mb-3">
                {iconImage || <ImagePlus className="h-8 w-8" />}
              </div>
              <p className="text-sm font-medium text-center">
                {label || "Upload Image"}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1 text-center">
                PNG, JPG up to 10MB
              </p>
            </div>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              multiple={multiple}
              className="hidden"
              onChange={handleFileChange}
              {...rest}
            />
          </label>
        )}
      </div>

      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-6xl p-0 bg-black/95 backdrop-blur-xl border-gray-800">
          <div className="relative w-full h-[85vh] overflow-hidden rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center overflow-auto">
              {previews[currentPreviewIndex] && (
                <div
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.2s ease",
                  }}
                >
                  <img
                    src={previews[currentPreviewIndex] || "/placeholder.svg"}
                    alt="Full preview"
                    className="object-contain"
                    width={1200}
                    height={800}
                  />
                </div>
              )}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/70 hover:bg-black/90 border-gray-600 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
                onClick={() => setShowFullPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/70 p-3 rounded-full backdrop-blur-xl border border-gray-700">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-gray-600 text-white h-10 w-10 transition-all duration-200 hover:scale-110"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-gray-600 text-white h-10 w-10 transition-all duration-200 hover:scale-110"
                onClick={handleResetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-gray-600 text-white h-10 w-10 transition-all duration-200 hover:scale-110"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-gray-600 text-white h-10 w-10 transition-all duration-200 hover:scale-110"
                onClick={handleRotate}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full bg-black/50 hover:bg-black/70 border-gray-600 text-white h-10 w-10 transition-all duration-200 hover:scale-110"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-sm text-white backdrop-blur-xl border border-gray-700">
              {Math.round(zoom * 100)}% | {rotation}°
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
