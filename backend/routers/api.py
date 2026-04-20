from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
from database import get_db
from models import (
    Company, Shop, Category, Manufacturer, Product, ProductImageGroup, Image,
    Customer, Payment, Post, Worker, Order, OrderItem, Check
)
from schemas.schemas import (
    CompanyCreate, CompanyResponse,
    ShopCreate, ShopUpdate, ShopResponse,
    CategoryCreate, CategoryUpdate, CategoryResponse,
    ManufacturerCreate, ManufacturerUpdate, ManufacturerResponse,
    ProductCreate, ProductUpdate, ProductResponse,
    WorkerCreate, WorkerUpdate, WorkerResponse,
    PostCreate, PostResponse,
    OrderResponse, OrderUpdate,
    CartCheckout
)

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Company endpoints
@router.post("/companies/", response_model=CompanyResponse)
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    db_company = Company(company_name=company.company_name)
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@router.get("/companies/", response_model=List[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

# Shop endpoints
@router.post("/shops/", response_model=ShopResponse)
def create_shop(shop: ShopCreate, db: Session = Depends(get_db)):
    db_shop = Shop(**shop.model_dump())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    db.refresh(db_shop.company)
    return db_shop

@router.get("/shops/", response_model=List[ShopResponse])
def get_shops(db: Session = Depends(get_db)):
    return db.query(Shop).all()

@router.put("/shops/{shop_id}", response_model=ShopResponse)
def update_shop(shop_id: int, shop: ShopUpdate, db: Session = Depends(get_db)):
    db_shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    update_data = shop.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_shop, field, value)
    
    db.commit()
    db.refresh(db_shop)
    return db_shop

@router.delete("/shops/{shop_id}")
def delete_shop(shop_id: int, db: Session = Depends(get_db)):
    db_shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    db.delete(db_shop)
    db.commit()
    return {"message": "Shop deleted"}

# Category endpoints
@router.post("/categories/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_category, field, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted"}

# Manufacturer endpoints
@router.post("/manufacturers/", response_model=ManufacturerResponse)
def create_manufacturer(manufacturer: ManufacturerCreate, db: Session = Depends(get_db)):
    db_manufacturer = Manufacturer(**manufacturer.model_dump())
    db.add(db_manufacturer)
    db.commit()
    db.refresh(db_manufacturer)
    return db_manufacturer

@router.get("/manufacturers/", response_model=List[ManufacturerResponse])
def get_manufacturers(db: Session = Depends(get_db)):
    return db.query(Manufacturer).all()

@router.put("/manufacturers/{manufacturer_id}", response_model=ManufacturerResponse)
def update_manufacturer(manufacturer_id: int, manufacturer: ManufacturerUpdate, db: Session = Depends(get_db)):
    db_manufacturer = db.query(Manufacturer).filter(Manufacturer.id == manufacturer_id).first()
    if not db_manufacturer:
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    
    update_data = manufacturer.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_manufacturer, field, value)
    
    db.commit()
    db.refresh(db_manufacturer)
    return db_manufacturer

@router.delete("/manufacturers/{manufacturer_id}")
def delete_manufacturer(manufacturer_id: int, db: Session = Depends(get_db)):
    db_manufacturer = db.query(Manufacturer).filter(Manufacturer.id == manufacturer_id).first()
    if not db_manufacturer:
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    db.delete(db_manufacturer)
    db.commit()
    return {"message": "Manufacturer deleted"}

# Product endpoints with image upload
@router.post("/products/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Create image group for the product
    image_group = ProductImageGroup(product_id=db_product.id)
    db.add(image_group)
    db.commit()
    db.refresh(image_group)
    db.refresh(db_product.image_groups)
    
    return db_product

@router.get("/products/", response_model=List[ProductResponse])
def get_products(shop_id: Optional[int] = None, category_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Product)
    if shop_id:
        query = query.filter(Product.shop_id == shop_id)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    return query.all()

@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}

