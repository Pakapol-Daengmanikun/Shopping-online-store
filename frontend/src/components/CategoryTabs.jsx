export default function CategoryTabs({ categories, activeCategory, onSelectCategory }) {
  return (
    <section className="category-tabs">
      <button
        className={!activeCategory ? "active" : ""}
        type="button"
        onClick={() => onSelectCategory("")}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={activeCategory === category.id ? "active" : ""}
          type="button"
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </section>
  );
}
