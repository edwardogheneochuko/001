interface SlideCardProps {
  title: string;
  description: string;
  slideNumber: number;
  totalSlides: number;
}

const SlideCard: React.FC<SlideCardProps> = ({ title, description, slideNumber, totalSlides }) => {
  return (
    <div className="relative mb-12 perspective">
      <div 
        className="relative border-3 border-red-900/60 bg-gradient-to-br from-gray-900/90 to-black/95 
        p-12 rounded-xl backdrop-blur-md shadow-2xl transform transition-all duration-500
        hover:shadow-[0_0_60px_rgba(239,68,68,0.5)] hover:border-red-500 hover:scale-105"
        style={{ textShadow: '0 0 20px rgba(0,0,0,0.9)' }}
      >
        {/* Slide number badge */}
        <div 
          className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 
          rounded-full flex items-center justify-center font-black text-white drop-shadow-xl text-sm"
        >
          {slideNumber}/{totalSlides}
        </div>

        {/* Creepy corner accents */}
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-red-500 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-red-500 rounded-bl-lg" />
        
        {/* Inner animated glow */}
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-600/10 to-transparent 
          opacity-50 animate-pulse pointer-events-none" 
        />

        {/* Slide content */}
        <div className="relative z-10">
          <h1 
            className="text-6xl sm:text-7xl font-black mb-6 tracking-widest text-red-400 drop-shadow-2xl 
            animate-bounce"
            style={{ textShadow: '0 0 30px rgba(239, 68, 68, 0.8)' }}
          >
            {title.toUpperCase()}
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed drop-shadow-lg italic font-light line-clamp-4">
            "{description}"
          </p>

          {/* Divider */}
          <div className="mt-8 h-px bg-gradient-to-r from-red-900 via-red-600 to-red-900 opacity-70" />
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
