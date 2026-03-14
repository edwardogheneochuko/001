import { useState, useEffect } from 'react';
import { scaryContent } from '../assets/data'
import clown from '../assets/clown.jpg';
import SlideCard from '../components/Screen2/SlideCard';
import NavigationControls from '../components/Screen2/NavigationControls';
import SlideIndicators from '../components/Screen2/SlideIndicators';
import BackgroundImage from '../components/Screen2/BackgroundImage';

const Page2 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % scaryContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % scaryContent.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + scaryContent.length) % scaryContent.length);
    setIsAutoPlay(false);
  };

  const currentItem = scaryContent[currentSlide];

  return (
    <div id='whispers' className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-red-950">

      <div className="absolute inset-0 bg-gradient-radial from-red-900/10 via-transparent to-black pointer-events-none" />
      

      <BackgroundImage src={clown} alt="Scary Clown" />


      <div className="absolute left-0 top-0 w-full sm:w-2/3 h-full flex flex-col justify-center px-8 sm:px-16 text-white">
        
        {/* Slide Card */}
        <SlideCard 
          title={currentItem.title}
          description={currentItem.description}
          slideNumber={currentSlide + 1}
          totalSlides={scaryContent.length}
        />

        {/* Navigation Controls */}
        <NavigationControls 
          onNext={nextSlide}
          onPrev={prevSlide}
          isAutoPlay={isAutoPlay}
          onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
        />

        {/* Slide Indicators */}
        <SlideIndicators 
          totalSlides={scaryContent.length}
          currentSlide={currentSlide}
          onGoToSlide={goToSlide}
          slides={scaryContent}
        />

        {/* Bottom warning text */}
        <div className="absolute bottom-8 left-8 sm:left-16 text-xs sm:text-sm text-red-600/80 
        font-mono tracking-[2px] animate-pulse">
          ⚠ SOMETHING WATCHES FROM THE DARK ⚠
        </div>
      </div>
    </div>
  );
};

export default Page2;
