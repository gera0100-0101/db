from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date, time

# Company schemas
class CompanyBase(BaseModel):
    company_name: str

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: int
    
    class Config:
        from_attributes = True

# Shop schemas
class ShopBase(BaseModel):
    company_id: int
    address: str

class ShopCreate(ShopBase):
    pass

class ShopResponse(ShopBase):
    id: int
    company: Optional[CompanyResponse] = None
    
    class Config:
        from_attributes = True

# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

# Manufacturer schemas
class ManufacturerBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None

class ManufacturerCreate(ManufacturerBase):
    pass

class ManufacturerUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None

class ManufacturerResponse(ManufacturerBase):
    id: int
    
    class Config:
        from_attributes = True

# Image schemas
class ImageBase(BaseModel):
    link: str

class ImageCreate(ImageBase):
    image_group_id: int

class ImageResponse(ImageBase):
    id: int
    image_group_id: int
    
    class Config:
        from_attributes = True

# ProductImageGroup schemas
class ProductImageGroupBase(BaseModel):
    product_id: int

class ProductImageGroupResponse(ProductImageGroupBase):
    id: int
    images: List[ImageResponse] = []
    
    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    shop_id: int
    category_id: Optional[int] = None
    manufacturer_id: Optional[int] = None
    name: str
    price: float
    weight: Optional[float] = None
    calories: Optional[float] = None
    structure: Optional[str] = None
    stock_amount: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    shop_id: Optional[int] = None
    category_id: Optional[int] = None
    manufacturer_id: Optional[int] = None
    name: Optional[str] = None
    price: Optional[float] = None
    weight: Optional[float] = None
    calories: Optional[float] = None
    structure: Optional[str] = None
    stock_amount: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    shop: Optional[ShopResponse] = None
    category: Optional[CategoryResponse] = None
    manufacturer: Optional[ManufacturerResponse] = None
    image_groups: List[ProductImageGroupResponse] = []
    
    class Config:
        from_attributes = True

# Customer schemas
class CustomerBase(BaseModel):
    name: str
    phone_number: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    
    class Config:
        from_attributes = True

# Payment schemas
class PaymentBase(BaseModel):
    bank_name: str
    payment_link: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    
    class Config:
        from_attributes = True

# Post schemas
class PostBase(BaseModel):
    name: str
    salary: float

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    
    class Config:
        from_attributes = True

# Worker schemas
class WorkerBase(BaseModel):
    post_id: Optional[int] = None
    full_name: str
    email: Optional[str] = None
    phone_number: Optional[str] = None

class WorkerCreate(WorkerBase):
    pass

class WorkerUpdate(BaseModel):
    post_id: Optional[int] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None

class WorkerResponse(WorkerBase):
    id: int
    post: Optional[PostResponse] = None
    
    class Config:
        from_attributes = True

# OrderItem schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class OrderItemCreate(OrderItemBase):
    order_id: int

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    product: Optional[ProductResponse] = None
    
    class Config:
        from_attributes = True

# Order schemas
class OrderBase(BaseModel):
    customer_id: int
    courier_id: Optional[int] = None
    payment_id: Optional[int] = None
    delivery_address: Optional[str] = None
    status: str = 'new'

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    courier_id: Optional[int] = None
    payment_id: Optional[int] = None
    delivery_address: Optional[str] = None
    status: Optional[str] = None

class OrderResponse(OrderBase):
    id: int
    created_at: datetime
    customer: Optional[CustomerResponse] = None
    courier: Optional[WorkerResponse] = None
    payment: Optional[PaymentResponse] = None
    order_items: List[OrderItemResponse] = []
    check: Optional['CheckResponse'] = None
    
    class Config:
        from_attributes = True

# Check schemas
class CheckBase(BaseModel):
    order_id: int
    total_price: float
    created_date: Optional[date] = None
    created_time: Optional[time] = None

class CheckCreate(CheckBase):
    pass

class CheckResponse(CheckBase):
    id: int
    
    class Config:
        from_attributes = True

# Cart and Order creation
class CartItem(BaseModel):
    product_id: int
    quantity: int

class CartCheckout(BaseModel):
    customer_name: str
    customer_phone: Optional[str] = None
    delivery_address: str
    items: List[CartItem]
    payment_bank: str = "Default Bank"
