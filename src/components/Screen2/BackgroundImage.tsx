interface BackgroundImageProps {
  src: string;
  alt: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ src, alt }) => {
  return (
    <div className="absolute right-0 top-0 w-full sm:w-1/3 h-full">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover opacity-20 hover:opacity-40 transition-opacity duration-500 
        brightness-50 contrast-125 filter saturate-150 hue-rotate-6"
      />
      {/* Image shadow vignette */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent" />
    </div>
  );
};

export default BackgroundImage;
