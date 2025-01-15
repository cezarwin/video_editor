import { useState } from "react";

interface PexelsImageSrc {
  original: string;
  large?: string;
  medium?: string;
  small?: string;
}

interface PexelsImage {
  id: number | string;
  alt?: string;
  src: PexelsImageSrc;
}

export function usePexelsImages() {
  const [images, setImages] = useState<PexelsImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchImages(query: string) {
    setIsLoading(true);
    try {
      // Example call to Pexels Image API
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=50&size=medium&orientation=landscape`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || "",
          },
        }
      );
      const data = await response.json();

      // Transform the data into your PexelsImage interface
      const fetchedImages = data.photos.map((photo: any) => ({
        id: photo.id,
        alt: photo.alt,
        src: {
          original: photo.src.original,
          large: photo.src.large,
          medium: photo.src.medium,
          small: photo.src.small,
        },
      }));

      setImages(fetchedImages);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    images,
    isLoading,
    fetchImages,
  };
}
