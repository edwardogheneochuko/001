interface BackgroundImageProps {
  src: string;
  alt: string;
}

const BackgroundImage = ({ src, alt }: BackgroundImageProps) => {
  return (
    <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 overflow-hidden pointer-events-none">
      {/* Slow drift instead of hover effects; transform-only so it stays smooth */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover opacity-25 lg:opacity-35 brightness-50 contrast-125 saturate-150 animate-drift will-change-transform"
      />
      <div className="absolute inset-0 bg-linear-to-l from-transparent via-black/40 to-black" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/60" />
    </div>
  );
};

export default BackgroundImage;
