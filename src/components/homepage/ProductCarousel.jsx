import ProductCard from '../ProductCard';

const ProductCarousel = ({ products }) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.map(product => (
          <div key={product.id} className="min-w-[200px] md:min-w-[250px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel;
