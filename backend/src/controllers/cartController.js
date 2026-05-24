import { nanoid } from "nanoid";
import { products } from "../data/products.js";

const cart = {
  id: nanoid(8),
  items: [
    { productId: "p14", quantity: 1 },
    { productId: "p17", quantity: 2 }
  ]
};

const orders = [
  {
    orderId: "OD-2026052201",
    paidAt: "2026-05-22T09:18:00.000Z",
    address: "88 Sukhumvit Road, Khlong Toei, Bangkok 10110",
    paymentMethod: "PromptPay",
    id: "mock-cart-01",
    items: [
      {
        productId: "p3",
        quantity: 1,
        product: products.find((item) => item.id === "p3"),
        lineTotal: 329
      },
      {
        productId: "p10",
        quantity: 1,
        product: products.find((item) => item.id === "p10"),
        lineTotal: 690
      }
    ],
    subtotal: 1019,
    shippingFee: 45,
    total: 1064
  },
  {
    orderId: "OD-2026051801",
    paidAt: "2026-05-18T14:42:00.000Z",
    address: "21 Nimmanhemin Road, Suthep, Chiang Mai 50200",
    paymentMethod: "Credit Card",
    id: "mock-cart-02",
    items: [
      {
        productId: "p7",
        quantity: 1,
        product: products.find((item) => item.id === "p7"),
        lineTotal: 1190
      },
      {
        productId: "p12",
        quantity: 2,
        product: products.find((item) => item.id === "p12"),
        lineTotal: 518
      }
    ],
    subtotal: 1708,
    shippingFee: 45,
    total: 1753
  }
];

const getProductById = (productId) => products.find((item) => item.id === productId);

const formatCart = () => {
  const enrichedItems = cart.items
    .map((entry) => {
      const product = getProductById(entry.productId);

      if (!product) return null;

      return {
        ...entry,
        product,
        lineTotal: product.price * entry.quantity
      };
    })
    .filter(Boolean);

  const subtotal = enrichedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: cart.id,
    items: enrichedItems,
    subtotal,
    shippingFee: subtotal > 0 ? 45 : 0,
    total: subtotal > 0 ? subtotal + 45 : 0
  };
};

const validateQuantity = (quantity) =>
  Number.isInteger(quantity) && quantity > 0 && quantity <= 99;

export const getCart = (_req, res) => {
  res.json({ data: formatCart() });
};

export const getOrders = (_req, res) => {
  res.json({ data: orders });
};

export const addToCart = (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  if (!validateQuantity(quantity)) {
    return res
      .status(400)
      .json({ message: "quantity must be an integer between 1 and 99" });
  }

  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  return res.status(201).json({ data: formatCart() });
};

export const updateCartItem = (req, res) => {
  const { quantity } = req.body;
  const target = cart.items.find((item) => item.productId === req.params.productId);

  if (!target) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  if (!Number.isInteger(quantity)) {
    return res.status(400).json({ message: "quantity must be an integer" });
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.productId !== req.params.productId);
  } else if (quantity > 99) {
    return res.status(400).json({ message: "quantity must not exceed 99" });
  } else {
    target.quantity = quantity;
  }

  return res.json({ data: formatCart() });
};

export const removeCartItem = (req, res) => {
  cart.items = cart.items.filter((item) => item.productId !== req.params.productId);
  return res.json({ data: formatCart() });
};

export const checkout = (req, res) => {
  const { address, paymentMethod } = req.body;

  if (!address || !paymentMethod) {
    return res.status(400).json({ message: "address and paymentMethod are required" });
  }

  if (!address.trim()) {
    return res.status(400).json({ message: "address cannot be empty" });
  }

  const cartSnapshot = formatCart();

  if (cartSnapshot.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const order = {
    orderId: `OD-${Date.now()}`,
    paidAt: new Date().toISOString(),
    address,
    paymentMethod,
    ...cartSnapshot
  };

  orders.unshift(order);
  cart.items = [];

  return res.status(201).json({ message: "Checkout success", data: order });
};
