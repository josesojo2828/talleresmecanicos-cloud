import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

export const StarRating = ({ 
  rating, 
  max = 5, 
  size = 18, 
  className, 
  onRatingChange,
  interactive = false 
}: StarRatingProps) => {
  return (
    <div className={cn("flex gap-1", className)}>
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= rating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starValue)}
            className={cn(
              "transition-all duration-300",
              interactive ? "hover:scale-125 active:scale-95 cursor-pointer" : "cursor-default",
              isActive ? "text-amber-500" : "text-slate-200"
            )}
          >
            <Star 
              size={size} 
              fill={isActive ? "currentColor" : "none"} 
              strokeWidth={isActive ? 0 : 2}
            />
          </button>
        );
      })}
    </div>
  );
};
