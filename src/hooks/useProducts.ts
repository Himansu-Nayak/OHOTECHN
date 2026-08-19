'use client';

import * as React from 'react';
import { Product, Industry, industries } from '@/config/industries';

interface UseProductsResult {
  allProducts: Product[];
  industriesList: Industry[];
  selectedIndustry: Industry;
  setSelectedIndustry: (industry: Industry) => void;
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
}

export function useProducts(initialIndustrySlug?: string): UseProductsResult {
  const [selectedIndustry, setSelectedIndustry] = React.useState<Industry>(() => {
    if (initialIndustrySlug) {
      const found = industries.find((i) => i.slug === initialIndustrySlug);
      if (found) return found;
    }
    return industries[0];
  });

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulated instant client cache loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedIndustry]);

  const allProducts = React.useMemo(() => {
    return industries.flatMap((ind) => ind.products);
  }, []);

  const filteredProducts = React.useMemo(() => {
    let list = selectedIndustry ? selectedIndustry.products : allProducts;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.features && p.features.some((f: string) => f.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [selectedIndustry, allProducts, searchQuery]);

  return {
    allProducts,
    industriesList: industries,
    selectedIndustry,
    setSelectedIndustry,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    isLoading,
  };
}
