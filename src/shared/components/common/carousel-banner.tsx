import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CAROUSEL_SLIDES = [
  { id: 1, imageUrl: '', alt: '배너 1', bgColor: 'bg-gray-200' },
  { id: 2, imageUrl: '', alt: '배너 2', bgColor: 'bg-gray-300' },
  { id: 3, imageUrl: '', alt: '배너 3', bgColor: 'bg-blue-200' },
  { id: 4, imageUrl: '', alt: '배너 4', bgColor: 'bg-green-200' },
  { id: 5, imageUrl: '', alt: '배너 5', bgColor: 'bg-yellow-100' },
];

const AUTO_SLIDE_INTERVAL = 5000;

export const CarouselBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = CAROUSEL_SLIDES.length;

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(goToNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 슬라이드 트랙 */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {CAROUSEL_SLIDES.map((slide) => (
          <div
            key={slide.id}
            className={`relative h-full min-w-full ${slide.bgColor} flex items-center justify-center`}
          >
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">{slide.alt}</span>
            )}
          </div>
        ))}
      </div>

      {/* 이전 버튼 */}
      <button
        onClick={goToPrev}
        aria-label="이전 슬라이드"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 transition-all duration-200 hover:bg-black/40"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={goToNext}
        aria-label="다음 슬라이드"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 transition-all duration-200 hover:bg-black/40"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {CAROUSEL_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
            className={`rounded-full bg-white transition-all duration-300 ${
              index === currentIndex
                ? 'h-3 w-3 opacity-100'
                : 'h-2 w-2 opacity-50 hover:opacity-80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
