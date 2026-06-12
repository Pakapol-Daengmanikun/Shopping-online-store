const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });

export default function OrderHistory({ orders }) {
  return (
    <section className="order-history">
      <div className="section-head">
        <div>
          <p className="section-kicker">Purchase history</p>
          <h2>Recent Orders</h2>
        </div>
        <span className="order-count">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <div className="order-empty">
          <span>0</span>
          <h3>No orders yet</h3>
          <p>Place your first order from the cart.</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article key={order.orderId} className="order-card">
              <div className="order-meta">
                <div>
                  <p className="order-label">Order</p>
                  <h3>{order.orderId}</h3>
                </div>
                <span className="order-status">Paid</span>
              </div>

              <div className="order-details">
                <p>
                  <span>Date</span>
                  <strong>{formatDate(order.paidAt)}</strong>
                </p>
                <p>
                  <span>Payment</span>
                  <strong>{order.paymentMethod}</strong>
                </p>
              </div>

              <div className="order-address">
                <span>Ship to</span>
                <p>{order.address}</p>
              </div>

              <div className="order-total">
                <span>Total paid</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
