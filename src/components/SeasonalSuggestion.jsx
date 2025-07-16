import React from "react";

export default function SeasonalSuggestion() {
  const month = new Date().getMonth();
  let suggestion = "";

  if (month === 8) suggestion = "🎑 Bánh Trung Thu đặc biệt!";
  else if (month === 11) suggestion = "🎄 Bánh Giáng Sinh đang hot!";
  else if (month === 1) suggestion = "💝 Bánh Valentine ngọt ngào!";
  else suggestion = "🎂 Bánh sinh nhật cho mọi dịp!";

  return (
    <div className="p-4 bg-green-100 rounded shadow">
      📅 Gợi ý theo mùa: <strong>{suggestion}</strong>
    </div>
  );
}
