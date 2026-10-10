import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductFilter from "@/components/shopping-view/filter";
import { Input } from "@/components/ui/form-elements";
import { sortOptions } from "@/config";
import api from "@/api/axios";
import { Search as SearchIcon, X, ChevronDown } from "lucide-react";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, isLoading } = useSelector((state) => state.shopProducts);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isSearching = keyword.trim().length >= 2;

  useEffect(() => {
    const filterParams = {};
    if (filters.category?.length) filterParams.category = filters.category.join(",");
    if (filters.brand?.length) filterParams.brand = filters.brand.join(",");
    dispatch(fetchAllFilteredProducts({ filterParams, sortParams: sort }));
  }, [dispatch, filters, sort]);

  // Search runs against all products, independent of the category/brand filters above.
  useEffect(() => {
    if (!isSearching) {
      setSearchResults(null);
      return;
    }
    const timeout = setTimeout(async () => {
      const res = await api.get(`/shop/search/${keyword.trim()}`);
      setSearchResults(res.data.data || []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [keyword, isSearching]);

  const gridItems = isSearching ? searchResults || [] : productList;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[220px_1fr] md:items-start">
      {/* Desktop: filter sidebar always visible */}
      <div className="hidden md:block">
        <ProductFilter filters={filters} setFilters={setFilters} />
      </div>

      <div>
        {/* Mobile: filters collapsed behind a tap-to-open toggle */}
        <div className="mb-4 md:hidden">
          <button
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="flex w-full items-center justify-between border-b border-ink/10 pb-2 text-sm font-semibold uppercase tracking-wide text-ink"
          >
            Filters
            <ChevronDown
              size={16}
              className={`transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileFiltersOpen && (
            <div className="mt-3">
              <ProductFilter filters={filters} setFilters={setFilters} />
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="relative max-w-md">
            <SearchIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
            <Input
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="!py-2 pl-9 pr-9"
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isSearching ? `Results for "${keyword.trim()}"` : "All Products"}
          </h2>
          {!isSearching && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              <option value="">Sort by</option>
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {isLoading && !isSearching ? (
          <p>Loading...</p>
        ) : gridItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-ink/40">
            <SearchIcon size={32} className="opacity-40" />
            <p>No products found{isSearching ? ` for "${keyword.trim()}"` : ""}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {gridItems.map((product) => (
              <ShoppingProductTile key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingListing;