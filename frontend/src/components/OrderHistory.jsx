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
        <h2>Recent Orders</h2>
        <p>{orders.length} total</p>
      </div>

      {orders.length === 0 ? (
        <p className="empty">No orders yet. Place your first order from the cart.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article key={order.orderId} className="order-card">
              <div className="order-meta">
                <h3>{order.orderId}</h3>
                <p>{formatDate(order.paidAt)}</p>
              </div>
              <p>{order.paymentMethod}</p>
              <p>{order.address}</p>
              <p className="order-total">{formatCurrency(order.total)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
