import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { favoriteService } from '../services/FavoriteService';

const FAVORITES_KEY = 'favorite_products';

export const useFavorites = () => {
  const token = localStorage.getItem('accessToken');

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const addFavorite = useMutation({
    mutationFn: (productId) => favoriteService.addToFavorite(productId),
  });

  const removeFavorite = useMutation({
    mutationFn: (productId) => favoriteService.removeFromFavorite(productId),
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    const isFav = favorites.includes(productId);

    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    if (token) {
      isFav
        ? removeFavorite.mutate(productId)
        : addFavorite.mutate(productId);
    }
  };

  const isFavorite = (productId) => favorites.includes(productId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoading: addFavorite.isLoading || removeFavorite.isLoading,
  };
};
