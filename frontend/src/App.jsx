import { useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "./api";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import CategoryTabs from "./components/CategoryTabs";
import ProductCard from "./components/ProductCard";
import ProductDetail from "./components/ProductDetail";
import CartDrawer from "./components/CartDrawer";
import OrderHistory from "./components/OrderHistory";
import LoginPage from "./components/LoginPage";

const defaultCheckoutForm = {
  address: "",
  paymentMethod: "Cash on Delivery"
};

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState("top_sold");
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [checkoutForm, setCheckoutForm] = useState(defaultCheckoutForm);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("guszilla-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("guszilla-token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeCategory) params.set("categoryId", activeCategory);
    if (sortBy) params.set("sortBy", sortBy);
    const parsed = params.toString();
    return parsed ? `?${parsed}` : "";
  }, [query, activeCategory, sortBy]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError("");
      const [categoryRes, productRes, cartRes, ordersRes] = await Promise.all([
        api.getCategories(),
        api.getProducts(queryString),
        api.getCart(),
        api.getOrders()
      ]);
      setCategories(categoryRes.data);
      setProducts(productRes.data);
      setCart(cartRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadData();
  }, [queryString, user]);

  const addToCart = async (productId) => {
    try {
      const res = await api.addToCart(productId);
      setCart(res.data);
      setCartOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.updateCartItem(productId, quantity);
      setCart(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await api.removeCartItem(productId);
      setCart(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const onProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleLogin = async ({ username, password }) => {
    setAuthError("");
    setAuthLoading(true);

    try {
      const response = await api.login(username, password);
      const { user: loggedUser, token } = response.data;
      setAuthToken(token);
      localStorage.setItem("guszilla-user", JSON.stringify(loggedUser));
      localStorage.setItem("guszilla-token", token);
      setUser(loggedUser);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (_err) {
      // ignore logout errors
    }
    setUser(null);
    setSelectedProduct(null);
    localStorage.removeItem("guszilla-user");
    localStorage.removeItem("guszilla-token");
    setAuthToken("");
  };

  const onCheckoutInputChange = (event) => {
    const { name, value } = event.target;
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const checkout = async () => {
    if (!checkoutForm.address.trim()) {
      setError("Please enter a shipping address before checkout.");
      return;
    }

    try {
      setCheckingOut(true);
      setError("");

      const checkoutRes = await api.checkout({
        address: checkoutForm.address,
        paymentMethod: checkoutForm.paymentMethod
      });

      alert(`Order ${checkoutRes.data.orderId} completed!`);

      const [cartRes, ordersRes] = await Promise.all([api.getCart(), api.getOrders()]);
      setCart(cartRes.data);
      setOrders(ordersRes.data);
      setCheckoutForm(defaultCheckoutForm);
      setCartOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="page">
        <Header
          query={query}
          onQueryChange={setQuery}
          cartCount={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
          onOpenCart={() => setCartOpen(true)}
          user={null}
          onLogout={handleLogout}
        />

        <main>
          <LoginPage onLogin={handleLogin} loading={authLoading} error={authError} />
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Header
        query={query}
        onQueryChange={setQuery}
        cartCount={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <main>
        <HeroBanner />

        <section className="toolbar">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="top_sold">Sort: Top sold</option>
            <option value="price_asc">Sort: Price low to high</option>
            <option value="price_desc">Sort: Price high to low</option>
          </select>
        </section>

        {error && <p className="error-box">{error}</p>}

        {loading ? (
          <p className="loading">Loading products...</p>
        ) : (
          <>
            {selectedProduct ? (
              <ProductDetail
                product={selectedProduct}
                onAddToCart={addToCart}
                onBack={closeProductDetail}
              />
            ) : (
              <>
                <section className="product-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onViewDetails={onProductSelect}
                    />
                  ))}
                </section>
                <OrderHistory orders={orders} />
              </>
            )}
          </>
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        cart={cart}
        checkoutForm={checkoutForm}
        onCheckoutInputChange={onCheckoutInputChange}
        onClose={() => setCartOpen(false)}
        onIncrease={(item) => updateQuantity(item.productId, item.quantity + 1)}
        onDecrease={(item) => updateQuantity(item.productId, item.quantity - 1)}
        onRemove={removeItem}
        onCheckout={checkout}
        checkingOut={checkingOut}
      />
    </div>
  );
}
