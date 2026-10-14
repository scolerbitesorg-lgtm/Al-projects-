import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { ShoppingBag, Star, Filter, ShoppingCart, Loader2, Check } from 'lucide-react';

export const FakeStorePreview: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('all');
  const [cartCount, setCartCount] = useState<number>(0);
  const [addedId, setAddedId] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await executeApiCall('https://fakestoreapi.com/products');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data);
      } else {
        // Fallback demo products if FakeStore is slow
        setProducts([
          {
            id: 1,
            title: 'Fjallraven - Foldsack No. 1 Backpack',
            price: 109.95,
            category: "men's clothing",
            image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
            rating: { rate: 4.5, count: 120 }
          },
          {
            id: 2,
            title: 'Mens Casual Premium Slim Fit T-Shirts',
            price: 22.3,
            category: "men's clothing",
            image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
            rating: { rate: 4.1, count: 259 }
          },
          {
            id: 3,
            title: 'Solid Gold Petite Micropave Ring',
            price: 168,
            category: 'jewelery',
            image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
            rating: { rate: 4.8, count: 70 }
          },
          {
            id: 4,
            title: 'WD 2TB Elements Portable External Hard Drive',
            price: 64,
            category: 'electronics',
            image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
            rating: { rate: 4.6, count: 410 }
          }
        ]);
      }
    } catch {
      // Keep empty or fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (id: number) => {
    setCartCount(c => c + 1);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category?.toLowerCase().includes(category));

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">eCommerce Catalog Showcase</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">{cartCount} items</span>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar text-xs">
        <span className="text-slate-400 text-[11px] shrink-0">Filter:</span>
        {['all', 'men', 'women', 'jewelery', 'electronics'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <span>Loading products catalog from FakeStore...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1 mt-2">
          {filtered.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="h-28 w-full bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden mb-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white line-clamp-1" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="capitalize text-[10px] text-teal-400">{item.category}</span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-mono">{item.rating?.rate || '4.2'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 mt-2">
                  <div className="text-sm font-bold text-white font-mono tabular-nums">
                    ${item.price}
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      (₹{Math.round(item.price * 86)})
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold flex items-center gap-1 transition-colors"
                  >
                    {addedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-slate-950" />
                        <span>Added</span>
                      </>
                    ) : (
                      <span>+ Add</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
