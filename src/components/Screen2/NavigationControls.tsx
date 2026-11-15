import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface NavigationControlsProps {
  onNext: () => void;
  onPrev: () => void;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
}

const arrowButton =
  'group flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg border border-red-700/60 bg-red-950/50 text-red-200 ' +
  'hover:bg-red-900/70 hover:border-red-400 hover:text-white active:scale-95 transition cursor-pointer';

const NavigationControls = ({ onNext, onPrev, isAutoPlay, onToggleAutoPlay }: NavigationControlsProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <button type="button" onClick={onPrev} aria-label="Previous slide" className={arrowButton}>
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden sm:inline font-bold tracking-widest text-sm">BACK</span>
      </button>

      <button
        type="button"
        onClick={onToggleAutoPlay}
        aria-label={isAutoPlay ? 'Pause slideshow' : 'Play slideshow'}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-600/60 bg-gray-900/60
        text-xs sm:text-sm font-mono tracking-widest text-gray-300 hover:text-white hover:bg-gray-800/80 transition cursor-pointer"
      >
        {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isAutoPlay ? 'PAUSE' : 'PLAY'}
      </button>

      <button type="button" onClick={onNext} aria-label="Next slide" className={arrowButton}>
        <span className="hidden sm:inline font-bold tracking-widest text-sm">NEXT</span>
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};

export default NavigationControls;
