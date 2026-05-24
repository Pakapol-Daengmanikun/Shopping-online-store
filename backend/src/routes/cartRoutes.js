import { Router } from "express";
import {
  addToCart,
  checkout,
  getCart,
  getOrders,
  removeCartItem,
  updateCartItem
} from "../controllers/cartController.js";

const router = Router();

router.get("/cart", getCart);
router.post("/cart", addToCart);
router.patch("/cart/:productId", updateCartItem);
router.delete("/cart/:productId", removeCartItem);
router.get("/orders", getOrders);
router.post("/checkout", checkout);

export default router;
