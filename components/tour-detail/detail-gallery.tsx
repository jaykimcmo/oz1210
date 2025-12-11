/**
 * @file detail-gallery.tsx
 * @description 관광지 이미지 갤러리 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 이미지 목록을 갤러리 형태로 표시합니다.
 *
 * 주요 기능:
 * 1. 이미지 슬라이드 (embla-carousel-react 사용)
 * 2. 전체화면 모달 (이미지 클릭 시)
 * 3. 좌우 네비게이션
 * 4. 키보드 네비게이션 (ArrowLeft, ArrowRight, Escape)
 * 5. 썸네일 네비게이션 (선택 사항)
 *
 * 핵심 구현 로직:
 * - Server Component로 데이터 받기 (page.tsx에서 전달)
 * - 클라이언트 컴포넌트로 슬라이드 및 모달 구현
 * - 이미지가 없으면 섹션 숨김
 *
 * @dependencies
 * - embla-carousel-react: 이미지 슬라이드
 * - next/image: 이미지 최적화
 * - components/ui/dialog.tsx: 모달 컴포넌트
 * - lib/types/tour.ts: TourImage 타입
 * - lucide-react: 아이콘들
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { TourImage } from '@/lib/types/tour';

interface DetailGalleryProps {
  images: TourImage[];
  title: string;
}

/**
 * 관광지 이미지 갤러리 섹션 컴포넌트
 *
 * @param images - 이미지 목록
 * @param title - 관광지명 (alt 텍스트용)
 */
export function DetailGallery({ images, title }: DetailGalleryProps) {
  // 이미지가 없으면 섹션 숨김
  if (!images || images.length === 0) {
    return null;
  }

  // 이미지가 1개인 경우와 여러 개인 경우를 구분
  const hasMultipleImages = images.length > 1;

  return (
    <section aria-label="이미지 갤러리" className="space-y-6 pt-6 border-t">
      <h2 className="text-2xl font-semibold mb-4">이미지 갤러리</h2>
      {hasMultipleImages ? (
        <ImageCarousel images={images} title={title} />
      ) : (
        <SingleImage image={images[0]} title={title} />
      )}
    </section>
  );
}

/**
 * 이미지 캐러셀 컴포넌트 (여러 이미지)
 */
function ImageCarousel({ images, title }: DetailGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const handleImageClick = useCallback((index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  }, []);

  const handleModalPrev = useCallback(() => {
    setModalIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : images.length - 1;
      scrollTo(newIndex);
      return newIndex;
    });
  }, [images.length, scrollTo]);

  const handleModalNext = useCallback(() => {
    setModalIndex((prev) => {
      const newIndex = prev < images.length - 1 ? prev + 1 : 0;
      scrollTo(newIndex);
      return newIndex;
    });
  }, [images.length, scrollTo]);

  // 키보드 네비게이션
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleModalPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleModalNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, modalIndex, images.length, handleModalPrev, handleModalNext]);

  // 모달 인덱스와 캐러셀 동기화
  useEffect(() => {
    if (isModalOpen) {
      scrollTo(modalIndex);
    }
  }, [modalIndex, isModalOpen, scrollTo]);

  return (
    <>
      <div className="relative">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={image.serialnum || index}
                className="flex-[0_0_100%] min-w-0 relative aspect-video cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={image.originimgurl}
                  alt={image.imgname || `${title} 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  priority={index === 0}
                  quality={85}
                  onError={(e) => {
                    // 이미지 로드 실패 시 fallback 처리
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm min-h-[44px] min-w-[44px]"
              onClick={scrollPrev}
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm min-h-[44px] min-w-[44px]"
              onClick={scrollNext}
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </>
        )}

        {/* 이미지 인덱스 표시 */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 썸네일 네비게이션 */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.serialnum || index}
              onClick={() => scrollTo(index)}
              className={`flex-shrink-0 relative w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`이미지 ${index + 1}로 이동`}
            >
              <Image
                src={image.smallimageurl || image.originimgurl}
                alt={image.imgname || `${title} 썸네일 ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                quality={75}
              />
            </button>
          ))}
        </div>
      )}

      {/* 전체화면 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-full h-full max-h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
              onClick={() => setIsModalOpen(false)}
              aria-label="닫기"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* 이전 버튼 */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-20 text-white hover:bg-white/20 min-h-[44px] min-w-[44px]"
                onClick={handleModalPrev}
                aria-label="이전 이미지"
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
            )}

            {/* 이미지 */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={images[modalIndex]?.originimgurl || ''}
                alt={images[modalIndex]?.imgname || `${title} 이미지 ${modalIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                quality={90}
                priority
              />
            </div>

            {/* 다음 버튼 */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-20 text-white hover:bg-white/20 min-h-[44px] min-w-[44px]"
                onClick={handleModalNext}
                aria-label="다음 이미지"
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
            )}

            {/* 이미지 인덱스 표시 */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded z-20">
                {modalIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * 단일 이미지 컴포넌트 (이미지가 1개인 경우)
 */
function SingleImage({ image, title }: { image: TourImage; title: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={image.originimgurl}
          alt={image.imgname || `${title} 이미지`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
          priority
          quality={85}
        />
      </div>

      {/* 전체화면 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-full h-full max-h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
              onClick={() => setIsModalOpen(false)}
              aria-label="닫기"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={image.originimgurl}
                alt={image.imgname || `${title} 이미지`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                quality={90}
                priority
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

