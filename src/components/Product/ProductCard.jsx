import { useQuery } from '@tanstack/react-query';
import ProductService from '../../services/ProductService';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children, style }) => {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 13,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 10000,
        ...style,
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const ProductCard = ({ id, index }) => {
  const { data: product = {}, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () =>
      ProductService.getProductById(id).then((res) => res.data.data),
  });

  const [tooltipPos, setTooltipPos] = useState(null);
  const cardRef = useRef();

  if (isProductLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-20 h-20 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
      </div>
    );
  }

  if (!product?.imgs?.length) {
    return (
      <div className="w-20 text-sm text-center text-gray-500 dark:text-gray-400">
        Không tìm thấy
      </div>
    );
  }

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    if (index === 2 || index === 3) {
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.left - 12,
        transform: 'translate(-100%, -50%)',
      });
    } else {
      setTooltipPos({
        top: rect.top - 12,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)',
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
  };

  const handleClick = () => {
    window.open(`/products/${id}`, '_blank');
  };

  return (
    <>
      <div
        ref={cardRef}
        className="relative inline-block w-20 h-20 cursor-pointer group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <img
          src={product.imgs[0]?? "https://res.cloudinary.com/dwlvd5lxt/image/upload/v1751540177/temp_product_tfynpj.jpg"}
          alt={product.name}
          className="object-cover w-20 h-20 transition-all duration-300 border border-gray-200 rounded-lg shadow-md dark:border-gray-700 group-hover:border-amber-500 group-hover:shadow-xl group-hover:scale-105"
        />
      </div>

      {tooltipPos && (
        <Tooltip
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: tooltipPos.transform,
          }}
        >
          {product.name} -{' '}
          {typeof product.finalUnitPrice === 'number'
            ? product.finalUnitPrice.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })
            : 'Giá cập nhật'}
        </Tooltip>
      )}
    </>
  );
};

export default ProductCard;