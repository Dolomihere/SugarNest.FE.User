import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useFetchList } from '../core/hook/useFetchList';
import { useDebouncedSearch } from '../core/hook/useDebouncedSearch';
import { categoryService } from '../core/services/CategoryService';

import { ProductList } from '../components/ProductList';

export default function ProductPage() {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [search, setSearch] = useState('');

  const [params, setParams] = useState({
    searchTerm: '',
    sortBy: '',
    sortDescending: false,
    isActive: true,
    categoryId: '',
    pageIndex: 1,
    pageSize: 10,
  });

  // const { data: categories } = useQuery({
  //   queryKey: ['categories'],
  //   queryFn: () => categoryService.getAll().then(res => res.data)
  // });

  return (
    <>
      <ProductList params={params}></ProductList>
    </>
  );
}
