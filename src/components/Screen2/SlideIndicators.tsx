interface SlideIndicatorsProps {
  totalSlides: number;
  currentSlide: number;
  onGoToSlide: (index: number) => void;
  slides: Array<{ title: string }>;
}

const SlideIndicators: React.FC<SlideIndicatorsProps> = ({
  totalSlides,
  currentSlide,
  onGoToSlide,
  slides,
}) => {
  return (
    <div className="flex justify-center gap-2 mt-8 flex-wrap">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onGoToSlide(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSlide === index 
              ? 'bg-red-500 w-8 shadow-lg shadow-red-500/70' 
              : 'bg-red-900/40 hover:bg-red-700/60 cursor-pointer'
          }`}
          title={`Slide ${index + 1}: ${slides[index]?.title ?? ''}`}
        />
      ))}
    </div>
  );
};

export default SlideIndicators;
