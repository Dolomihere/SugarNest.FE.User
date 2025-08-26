import Badge from "./Badge"; // hoặc đường dẫn tương ứng

const statusLabelMap = {
  [-2]: "Đã trả hàng",
  [-1]: "Đã huỷ",
  [0]: "Chờ xác nhận",
  [1]: "Đã xác nhận",
  [2]: "Đang xử lý",
  [3]: "Đang giao",
  [4]: "Đã giao",
};

const statusColorMap = {
  [-2]: "error",
  [-1]: "error",
  [0]: "light",
  [1]: "primary",
  [2]: "warning",
  [3]: "info",
  [4]: "success",
};

const OrderStatusBadge = ({
  status,
  size = "sm",
  variant = "light",
  className,
}) => {
  const label = statusLabelMap[status] || "Tạo đơn";
  const color = statusColorMap[status] || "light";

  return (
    <Badge size={size} variant={variant} color={color} className={className}>
      {label}
    </Badge>
  );
};

export default OrderStatusBadge;
