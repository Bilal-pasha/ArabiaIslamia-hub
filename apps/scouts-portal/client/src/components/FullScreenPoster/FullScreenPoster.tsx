"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const FullScreenPoster = () => {
  const { user } = useAuth();
  const [showPoster, setShowPoster] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      src: "/assets/poster.webp",
      alt: "Scouts Camp Poster",
      title: "Scouts Camp 2025"
    },
    {
      src: "/assets/sindh-scouts-rules&guide-lines.webp",
      alt: "Sindh Scouts Rules & Guidelines",
      title: "Rules & Guidelines"
    }
  ];

  useEffect(() => {
    if (user) setShowPoster(true);
  }, [user]);

  const handleClose = () => {
    setShowPoster(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!showPoster) return null;

  return (
    <div className="fixed animate inset-0 z-50 flex bg-black bg-opacity-90 p-4">
      <div className="relative bg-white rounded-lg w-full max-w-5xl max-h-[95vh] shadow-2xl border border-green-200 mx-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b-2 border-green-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {images[currentSlide].title}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ImCross className="h-5 w-5" />
          </button>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden flex items-center justify-center">
          {/* Images */}
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0 flex justify-center items-center p-6">
                <Image
                  src={image.src}
                  alt={image.alt}
                  height={800}
                  width={800}
                  className="object-contain rounded-lg max-h-[80vh] w-auto mx-auto"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="flex justify-center space-x-2 p-4 bg-gray-50 rounded-b-lg">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                    ? "bg-green-600 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-16 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentSlide + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenPoster;
