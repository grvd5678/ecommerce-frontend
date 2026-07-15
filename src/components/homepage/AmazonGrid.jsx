import { Link } from 'react-router-dom';

const CategoryCard = ({ title, image, onSelect }) => (
  <div onClick={() => onSelect(title)} className="flex flex-col gap-1 w-full cursor-pointer">
    <div className="h-24 w-full bg-slate-100 rounded overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <p className="text-[10px] text-slate-700 truncate w-full">{title}</p>
  </div>
);

const AmazonGrid = ({ title, cards, onCategorySelect, category }) => (
  <div className="bg-white p-3 rounded shadow-sm border border-slate-200 h-full flex flex-col justify-between">
    <h2 className="text-md font-bold text-slate-900 mb-2">{title}</h2>
    <div className="grid grid-cols-2 gap-2 flex-grow">
      {cards.map((card, index) => (
        <CategoryCard key={index} {...card} onSelect={onCategorySelect} />
      ))}
    </div>
    <button onClick={() => onCategorySelect(category || 'All')} className="text-xs text-cyan-700 mt-2 block hover:underline text-left">See more</button>
  </div>
);

export default AmazonGrid;
