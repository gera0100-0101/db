from sqlalchemy import create_engine, Column, Integer, String, Text, Numeric, ForeignKey, TIMESTAMP, Date, Time, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime, date, time

Base = declarative_base()

class Company(Base):
    __tablename__ = 'companies'
    
    id = Column(Integer, primary_key=True)
    company_name = Column(String(255), nullable=False)
    
    shops = relationship('Shop', back_populates='company', cascade='all, delete-orphan')

class Shop(Base):
    __tablename__ = 'shops'
    
    id = Column(Integer, primary_key=True)
    company_id = Column(Integer, ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    address = Column(Text, nullable=False)
    
    company = relationship('Company', back_populates='shops')
    products = relationship('Product', back_populates='shop', cascade='all, delete-orphan')

class Category(Base):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False, unique=True)
    description = Column(Text)
    
    products = relationship('Product', back_populates='category')

class Manufacturer(Base):
    __tablename__ = 'manufacturers'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    contact_person = Column(String(255))
    phone_number = Column(String(50))
    email = Column(String(255))
    location = Column(Text)
    
    products = relationship('Product', back_populates='manufacturer')

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    shop_id = Column(Integer, ForeignKey('shops.id', ondelete='CASCADE'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='SET NULL'))
    manufacturer_id = Column(Integer, ForeignKey('manufacturers.id', ondelete='SET NULL'))
    name = Column(String(255), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    weight = Column(Numeric(10, 3))
    calories = Column(Numeric(10, 2))
    structure = Column(Text)
    stock_amount = Column(Integer, nullable=False, default=0)
    
    shop = relationship('Shop', back_populates='products')
    category = relationship('Category', back_populates='products')
    manufacturer = relationship('Manufacturer', back_populates='products')
    image_groups = relationship('ProductImageGroup', back_populates='product', cascade='all, delete-orphan')
    order_items = relationship('OrderItem', back_populates='product')

class ProductImageGroup(Base):
    __tablename__ = 'product_image_groups'
    
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    
    product = relationship('Product', back_populates='image_groups')
    images = relationship('Image', back_populates='image_group', cascade='all, delete-orphan')

class Image(Base):
    __tablename__ = 'images'
    
    id = Column(Integer, primary_key=True)
    image_group_id = Column(Integer, ForeignKey('product_image_groups.id', ondelete='CASCADE'), nullable=False)
    link = Column(Text, nullable=False)
    
    image_group = relationship('ProductImageGroup', back_populates='images')

class Customer(Base):
    __tablename__ = 'customers'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    phone_number = Column(String(50))
    
    orders = relationship('Order', back_populates='customer')

class Payment(Base):
    __tablename__ = 'payments'
    
    id = Column(Integer, primary_key=True)
    bank_name = Column(String(255), nullable=False)
    payment_link = Column(Text)
    
    orders = relationship('Order', back_populates='payment')

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    salary = Column(Numeric(10, 2), nullable=False)
    
    workers = relationship('Worker', back_populates='post')

class Worker(Base):
    __tablename__ = 'workers'
    
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='SET NULL'))
    full_name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone_number = Column(String(50))
    
    post = relationship('Post', back_populates='workers')
    courier_orders = relationship('Order', back_populates='courier', foreign_keys='Order.courier_id')

class Order(Base):
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True)
    courier_id = Column(Integer, ForeignKey('workers.id', ondelete='SET NULL'))
    customer_id = Column(Integer, ForeignKey('customers.id', ondelete='RESTRICT'), nullable=False)
    payment_id = Column(Integer, ForeignKey('payments.id', ondelete='SET NULL'))
    delivery_address = Column(Text)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    status = Column(String(50), nullable=False, default='new')
    
    customer = relationship('Customer', back_populates='orders')
    payment = relationship('Payment', back_populates='orders')
    courier = relationship('Worker', back_populates='courier_orders', foreign_keys=[courier_id])
    order_items = relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    check = relationship('Check', back_populates='order', uselist=False, cascade='all, delete-orphan')

class OrderItem(Base):
    __tablename__ = 'order_items'
    
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='RESTRICT'), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    
    order = relationship('Order', back_populates='order_items')
    product = relationship('Product', back_populates='order_items')

class Check(Base):
    __tablename__ = 'checks'
    
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, unique=True)
    created_date = Column(Date, nullable=False, default=date.today)
    created_time = Column(Time, nullable=False, default=time)
    total_price = Column(Numeric(10, 2), nullable=False)
    
    order = relationship('Order', back_populates='check')
