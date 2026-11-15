import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { scaryContent } from '../assets/data';
import clown from '../assets/clown.jpg';
import SlideCard from '../components/Screen2/SlideCard';
import NavigationControls from '../components/Screen2/NavigationControls';
import SlideIndicators from '../components/Screen2/SlideIndicators';
import BackgroundImage from '../components/Screen2/BackgroundImage';
import { EASE_OUT } from '@/lib/motion';

const SLIDE_MS = 6000;
const SWIPE_DISTANCE = 60;

const Page2 = () => {
  const [[currentSlide, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const total = scaryContent.length;
  const running = isAutoPlay && !isHovered;

  const paginate = (dir: number) =>
    setSlide(([current]) => [(current + dir + total) % total, dir]);

  // One timer per slide: restarts cleanly whenever the slide or pause state changes
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => paginate(1), SLIDE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, currentSlide]);

  const goToSlide = (index: number) => {
    setSlide(([current]) => [index, index > current ? 1 : -1]);
    setIsAutoPlay(false);
  };

  const manual = (dir: number) => {
    paginate(dir);
    setIsAutoPlay(false);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE) manual(1);
    else if (info.offset.x > SWIPE_DISTANCE) manual(-1);
  };

  const currentItem = scaryContent[currentSlide];

  return (
    <section
      id="whispers"
      className="relative min-h-dvh w-full overflow-hidden bg-linear-to-br from-black via-gray-950 to-red-950"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') manual(1);
        if (e.key === 'ArrowLeft') manual(-1);
      }}
    >
      <div className="absolute inset-0 bg-radial from-red-900/10 via-transparent to-black pointer-events-none" />

      <BackgroundImage src={clown} alt="" />

      <div className="relative flex min-h-dvh w-full flex-col justify-center px-5 py-24 sm:px-12 lg:w-2/3 lg:px-16 text-white">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {/* Invisible copies of every slide reserve the tallest height, so nothing below jumps */}
          <div className="grid">
            {scaryContent.map((item, i) => (
              <div key={i} aria-hidden="true" className="invisible [grid-area:1/1]">
                <SlideCard title={item.title} description={item.description} slideNumber={i + 1} totalSlides={total} />
              </div>
            ))}
            <div className="[grid-area:1/1] h-full">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={{
                enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 40 : -40 }),
                center: { opacity: 1, x: 0 },
                exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -40 : 40 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="h-full"
            >
              <SlideCard
                title={currentItem.title}
                description={currentItem.description}
                slideNumber={currentSlide + 1}
                totalSlides={total}
              />
            </motion.div>
          </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Autoplay progress */}
        <div className="mb-8 h-0.5 w-full overflow-hidden rounded-full bg-red-950/80" aria-hidden="true">
          {running && (
            <motion.div
              key={currentSlide}
              className="h-full origin-left bg-red-500/80"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
            />
          )}
        </div>

        <NavigationControls
          onNext={() => manual(1)}
          onPrev={() => manual(-1)}
          isAutoPlay={isAutoPlay}
          onToggleAutoPlay={() => setIsAutoPlay((v) => !v)}
        />

        <SlideIndicators
          totalSlides={total}
          currentSlide={currentSlide}
          onGoToSlide={goToSlide}
          slides={scaryContent}
        />

        <p className="mt-10 font-mono text-xs sm:text-sm tracking-[0.2em] text-red-500/80">
          <span className="animate-breathe inline-block">⚠ SOMETHING WATCHES FROM THE DARK ⚠</span>
        </p>
      </div>
    </section>
  );
};

export default Page2;
