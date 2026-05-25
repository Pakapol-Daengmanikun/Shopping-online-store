const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

const paymentOptions = ["Cash on Delivery", "PromptPay", "Credit Card"];

export default function CartDrawer({
  open,
  cart,
  checkoutForm,
  onCheckoutInputChange,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  checkingOut
}) {
  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <button
        type="button"
        className={`cart-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
        aria-label="Close cart"
        tabIndex={open ? 0 : -1}
      />
      <aside className={`cart-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cart-head">
          <div>
            <p className="cart-eyebrow">{itemCount} {itemCount === 1 ? "item" : "items"} ready</p>
            <h3>Your Cart</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close cart">
            x
          </button>
        </div>

        <div className="cart-items">
          {cart.items.length === 0 && (
            <div className="empty">
              <span>0</span>
              <h4>Your cart is empty</h4>
              <p>Add something you love and it will appear here.</p>
            </div>
          )}
          {cart.items.map((item) => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.product.image}
                alt={item.product.name}
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="cart-item-info">
                <div className="cart-item-title">
                  <h4>{item.product.name}</h4>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => onRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
                <p>{formatCurrency(item.product.price)}</p>
                <div className="qty-row">
                  <button type="button" onClick={() => onDecrease(item)} aria-label="Decrease quantity">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onIncrease(item)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-block">
          <div className="checkout-fields">
            <label>
              Shipping Address
              <input
                name="address"
                type="text"
                value={checkoutForm.address}
                onChange={onCheckoutInputChange}
                placeholder="Enter full delivery address"
              />
            </label>

            <label>
              Payment Method
              <select
                name="paymentMethod"
                value={checkoutForm.paymentMethod}
                onChange={onCheckoutInputChange}
              >
                {paymentOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="cart-summary">
            <p>
              <span>Subtotal</span>
              <strong>{formatCurrency(cart.subtotal || 0)}</strong>
            </p>
            <p>
              <span>Shipping</span>
              <strong>{formatCurrency(cart.shippingFee || 0)}</strong>
            </p>
            <p className="total">
              <span>Total</span>
              <strong>{formatCurrency(cart.total || 0)}</strong>
            </p>
          </div>
          <button
            type="button"
            className="checkout-btn"
            onClick={onCheckout}
            disabled={checkingOut || cart.items.length === 0}
          >
            {checkingOut ? "Processing..." : "Checkout"}
          </button>
        </div>
      </aside>
    </>
  );
}
