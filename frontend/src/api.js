const API_BASE_URL = "http://localhost:4000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Request failed");
  }

  return response.json();
};

export const api = {
  getCategories: () => request("/categories"),
  getProducts: (query) => request(`/products${query}`),
  getCart: () => request("/cart"),
  getOrders: () => request("/orders"),
  addToCart: (productId) =>
    request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity: 1 })
    }),
  updateCartItem: (productId, quantity) =>
    request(`/cart/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity })
    }),
  removeCartItem: (productId) =>
    request(`/cart/${productId}`, {
      method: "DELETE"
    }),
  checkout: (payload) =>
    request("/checkout", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
