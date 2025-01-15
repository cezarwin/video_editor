import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEditorContext } from "../contexts/editor-context";
import { useTimelinePositioning } from "../hooks/use-timeline-positioning";
import { usePexelsImages } from "../hooks/use-pexels-image"; // <-- Create this hook
import { useAspectRatio } from "../hooks/use-aspect-ratio";
import { ImageOverlay } from "../types";

/**
 * This interface can match whatever data structure
 * your `usePexelsImages` hook returns for each image.
 */
interface PexelsImageSrc {
  original: string;
  large?: string;
  medium?: string;
  small?: string;
  // Add other potential image sizes as needed
}

interface PexelsImage {
  id: number | string;
  alt?: string;
  src: PexelsImageSrc;
  // Add other potential properties as needed (e.g., photographer, width, height, etc.)
}

export const ImagesPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Replace with your custom hook for images
  const { images, isLoading, fetchImages } = usePexelsImages();
  
  const { addOverlay, overlays, durationInFrames } = useEditorContext();
  const { findNextAvailablePosition } = useTimelinePositioning();
  const { getAspectRatioDimensions } = useAspectRatio();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchImages(searchQuery);
    }
  };

  /**
   * Example: how to add an image as an overlay
   */
  const handleAddImage = (image: PexelsImage) => {
    const MAX_ROWS = 4;
    const { width, height } = getAspectRatioDimensions();
    const { from, row } = findNextAvailablePosition(
      overlays,
      MAX_ROWS,
      durationInFrames
    );

    // Choose which size you want to display. Fallback to `original` if unsure.
    const imageUrl =
      image.src.large ||
      image.src.medium ||
      image.src.small ||
      image.src.original;

    const newOverlay: ImageOverlay = {
      left: 0,
      top: 0,
      width,
      height,
      durationInFrames: 90,
      from,
      id: Date.now(),
      rotation: 0,
      row,
      isDragging: false,
      // Set type to "image" (or whatever naming convention you wish)
      type: "image",
      content: image.alt || `Image ${image.id}`,
      src: imageUrl,
      // For images, you typically don’t have a "videoStartTime"
      //videoStartTime: 0, // or you can omit it if not needed
      styles: {
        opacity: 1,
        zIndex: 0,
        transform: "none",
        objectFit: "cover",
      },
    };

    addOverlay(newOverlay);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800/40 h-full">
      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search images..."
          value={searchQuery}
          className="bg-gray-800 border-white/5 text-zinc-200 placeholder:text-gray-400 focus-visible:ring-blue-400"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="bg-gray-800 hover:bg-gray-700 text-zinc-200 border-white/5"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Image display grid */}
      <div className="grid grid-cols-2 gap-3">
        {isLoading
          ? Array.from({ length: 16 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="relative aspect-video bg-gray-800 animate-pulse rounded-sm"
              />
            ))
          : images.map((image) => (
              <button
                key={image.id}
                className="relative aspect-video cursor-pointer border border-transparent hover:border-white rounded-md"
                onClick={() => handleAddImage(image)}
              >
                <div className="relative w-full h-full">
                  <img
                    src={image.src.original}
                    alt={image.alt || `Image ${image.id}`}
                    className="rounded-sm object-cover w-full h-full hover:opacity-60 transition-opacity duration-200"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200" />
                </div>
              </button>
            ))}
      </div>
    </div>
  );
};
