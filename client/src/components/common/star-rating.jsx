import { Star } from "lucide-react";

function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
        />
      ))}
    </div>
  );
}

export default StarRating;
