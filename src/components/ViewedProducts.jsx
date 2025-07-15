import React, { useEffect, useState } from "react";

// Giả lập sản phẩm
const sampleProducts = ["Bánh kem dâu", "Bánh mousse trà xanh", "Bánh tiramisu"];

export default function ViewedProducts() {
  const [viewed, setViewed] = useState(
    JSON.parse(localStorage.getItem("viewedProducts")) || []
  );

  // Khi người dùng bấm vào một sản phẩm
  const handleView = (product) => {
    let newViewed = [...viewed];
    if (!newViewed.includes(product)) {
      newViewed.push(product);
      setViewed(newViewed);
      localStorage.setItem("viewedProducts", JSON.stringify(newViewed));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">🧁 Sản phẩm bạn đã xem</h2>
      {viewed.length > 0 ? (
        <ul className="pl-5 list-disc">
          {viewed.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>Bạn chưa xem sản phẩm nào.</p>
      )}

      <div className="space-y-2">
        <h3 className="font-medium">📌 Click để xem sản phẩm:</h3>
        {sampleProducts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleView(p)}
            className="px-3 py-1 mb-2 mr-2 bg-pink-300 rounded hover:bg-pink-400"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
