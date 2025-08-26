export const isOrderCompleted = (order) => {
  if (order.status == -1) return true;
  if (order.status == -2) return true;
  if (order.status == 4 && order.isPaid == true) return true;

  return false;
};