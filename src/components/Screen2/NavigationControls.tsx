interface NavigationControlsProps {
  onNext: () => void;
  onPrev: () => void;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onNext,
  onPrev,
  isAutoPlay,
  onToggleAutoPlay,
}) => {
  return (
    <div className="flex items-center justify-between px-4">
      {/* Previous button */}
      <button 
        onClick={onPrev}
        className="group px-6 py-3 bg-gradient-to-r from-red-900/60 to-red-950/60 hover:from-red-700 hover:to-red-900
        border border-red-600/50 hover:border-red-400 rounded-lg transition-all duration-300 
        transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <span className="text-xl font-bold text-red-300 group-hover:text-red-100">← BACK</span>
      </button>

      {/* Autoplay toggle */}
      <button 
        onClick={onToggleAutoPlay}
        className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/50 
        rounded-lg text-sm font-mono text-gray-300 hover:text-gray-100 transition-all cursor-pointer"
      >
        {isAutoPlay ? '⏸ PAUSE' : '▶ PLAY'}
      </button>

      {/* Next button */}
      <button 
        onClick={onNext}
        className="group px-6 py-3 bg-gradient-to-r from-red-900/60 to-red-950/60 hover:from-red-700 hover:to-red-900
        border border-red-600/50 hover:border-red-400 rounded-lg transition-all duration-300 
        transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <span className="text-xl font-bold text-red-300 group-hover:text-red-100">NEXT →</span>
      </button>
    </div>
  );
};

export default NavigationControls;
