interface SlideIndicatorsProps {
  totalSlides: number;
  currentSlide: number;
  onGoToSlide: (index: number) => void;
  slides: Array<{ title: string }>;
}

const SlideIndicators = ({ totalSlides, currentSlide, onGoToSlide, slides }: SlideIndicatorsProps) => {
  return (
    <div className="flex justify-center gap-1 mt-8 flex-wrap">
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = currentSlide === index;
        return (
          // Padding gives a comfortable tap target around the small dot
          <button
            type="button"
            key={index}
            onClick={() => onGoToSlide(index)}
            aria-label={`Slide ${index + 1}: ${slides[index]?.title ?? ''}`}
            aria-current={isActive ? 'true' : undefined}
            className="p-1.5 cursor-pointer group"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                isActive ? 'w-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]' : 'w-2 bg-red-900/60 group-hover:bg-red-700'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default SlideIndicators;
