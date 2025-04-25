import React from "react";
import { cn } from "@/lib/utils";

interface BoatLoadingAnimationProps {
  size?: "small" | "medium" | "large";
  text?: string;
  className?: string;
}

const BoatLoadingAnimation: React.FC<BoatLoadingAnimationProps> = ({
  size = "medium",
  text = "Loading...",
  className,
}) => {
  const sizeClasses = {
    small: {
      container: "h-8",
      boat: "w-8 h-4",
      wave: "h-3",
    },
    medium: {
      container: "h-12",
      boat: "w-12 h-6",
      wave: "h-4",
    },
    large: {
      container: "h-16",
      boat: "w-16 h-8",
      wave: "h-5",
    },
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size].container)}>
        {/* Boat */}
        <div 
          className={cn(
            "absolute z-10 transition-transform animate-bounce", 
            sizeClasses[size].boat
          )}
          style={{ 
            animationDuration: "2s",
            left: "calc(50% - 1.5rem)",
            top: "0"
          }}
        >
          <svg 
            viewBox="0 0 24 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Boat body */}
            <path 
              d="M2 8C2 8 4 4 12 4C20 4 22 8 22 8L20 10H4L2 8Z" 
              fill="#3B82F6" 
              stroke="#1D4ED8" 
              strokeWidth="1"
            />
            {/* Boat sail */}
            <path 
              d="M12 4L12 0L18 4H12Z" 
              fill="#93C5FD" 
              stroke="#1D4ED8" 
              strokeWidth="1"
            />
          </svg>
        </div>
        
        {/* Waves */}
        <div 
          className={cn(
            "absolute bottom-0 w-full overflow-hidden",
            sizeClasses[size].wave
          )}
        >
          <div className="relative h-full w-[200%] animate-wave">
            <svg 
              viewBox="0 0 100 20" 
              className="absolute h-full w-[50%] fill-blue-300"
            >
              <path d="M0 20C20 12 30 20 50 20C70 20 80 12 100 20V30H0V20Z" />
            </svg>
            <svg 
              viewBox="0 0 100 20" 
              className="absolute h-full w-[50%] fill-blue-300 left-[50%]"
            >
              <path d="M0 20C20 12 30 20 50 20C70 20 80 12 100 20V30H0V20Z" />
            </svg>
          </div>
        </div>
      </div>
      
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default BoatLoadingAnimation;