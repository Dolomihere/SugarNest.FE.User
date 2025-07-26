
export function mapProductAddToCart(productId, quantity, note, selectedOptions) {
  return JSON.stringify({
    productId: productId,
    note: note ?? null,
    quantity: quantity ?? 1,
    productItemOptionModels: selectedOptions.map(option => ({
      optionGroupId: option.groupId,
      optionItemId: option.itemId
    }))
  });
}




