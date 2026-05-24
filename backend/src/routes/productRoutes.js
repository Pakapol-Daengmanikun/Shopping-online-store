import { Router } from "express";
import {
  getCategories,
  getProductById,
  getProducts
} from "../controllers/productController.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

export default router;