# Image upload endpoint
@router.post("/products/{product_id}/images/")
def upload_product_image(product_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get or create image group
    image_group = db.query(ProductImageGroup).filter(ProductImageGroup.product_id == product_id).first()
    if not image_group:
        image_group = ProductImageGroup(product_id=product_id)
        db.add(image_group)
        db.commit()
        db.refresh(image_group)
    
    # Save image file
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{product_id}_{image_group.id}_{len(image_group.images)}.{file_extension}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create image record
    image_link = f"/uploads/{filename}"
    db_image = Image(image_group_id=image_group.id, link=image_link)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    return {"id": db_image.id, "link": db_image.link}

@router.delete("/products/{product_id}/images/{image_id}")
def delete_product_image(product_id: int, image_id: int, db: Session = Depends(get_db)):
    db_image = db.query(Image).filter(Image.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete file from disk
    filepath = db_image.link.lstrip("/")
    if os.path.exists(filepath):
        os.remove(filepath)
    
    db.delete(db_image)
    db.commit()
    return {"message": "Image deleted"}

# Post endpoints
@router.post("/posts/", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/posts/", response_model=List[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

# Worker endpoints
@router.post("/workers/", response_model=WorkerResponse)
def create_worker(worker: WorkerCreate, db: Session = Depends(get_db)):
    db_worker = Worker(**worker.model_dump())
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker

@router.get("/workers/", response_model=List[WorkerResponse])
def get_workers(db: Session = Depends(get_db)):
    return db.query(Worker).all()

@router.put("/workers/{worker_id}", response_model=WorkerResponse)
def update_worker(worker_id: int, worker: WorkerUpdate, db: Session = Depends(get_db)):
    db_worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not db_worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    update_data = worker.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_worker, field, value)
    
    db.commit()
    db.refresh(db_worker)
    return db_worker

@router.delete("/workers/{worker_id}")
def delete_worker(worker_id: int, db: Session = Depends(get_db)):
    db_worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not db_worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    db.delete(db_worker)
    db.commit()
    return {"message": "Worker deleted"}

# Order endpoints
@router.post("/orders/checkout/", response_model=OrderResponse)
def checkout_order(checkout: CartCheckout, db: Session = Depends(get_db)):
    # Create or find customer
    customer = db.query(Customer).filter(
        Customer.name == checkout.customer_name,
        Customer.phone_number == checkout.customer_phone
    ).first()
    
    if not customer:
        customer = Customer(name=checkout.customer_name, phone_number=checkout.customer_phone)
        db.add(customer)
        db.commit()
        db.refresh(customer)
    
    # Create payment
    payment = Payment(bank_name=checkout.payment_bank)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    # Create order
    order = Order(
        customer_id=customer.id,
        payment_id=payment.id,
        delivery_address=checkout.delivery_address,
        status='new'
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Create order items
    total_price = 0
    for item in checkout.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.stock_amount < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")
        
        # Reduce stock
        product.stock_amount -= item.quantity
        
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=float(product.price)
        )
        db.add(order_item)
        total_price += float(product.price) * item.quantity
    
    db.commit()
    
    # Create check
    from datetime import date, time, datetime
    check = Check(
        order_id=order.id,
        total_price=total_price,
        created_date=date.today(),
        created_time=time(datetime.now().hour, datetime.now().minute, datetime.now().second)
    )
    db.add(check)
    db.commit()
    
    db.refresh(order)
    return order

@router.get("/orders/", response_model=List[OrderResponse])
def get_orders(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Order)
    if status_filter:
        query = query.filter(Order.status == status_filter)
    return query.all()

@router.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.put("/orders/{order_id}", response_model=OrderResponse)
def update_order(order_id: int, order_update: OrderUpdate, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = order_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_order, field, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@router.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(db_order)
    db.commit()
    return {"message": "Order deleted"}

@router.get("/admin/orders/", response_model=List[OrderResponse])
def get_all_orders_with_details(db: Session = Depends(get_db)):
    """Admin endpoint to get all orders with courier information"""
    orders = db.query(Order).all()
    return orders
