const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);

export default function ProductCard({ product, onAddToCart }) {
  const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <span className="discount">-{discountPercent}%</span>

      <div className="product-content">
        <h3>{product.name}</h3>

        <div className="prices">
          <span className="price">{formatCurrency(product.price)}</span>
          <span className="old-price">{formatCurrency(product.oldPrice)}</span>
        </div>

        <div className="meta-row">
          <p>{product.rating.toFixed(1)} stars</p>
          <p>{product.sold.toLocaleString()} sold</p>
        </div>

        <div className="meta-row">
          <p>{product.location}</p>
          <p>{product.stock} left</p>
        </div>

        <button type="button" onClick={() => onAddToCart(product.id)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
