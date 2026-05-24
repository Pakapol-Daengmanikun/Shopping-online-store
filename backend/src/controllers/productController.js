import { categories, products } from "../data/products.js";

export const getCategories = (_req, res) => {
  res.json({ data: categories });
};

export const getProducts = (req, res) => {
  const { q, categoryId, sortBy } = req.query;

  let filtered = [...products];

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter((item) => item.name.toLowerCase().includes(query));
  }

  if (categoryId) {
    filtered = filtered.filter((item) => item.categoryId === categoryId);
  }

  if (sortBy === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sortBy === "top_sold") {
    filtered.sort((a, b) => b.sold - a.sold);
  }

  res.json({ data: filtered });
};

export const getProductById = (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({ data: product });
};
