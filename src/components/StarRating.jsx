
export default function StarRating (averageRating) {
  const fullStars = Math.floor(averageRating);
  const partialStarPercentage = averageRating - fullStars;

  const renderStar = (index) => {
    const isFilled = index < fullStars;
    const isPartial = index === fullStars && partialStarPercentage > 0;
    const isEmpty = index >= averageRating; // Simplified for clarity, could be (index >= Math.ceil(averageRating)) if you want to show fully empty stars beyond the partial

    const starId = `star-${index}`; // Unique ID for clipPath

    return (
      <div key={index} className="relative inline-block">
        {/* Base (Empty) Star */}
        <svg
          className="w-4 h-4 text-gray-300" // Example: light gray for empty stars
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
          />
        </svg>

        {(isFilled || isPartial) && (
          <svg
            className="w-4 h-4 text-yellow-300 absolute top-0 left-0" // Yellow for filled stars
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            // Apply clipPath for partial star
            style={isPartial ? { clipPath: `url(#${starId}-clip)` } : {}}
          >
            {isPartial && (
              <defs>
                <clipPath id={`${starId}-clip`}>
                  <rect x="0" y="0" width={`${partialStarPercentage * 100}%`} height="100%" />
                </clipPath>
              </defs>
            )}
            <path
              d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
            />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => renderStar(i))}
    </div>
  );
}
