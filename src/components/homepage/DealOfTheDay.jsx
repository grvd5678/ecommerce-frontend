import DealsBanner from '../DealsBanner'; // Reusing the one created earlier
import ProductCard from '../ProductCard';

const DealOfTheDay = ({ products, endTime }) => {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Deal of the Day</h2>
        <DealsBanner title="Flash Sale" endTime={endTime} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default DealOfTheDay;
