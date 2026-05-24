# Online Store (Shopee-style) - Separate FE/BE

This project is split into:

- `frontend`: React + Vite customer storefront
- `backend`: Express API for products, categories, cart, and checkout

## 1) Backend setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:4000`

API examples:

- `GET /api/health`
- `GET /api/categories`
- `GET /api/products?q=earbuds&sortBy=top_sold`
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:productId`
- `DELETE /api/cart/:productId`
- `POST /api/checkout`

## 2) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Notes

- CORS is configured in backend for `http://localhost:5173`.
- Data is currently in-memory (demo mode). Cart resets when backend restarts.
