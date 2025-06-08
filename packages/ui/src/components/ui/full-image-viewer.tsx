"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FullImageViewerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  thumbnailClassName?: string;
  imageList?: Array<{ src: string; alt: string }>;
  currentIndex?: number;
  onImageChange?: (index: number) => void;
}

export function FullImageViewer({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  thumbnailClassName = "",
  imageList = [],
  currentIndex = 0,
  onImageChange,
}: FullImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
    fileSize?: string;
  }>({
    width: 0,
    height: 0,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  const minScale = 0.5;
  const maxScale = 5;

  // Reset zoom and position when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isOpen) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.min(Math.max(scale + delta, minScale), maxScale);
      setScale(newScale);
    };

    if (isOpen) {
      document.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen, scale]);

  // Handle keyboard navigation
  useEffect(() => {
    if (isOpen && imageList.length > 0) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentImageIndex, imageList.length]);

  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDragging) {
      setIsOpen(false);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, maxScale));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, minScale));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handlePrevImage = () => {
    if (imageList.length > 0) {
      const newIndex =
        currentImageIndex > 0 ? currentImageIndex - 1 : imageList.length - 1;
      setCurrentImageIndex(newIndex);
      onImageChange?.(newIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleNextImage = () => {
    if (imageList.length > 0) {
      const newIndex =
        currentImageIndex < imageList.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      onImageChange?.(newIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrevImage();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNextImage();
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });

    // Try to get file size if possible
    if (
      src &&
      !src.includes("placeholder") &&
      !src.includes("via.placeholder")
    ) {
      fetch(src, { method: "HEAD" })
        .then((response) => {
          const contentLength = response.headers.get("content-length");
          if (contentLength) {
            const sizeInBytes = Number.parseInt(contentLength);
            const sizeInKB = (sizeInBytes / 1024).toFixed(1);
            const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(1);
            const displaySize =
              sizeInBytes > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;

            setImageDimensions((prev) => ({
              ...prev,
              fileSize: displaySize,
            }));
          }
        })
        .catch(() => {
          // Silently fail if we can't get file size
        });
    }
  };

  const getCurrentImage = () => {
    if (imageList.length > 0 && imageList[currentImageIndex]) {
      return imageList[currentImageIndex];
    }
    return { src, alt };
  };

  const currentImage = getCurrentImage();

  return (
    <>
      {/* Thumbnail */}
      <div
        className={`relative cursor-pointer  bg-black/80  transition-all duration-200 hover:opacity-80 group border ${thumbnailClassName}`}
        onClick={() => setIsOpen(true)}
      >
        <img
          width={width}
          height={height}
          src={src}
          alt={alt}
          className={`rounded-lg object-cover ${className}  `}
        />

        {/* Image info overlay */}
        {/* <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex flex-col items-center justify-center z-0 ">
          <ZoomIn
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2"
            size={24}
          />
          <div className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 px-2 py-1 rounded">
            {width} × {height}
          </div>
        </div> */}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed bg-black/80  flex items-center justify-center p-4 w-h inset-0 z-50"
          onClick={handleBackdropClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Control buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
              onClick={handleZoomOut}
              disabled={scale <= minScale}
              aria-label="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
            <button
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
              onClick={handleZoomIn}
              disabled={scale >= maxScale}
              aria-label="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
            <button
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
              onClick={handleReset}
              aria-label="Reset zoom"
            >
              <RotateCcw size={20} />
            </button>
            <button
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
              aria-label="Close image"
            >
              <X size={20} />
            </button>
          </div>

          {/* Zoom indicator */}
          <div className="absolute top-4 left-4 z-10 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            {Math.round(scale * 100)}%
          </div>

          {/* Navigation buttons */}
          {imageList.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-30 hover:bg-opacity-60 p-2 rounded-full z-10"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-30 hover:bg-opacity-60 p-2 rounded-full z-10"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Image counter */}
          {imageList.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {imageList.length}
            </div>
          )}

          {/* Full size image */}
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              ref={imageRef}
              src={currentImage.src}
              alt={currentImage.alt}
              onLoad={handleImageLoad}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className=" object-contain cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
