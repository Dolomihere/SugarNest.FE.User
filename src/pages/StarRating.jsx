import { useState } from "react";

function StarRating({ rating, interactive = false, onChange = () => {} }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && onChange(i)}
          className={`text-2xl ${
            interactive ? "hover:text-amber-600" : ""
          } text-amber-600 transition-colors duration-200`}
          aria-label={`${i} star`}
        >
          ★
        </button>
      );
    } else if (hasHalfStar && i === fullStars + 1) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && onChange(i)}
          className={`text-2xl ${
            interactive ? "hover:text-amber-600" : ""
          } text-amber-600 relative transition-colors duration-200`}
          aria-label={`${i - 0.5} star`}
        >
          <span className="absolute left-0 w-1/2 overflow-hidden">★</span>
          <span className="text-gray-300">★</span>
        </button>
      );
    } else {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && onChange(i)}
          className={`text-2xl ${
            interactive ? "hover:text-amber-600" : ""
          } text-gray-300 transition-colors duration-200`}
          aria-label={`${i} star`}
        >
          ★
        </button>
      );
    }
  }

  return <div className="flex gap-1">{stars}</div>;
}

export { StarRating };