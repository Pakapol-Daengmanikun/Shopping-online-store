export default function Header({ query, onQueryChange, cartCount, onOpenCart }) {
  return (
    <header className="header">
      <div className="brand-block">
        <p className="tag">free shipping over 299 THB</p>
        <h1>Guszilla Shop</h1>
      </div>

      <div className="search-row">
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search products, brands and deals"
        />
        <button type="button" className="search-btn">
          Search
        </button>
      </div>

      <button type="button" className="cart-btn" onClick={onOpenCart}>
        Cart ({cartCount})
      </button>
    </header>
  );
}
