import React from "react";
import { cn } from "@/lib/utils";

interface HeartbeatLoadingAnimationProps {
  size?: "small" | "medium" | "large";
  text?: string;
  className?: string;
}

const HeartbeatLoadingAnimation: React.FC<HeartbeatLoadingAnimationProps> = ({
  size = "medium",
  text = "Loading...",
  className,
}) => {
  const sizeClasses = {
    small: {
      container: "h-8",
      heartbeat: "h-3",
      dot: "w-1.5 h-1.5",
    },
    medium: {
      container: "h-12",
      heartbeat: "h-4",
      dot: "w-2 h-2",
    },
    large: {
      container: "h-16",
      heartbeat: "h-5",
      dot: "w-2.5 h-2.5",
    },
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className={cn("relative w-full", sizeClasses[size].container)}>
        {/* Heartbeat Line */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-full h-px bg-gray-200 absolute"></div>
          
          {/* Animated Heartbeat */}
          <div className="w-full flex items-center justify-center relative">
            <svg 
              viewBox="0 0 100 20" 
              className={cn("w-full", sizeClasses[size].heartbeat)}
            >
              <path 
                d="M0 10 L20 10 L25 0 L30 20 L35 10 L40 10 L45 5 L50 15 L55 10 L100 10" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
                style={{ animationDuration: "1.5s" }}
              />
            </svg>
            
            {/* Moving Dot */}
            <div 
              className={cn(
                "absolute bg-red-500 rounded-full animate-heartbeat-move", 
                sizeClasses[size].dot
              )}
              style={{ 
                animationDuration: "3s",
                animationIterationCount: "infinite",
                animationTimingFunction: "linear"
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

// Add the animation to the global CSS
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes heartbeat-move {
      0% { transform: translateX(-50px); }
      100% { transform: translateX(50px); }
    }
    .animate-heartbeat-move {
      animation-name: heartbeat-move;
    }
  `;
  document.head.appendChild(style);
}

export default HeartbeatLoadingAnimation;