# Retail Store - Food Delivery Application

A full-stack e-commerce application for food delivery with admin panel, built with FastAPI, React, PostgreSQL and Docker.

## Features

### Customer Features
- Browse products by category and shop
- Add products to cart
- Checkout with delivery address
- Order tracking

### Admin Panel Features
- **Products Management**: Add, edit, delete products with image upload
- **Categories Management**: View and manage product categories
- **Manufacturers Management**: Add and edit manufacturer information
- **Shops Management**: Manage store locations
- **Workers Management**: Add couriers and staff
- **Orders Management**: View all orders and assign couriers

## Tech Stack

- **Backend**: Python FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React JS, Vite, React Router
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose

## Project Structure

```
/workspace
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # SQLAlchemy database models
│   ├── database.py          # Database configuration
│   ├── schemas/
│   │   └── schemas.py       # Pydantic schemas
│   ├── routers/
│   │   └── api.py           # API routes
│   ├── uploads/             # Uploaded product images
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   ├── api.js           # API client
│   │   ├── CartContext.jsx  # Shopping cart context
│   │   ├── index.css        # Styles
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── Products.jsx
│   │       ├── Cart.jsx
│   │       └── AdminPanel.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker/
│   └── init.sql             # Database initialization script
└── docker-compose.yml       # Docker Compose configuration
```

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Running with Docker

1. Clone the repository
2. Navigate to the project directory
3. Run:

```bash
docker-compose up --build
```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Database
The database will be automatically initialized with sample data when running with Docker.

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products/` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/products/{id}/images/` - Upload product image

### Categories
- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create category

### Manufacturers
- `GET /api/manufacturers/` - List manufacturers
- `POST /api/manufacturers/` - Create manufacturer
- `PUT /api/manufacturers/{id}` - Update manufacturer

### Shops
- `GET /api/shops/` - List shops
- `POST /api/shops/` - Create shop

### Workers
- `GET /api/workers/` - List workers
- `POST /api/workers/` - Create worker
- `PUT /api/workers/{id}` - Update worker

### Orders
- `POST /api/orders/checkout/` - Place order
- `GET /api/orders/` - List orders
- `GET /api/admin/orders/` - Admin orders view

## Database Schema

The application uses a normalized PostgreSQL schema with the following main tables:
- companies, shops
- categories, manufacturers
- products, product_image_groups, images
- customers, orders, order_items, checks
- payments
- posts, workers

## Usage Guide

### For Customers
1. Browse products on the home page
2. Filter by category or shop
3. Add items to cart
4. Go to cart and proceed to checkout
5. Enter delivery details and place order

### For Administrators
1. Navigate to Admin panel
2. Manage products, categories, manufacturers
3. Add workers (couriers)
4. View orders and assign couriers

## License

MIT
