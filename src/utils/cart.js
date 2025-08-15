// utils/cart.js
export const getCartItemKey = (item) => {
  return `${item.productId}-${item.cartItemOptions?.map(o => o.optionValue).join('|') || 'no-opt'}`;
};
