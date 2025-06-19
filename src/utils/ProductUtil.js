
export function ProductFilter(products, search, categoryId, priceRange) {
  return products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryId ? p.categoryId === categoryId : true;
    const matchPrice = p.unitPrice >= priceRange[0] && p.unitPrice <= priceRange[1];

    return matchSearch && matchCategory && matchPrice;
  });
}
