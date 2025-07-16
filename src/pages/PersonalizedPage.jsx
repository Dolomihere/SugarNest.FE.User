import { useState, useEffect } from "react";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { ProductCard } from "../components/ProductCard";

export default function PersonalizedPage() {
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [favoriteCake, setFavoriteCake] = useState(localStorage.getItem("favoriteCake") || "");
  const [viewedProducts, setViewedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("viewedProducts");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing viewedProducts:", error);
      return [];
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favoriteProducts");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing favoriteProducts:", error);
      return [];
    }
  });

  // Save user preferences
  useEffect(() => {
    try {
      localStorage.setItem("userName", name);
      localStorage.setItem("favoriteCake", favoriteCake);
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  }, [name, favoriteCake]);

  // Save viewed products
  useEffect(() => {
    try {
      localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
    } catch (error) {
      console.error("Error saving viewedProducts:", error);
    }
  }, [viewedProducts]);

  // Sync favorites across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("favoriteProducts");
        setFavorites(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error("Error parsing favoriteProducts on storage change:", error);
        setFavorites([]);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Determine season based on month
  const getSeasonFromMonth = (month) => {
    if (month === 8) return "Bánh Trung Thu";
    if (month === 11) return "Bánh Noel";
    if (month === 1) return "Bánh Valentine";
    return "Bánh sinh nhật";
  };

  // Current season based on today's date (July 15, 2025)
  const currentSeason = getSeasonFromMonth(new Date().getMonth());

  // Simulated database
  const productDatabase = [
    {
      productId: "p1",
      name: "Bánh Trung Thu Đậu Xanh",
      category: "Bánh Trung Thu",
      unitPrice: 50000,
      imgs: ["/assets/products/mooncake-greenbean.jpg"],
      author: { name: "Bakery A", img: "/assets/authors/bakery-a.jpg" },
      rating: 4,
      reviews: 20,
      createdAt: "2024-09-01",
    },
    {
      productId: "p2",
      name: "Bánh Noel Socola",
      category: "Bánh Noel",
      unitPrice: 120000,
      imgs: ["/assets/products/christmas-chocolate.jpg"],
      author: { name: "Bakery B", img: "/assets/authors/bakery-b.jpg" },
      rating: 5,
      reviews: 30,
      createdAt: "2024-12-01",
    },
    {
      productId: "p3",
      name: "Bánh Valentine Trái Tim",
      category: "Bánh Valentine",
      unitPrice: 100000,
      imgs: ["/assets/products/valentine-heart.jpg"],
      author: { name: "Bakery C", img: "/assets/authors/bakery-c.jpg" },
      rating: 4,
      reviews: 25,
      createdAt: "2025-02-01",
    },
    {
      productId: "p4",
      name: "Bánh Sinh Nhật Kem Dâu",
      category: "Bánh sinh nhật",
      unitPrice: 80000,
      imgs: ["/assets/products/birthday-strawberry.jpg"],
      author: { name: "Bakery D", img: "/assets/authors/bakery-d.jpg" },
      rating: 4,
      reviews: 15,
      createdAt: "2025-01-01",
    },
    {
      productId: "p5",
      name: "Bánh Mousse Trà Xanh",
      category: "Bánh sinh nhật",
      unitPrice: 90000,
      imgs: ["/assets/products/matcha-mousse.jpg"],
      author: { name: "Bakery E", img: "/assets/authors/bakery-e.jpg" },
      rating: 3,
      reviews: 10,
      createdAt: "2025-03-01",
    },
    {
      productId: "p6",
      name: "Bánh Tiramisu",
      category: "Bánh sinh nhật",
      unitPrice: 95000,
      imgs: ["/assets/products/tiramisu.jpg"],
      author: { name: "Bakery F", img: "/assets/authors/bakery-f.jpg" },
      rating: 4,
      reviews: 12,
      createdAt: "2025-04-01",
    },
    {
      productId: "p7",
      name: "Bánh Kem Socola",
      category: "Bánh sinh nhật",
      unitPrice: 85000,
      imgs: ["/assets/products/chocolate-cake.jpg"],
      author: { name: "Bakery G", img: "/assets/authors/bakery-g.jpg" },
      rating: 4,
      reviews: 18,
      createdAt: "2025-05-01",
    },
    {
      productId: "p8",
      name: "Bánh Trung Thu Socola",
      category: "Bánh Trung Thu",
      unitPrice: 55000,
      imgs: ["/assets/products/mooncake-chocolate.jpg"],
      author: { name: "Bakery A", img: "/assets/authors/bakery-a.jpg" },
      rating: 4,
      reviews: 22,
      createdAt: "2024-09-01",
    },
    {
      productId: "p9",
      name: "Bánh Mousse Socola",
      category: "Bánh sinh nhật",
      unitPrice: 92000,
      imgs: ["/assets/products/chocolate-mousse.jpg"],
      author: { name: "Bakery E", img: "/assets/authors/bakery-e.jpg" },
      rating: 3,
      reviews: 15,
      createdAt: "2025-03-01",
    },
  ];

  // Find products similar to favoriteCake
  const getSimilarProducts = () => {
    if (!favoriteCake.trim()) return [];
    const lowerFavoriteCake = favoriteCake.toLowerCase().trim();
    const favoriteWords = lowerFavoriteCake.split(" ");

    return productDatabase
      .map((product) => {
        const productNameWords = product.name.toLowerCase().split(" ");
        let score = 0;

        // Score based on word matches
        favoriteWords.forEach((word) => {
          if (productNameWords.includes(word)) {
            score += 10;
          }
        });

        // Boost score if favoriteCake is a substring of product name
        if (product.name.toLowerCase().includes(lowerFavoriteCake)) {
          score += 20;
        }

        return { ...product, score };
      })
      .filter((product) => product.score > 0) // Only include products with matches
      .sort((a, b) => b.score - a.score) // Sort by score
      .slice(0, 4); // Limit to 4 products
  };

  // AI-driven seasonal recommendation logic
  const getRecommendedProducts = () => {
    const lowerFavoriteCake = favoriteCake.toLowerCase().trim();

    // Assign season to each product based on createdAt
    const productsWithSeason = productDatabase.map((product) => {
      const createdDate = new Date(product.createdAt);
      const month = createdDate.getMonth();
      const season = getSeasonFromMonth(month);
      return { ...product, season };
    });

    // Score products
    const scoredProducts = productsWithSeason.map((product) => {
      let score = 0;

      // Season match: 50 points if matches current season
      if (product.season === currentSeason) {
        score += 50;
      }

      // Favorite cake match: 10 points per matching word, 20 points for category match
      if (lowerFavoriteCake) {
        const productNameWords = product.name.toLowerCase().split(" ");
        const favoriteWords = lowerFavoriteCake.split(" ");
        favoriteWords.forEach((word) => {
          if (productNameWords.includes(word)) {
            score += 10;
          }
        });
        if (product.category.toLowerCase().includes(lowerFavoriteCake)) {
          score += 20;
        }
      }

      // Recency boost: 5 points for products within last 6 months
      const createdDate = new Date(product.createdAt);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      if (createdDate > sixMonthsAgo) {
        score += 5;
      }

      return { ...product, score };
    });

    // Sort by score and take top 4
    return scoredProducts.sort((a, b) => b.score - a.score).slice(0, 4);
  };

  // Handle viewing sample products
  const handleView = (productName) => {
    const product = {
      productId: `sample-${Date.now()}`,
      name: productName,
      unitPrice: 0,
      imgs: ["/placeholder.jpg"],
      author: { name: "Unknown Author", img: "/default-author.jpg" },
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
      category: "Sample",
    };
    if (!viewedProducts.find((p) => p.name === productName)) {
      setViewedProducts((prev) => [...prev, product]);
    }
  };

  // Save user preferences
  const handleSave = () => {
    if (name || favoriteCake) {
      try {
        localStorage.setItem("userName", name);
        localStorage.setItem("favoriteCake", favoriteCake);
      } catch (error) {
        console.error("Error saving user preferences:", error);
      }
    }
  };

  // Add to favorites
  const addToFavorites = (product) => {
    if (!favorites.find((p) => p.productId === product.productId)) {
      const updated = [...favorites, product];
      setFavorites(updated);
      try {
        localStorage.setItem("favoriteProducts", JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving favoriteProducts:", error);
      }
    }
  };

  // Remove from favorites
  const removeFromFavorites = (productId) => {
    const updated = favorites.filter((p) => p.productId !== productId);
    setFavorites(updated);
    try {
      localStorage.setItem("favoriteProducts", JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving favoriteProducts:", error);
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-[#fffaf3] text-gray-800">
      <Header />
      <main className="p-6 mx-auto space-y-6 max-w-7xl">
        <h1 className="text-2xl font-bold">🎂 Cá nhân hóa trải nghiệm bánh</h1>

        {/* User Preferences */}
        <div className="space-y-2">
          <label className="block">Tên của bạn:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nhập tên"
          />
          <label className="block mt-2">Loại bánh yêu thích:</label>
          <input
            value={favoriteCake}
            onChange={(e) => setFavoriteCake(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="VD: Bánh kem socola"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Lưu thông tin
          </button>
        </div>

        {/* Personalized Message */}
        {name && favoriteCake && (
          <div className="p-4 bg-yellow-100 rounded shadow">
            Xin chào <strong>{name}</strong>! Bạn có muốn thử loại <strong>{favoriteCake}</strong> phiên bản mới hôm nay không?
          </div>
        )}

        {/* Similar Favorite Cake Products */}
        {favoriteCake && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">🍰 Sản phẩm tương tự loại bánh yêu thích</h2>
            {getSimilarProducts().length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {getSimilarProducts().map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    viewMode="grid"
                    isFavorite={favorites.some((fav) => fav.productId === product.productId)}
                    onAddFavorite={() =>
                      favorites.some((fav) => fav.productId === product.productId)
                        ? removeFromFavorites(product.productId)
                        : addToFavorites(product)
                    }
                  />
                ))}
              </div>
            ) : (
              <p>Không tìm thấy sản phẩm tương tự.</p>
            )}
          </div>
        )}

        {/* Seasonal Suggestion */}
        <div className="p-4 bg-green-100 rounded shadow">
          🗓️ Gợi ý theo mùa: <strong>{currentSeason}</strong> đang rất được ưa chuộng!
        </div>

        {/* Seasonal Recommendations */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">🌟 Đề xuất theo mùa</h2>
          {getRecommendedProducts().length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {getRecommendedProducts().map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  viewMode="grid"
                  isFavorite={favorites.some((fav) => fav.productId === product.productId)}
                  onAddFavorite={() =>
                    favorites.some((fav) => fav.productId === product.productId)
                      ? removeFromFavorites(product.productId)
                      : addToFavorites(product)
                  }
                />
              ))}
            </div>
          ) : (
            <p>Không có sản phẩm đề xuất nào.</p>
          )}
        </div>

        {/* Viewed Products */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">📌 Sản phẩm bạn đã xem</h2>
          {viewedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {viewedProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  viewMode="grid"
                  isFavorite={favorites.some((fav) => fav.productId === product.productId)}
                  onAddFavorite={() =>
                    favorites.some((fav) => fav.productId === product.productId)
                      ? removeFromFavorites(product.productId)
                      : addToFavorites(product)
                  }
                />
              ))}
            </div>
          ) : (
            <p>Chưa có sản phẩm nào được xem.</p>
          )}

          <div className="mt-4 space-x-2">
            {productDatabase.slice(0, 3).map((p) => (
              <button
                key={p.productId}
                onClick={() => handleView(p.name)}
                className="px-3 py-1 bg-pink-300 rounded hover:bg-pink-400"
              >
                Xem {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Products */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">❤️ Sản phẩm yêu thích</h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {favorites.map((product) => (
                <div key={product.productId} className="relative">
                  <ProductCard
                    product={product}
                    viewMode="grid"
                    isFavorite={true}
                    onAddFavorite={() => removeFromFavorites(product.productId)}
                  />
                  <button
                    onClick={() => removeFromFavorites(product.productId)}
                    className="absolute px-2 py-1 text-white bg-red-500 rounded top-2 right-2 hover:bg-red-600"
                    title="Xóa khỏi yêu thích"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa có sản phẩm yêu thích nào.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}