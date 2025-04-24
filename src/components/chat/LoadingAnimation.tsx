import React from "react";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  size?: "small" | "medium" | "large";
  text?: string;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = "medium",
  text = "Loading...",
  className,
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className="flex items-center justify-center space-x-2">
        <div
          className={cn(
            "animate-pulse rounded-full bg-blue-500",
            sizeClasses[size]
          )}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={cn(
            "animate-pulse rounded-full bg-blue-500",
            sizeClasses[size]
          )}
          style={{ animationDelay: "300ms" }}
        />
        <div
          className={cn(
            "animate-pulse rounded-full bg-blue-500",
            sizeClasses[size]
          )}
          style={{ animationDelay: "600ms" }}
        />
      </div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingAnimation;