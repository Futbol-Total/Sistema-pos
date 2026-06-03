import { useState } from 'react';
import { Product, Category } from '../../lib/supabase';
import { addOrderItem } from '../../lib/api';

interface MenuProps {
  categories: Category[];
  products: Product[];
  orderId: string;
  onItemAdded: () => void;
}

export default function Menu({ categories, products, orderId, onItemAdded }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  const handleAddItem = async (product: Product) => {
    setIsAdding(true);
    try {
      await addOrderItem(orderId, product.id, 1, product.price);
      onItemAdded();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-sm ${
              activeCategory === cat.id
                ? 'bg-brand-500 text-white shadow-brand'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:border-brand-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => handleAddItem(product)}
            disabled={isAdding}
            className="card p-4 text-left hover:shadow-card-hover transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-neutral-100 rounded-lg h-24 mb-3 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">🍽️</span>
              )}
            </div>
            <h3 className="font-semibold text-sm text-neutral-900 line-clamp-2 mb-1">{product.name}</h3>
            <p className="text-brand-600 font-bold text-lg">${product.price.toLocaleString('es-CO')}</p>
            {product.description && (
              <p className="text-xs text-neutral-400 line-clamp-1 mt-1">{product.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
