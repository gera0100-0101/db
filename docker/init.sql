-- PostgreSQL retail store schema (normalized)

DROP TABLE IF EXISTS images, product_image_groups, checks, order_items, orders, workers, posts, payments, customers, products, categories, manufacturers, shops, companies CASCADE;

CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL
);

CREATE TABLE shops (
  id SERIAL PRIMARY KEY,
  company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  address TEXT NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE manufacturers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone_number VARCHAR(50),
  email VARCHAR(255),
  location TEXT
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  shop_id INT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  manufacturer_id INT REFERENCES manufacturers(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  weight NUMERIC(10,3),
  calories NUMERIC(10,2),
  structure TEXT,
  stock_amount INT NOT NULL DEFAULT 0 CHECK (stock_amount >= 0)
);

CREATE TABLE product_image_groups (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image_group_id INT NOT NULL REFERENCES product_image_groups(id) ON DELETE CASCADE,
  link TEXT NOT NULL
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50)
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  bank_name VARCHAR(255) NOT NULL,
  payment_link TEXT
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  salary NUMERIC(10,2) NOT NULL CHECK (salary >= 0)
);

CREATE TABLE workers (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone_number VARCHAR(50)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  courier_id INT REFERENCES workers(id) ON DELETE SET NULL,
  customer_id INT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  payment_id INT REFERENCES payments(id) ON DELETE SET NULL,
  delivery_address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'new'
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0)
);

CREATE TABLE checks (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_time TIME NOT NULL DEFAULT CURRENT_TIME,
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0)
);

-- indexes
CREATE INDEX idx_products_shop ON products(shop_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- sample data
INSERT INTO companies(company_name) VALUES ('Fresh Market LLC');
INSERT INTO shops(company_id, address) VALUES (1, 'Main street 10');
INSERT INTO categories(name) VALUES ('Drinks'), ('Snacks');
INSERT INTO manufacturers(name, contact_person, phone_number, email, location) 
VALUES 
  ('Coca Cola', 'John Doe', '+1234567890', 'contact@cocacola.com', 'USA'),
  ('Lays', 'Jane Smith', '+0987654321', 'info@lays.com', 'UK');
INSERT INTO products(shop_id, category_id, manufacturer_id, name, price, stock_amount, weight, calories, structure)
VALUES 
  (1,1,1,'Cola 1L',2.50,100, 1000, 42, 'Carbonated soft drink with sugar and caffeine'),
  (1,2,2,'Chips Classic',1.80,50, 150, 530, 'Potato chips with salt');

-- Add courier post
INSERT INTO posts(name, salary) VALUES ('Courier', 500.00), ('Manager', 1500.00);
