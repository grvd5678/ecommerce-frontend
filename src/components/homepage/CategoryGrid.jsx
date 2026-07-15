const CategoryGrid = ({ categories }) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-slate-100 p-6 rounded-2xl text-center hover:bg-slate-200 transition cursor-pointer">
            <span className="text-4xl mb-2 block">{cat.icon}</span>
            <span className="font-semibold text-slate-900">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
