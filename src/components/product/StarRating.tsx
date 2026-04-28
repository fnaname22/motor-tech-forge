import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const StarRating = ({
  rating,
  size = "sm",
  showNumber = false,
}: {
  rating: number;
  size?: "xs" | "sm" | "md";
  showNumber?: boolean;
}) => {
  const sz = size === "xs" ? "h-3 w-3" : size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(sz, i < rounded ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40")}
          />
        ))}
      </div>
      {showNumber && <span className="text-xs font-semibold ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
};
