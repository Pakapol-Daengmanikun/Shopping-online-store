const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);

const ProductDetail = ({ product, onAddToCart, onBack }) => {
  const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <section className="product-detail-page">
      <button type="button" className="back-btn" onClick={onBack}>
        ← Back to products
      </button>

      <div className="detail-grid">
        <div className="detail-image">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>

        <div className="detail-content">
          <p className="detail-badge">Product detail</p>
          <h1>{product.name}</h1>

          <div className="detail-prices">
            <span className="price">{formatCurrency(product.price)}</span>
            <span className="old-price">{formatCurrency(product.oldPrice)}</span>
            <span className="discount detail-discount">-{discountPercent}%</span>
          </div>

          <div className="detail-meta-row">
            <div className="detail-meta">
              <strong>Rating</strong>
              <p>{product.rating.toFixed(1)} stars</p>
            </div>
            <div className="detail-meta">
              <strong>Sold</strong>
              <p>{product.sold.toLocaleString()}</p>
            </div>
          </div>

          <div className="detail-meta-row">
            <div className="detail-meta">
              <strong>Location</strong>
              <p>{product.location}</p>
            </div>
            <div className="detail-meta">
              <strong>Stock</strong>
              <p>{product.stock} left</p>
            </div>
          </div>

          <p className="detail-description">
            Discover the full product specs and why this item is a favorite in our store. It features a premium design,
            strong ratings, and fast shipping from {product.location}.
          </p>

          <button type="button" className="detail-add-btn" onClick={() => onAddToCart(product.id)}>
            <span className="detail-add-icon">+</span>
            <span>Add to cart</span>
            <strong>{formatCurrency(product.price)}</strong>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
