import { Star } from "lucide-react";

function StarPicker({ value = 0, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}>
          <Star
            size={24}
            className={star <= value ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
          />
        </button>
      ))}
    </div>
  );
}

export default StarPicker;