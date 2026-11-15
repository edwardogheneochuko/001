interface SlideCardProps {
  title: string;
  description: string;
  slideNumber: number;
  totalSlides: number;
}

const SlideCard = ({ title, description, slideNumber, totalSlides }: SlideCardProps) => {
  return (
    <div className="relative h-full pb-6 select-none">
      <div
        className="relative h-full flex flex-col justify-center border border-red-900/70 bg-linear-to-br from-gray-900/90 to-black/95
        px-6 py-10 sm:p-12 rounded-xl shadow-2xl transition-[border-color,box-shadow] duration-500
        hover:border-red-600/80 hover:shadow-[0_0_50px_rgba(239,68,68,0.25)]"
      >
        <div
          className="absolute -top-4 -left-3 sm:-left-4 min-w-12 h-10 px-3 bg-linear-to-br from-red-600 to-red-900
          rounded-full flex items-center justify-center font-bold text-white text-xs tracking-wider shadow-lg"
        >
          {slideNumber}/{totalSlides}
        </div>

        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-red-500/80 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-red-500/80 rounded-bl-lg" />

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-5 tracking-wider text-red-400 text-glow break-words">
          {title.toUpperCase()}
        </h2>

        <p className="text-lg sm:text-2xl text-gray-200 leading-relaxed italic font-light">
          “{description}”
        </p>

        <div className="mt-8 h-px bg-linear-to-r from-red-900 via-red-600 to-red-900 opacity-70" />
      </div>
    </div>
  );
};

export default SlideCard;
