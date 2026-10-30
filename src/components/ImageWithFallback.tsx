import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK_CAR_IMAGE = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Vehicle',
  className = '',
  fallbackTitle,
  fallbackSrc = DEFAULT_FALLBACK_CAR_IMAGE,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setAttemptedFallback(false);
  }, [src]);

  const handleError = () => {
    if (!attemptedFallback && fallbackSrc && currentSrc !== fallbackSrc) {
      setAttemptedFallback(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Car className="w-10 h-10 mb-1 stroke-1 opacity-70" />
        <span className="text-xs text-slate-500 font-medium text-center truncate max-w-full">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

