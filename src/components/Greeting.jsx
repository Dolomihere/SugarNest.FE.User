import React from "react";

export default function Greeting() {
  const name = localStorage.getItem("userName");
  const cake = localStorage.getItem("favoriteCake");

  if (!name || !cake) return null;

  return (
    <div className="p-4 bg-yellow-100 rounded shadow">
      🎉 Xin chào <strong>{name}</strong>! Bạn có muốn thử loại{" "}
      <strong>{cake}</strong> phiên bản mới hôm nay không?
    </div>
  );
}
