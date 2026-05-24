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
  return (
    <aside className={`cart-drawer ${open ? "open" : ""}`}>
      <div className="cart-head">
        <h3>Your Cart</h3>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="cart-items">
        {cart.items.length === 0 && <p className="empty">No items yet.</p>}
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <img
              src={item.product.image}
              alt={item.product.name}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
            <div>
              <h4>{item.product.name}</h4>
              <p>{formatCurrency(item.product.price)}</p>
              <div className="qty-row">
                <button type="button" onClick={() => onDecrease(item)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => onIncrease(item)}>
                  +
                </button>
                <button type="button" onClick={() => onRemove(item.productId)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-block">
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

        <p>Subtotal: {formatCurrency(cart.subtotal || 0)}</p>
        <p>Shipping: {formatCurrency(cart.shippingFee || 0)}</p>
        <p className="total">Total: {formatCurrency(cart.total || 0)}</p>
        <button
          type="button"
          onClick={onCheckout}
          disabled={checkingOut || cart.items.length === 0}
        >
          {checkingOut ? "Processing..." : "Checkout"}
        </button>
      </div>
    </aside>
  );
}
