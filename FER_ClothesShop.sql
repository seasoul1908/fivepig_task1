--ALTER DATABASE ClothesShop SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--GO
DROP DATABASE ClothesShop;
GO

CREATE DATABASE ClothesShop;
GO

USE ClothesShop;
GO

-- 1. Account (Tài khoản đăng nhập)
CREATE TABLE Account (
    AccountID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(50) NOT NULL,
    Role INT NOT NULL, 
    Status INT DEFAULT 1 NOT NULL 
);
GO

-- 2. Customer (Thông tin khách hàng)
CREATE TABLE Customer (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(15) NOT NULL,
    Address NVARCHAR(200) NOT NULL,
    AccountID INT UNIQUE FOREIGN KEY REFERENCES Account(AccountID) 
);
GO

-- 3. Category (Bảng mới: Quản lý danh mục như T-Shirts, Jeans, Jackets...)
CREATE TABLE Category (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Status INT DEFAULT 1 NOT NULL
);
GO

-- 4. Size (Quản lý kích cỡ)
CREATE TABLE Size (
    SizeID INT IDENTITY(1,1) PRIMARY KEY,
    SizeValue NVARCHAR(10) NOT NULL 
);
GO

-- 5. Color (Quản lý màu sắc)
CREATE TABLE Color (
    ColorID INT IDENTITY(1,1) PRIMARY KEY,
    ColorName NVARCHAR(30) NOT NULL,
    Status INT DEFAULT 1 NOT NULL
);
GO

-- 6. Product (Thông tin chung của sản phẩm)
CREATE TABLE Product (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(100) NOT NULL,
    Image NVARCHAR(255),
    Price DECIMAL(10,2) NOT NULL,
    CategoryID INT FOREIGN KEY REFERENCES Category(CategoryID) NOT NULL, 
    Status INT DEFAULT 1 NOT NULL
);
GO

-- 7. ProductDetail (Biến thể sản phẩm: Quản lý tồn kho theo từng cặp Màu - Size)
CREATE TABLE ProductDetail (
    ProductDetailID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT FOREIGN KEY REFERENCES Product(ProductID) NOT NULL,
    ColorID INT FOREIGN KEY REFERENCES Color(ColorID) NOT NULL,
    SizeID INT FOREIGN KEY REFERENCES Size(SizeID) NOT NULL,
    Quantity INT CHECK (Quantity >= 0) NOT NULL, 
    Status INT DEFAULT 1 NOT NULL,
    CONSTRAINT UQ_Product_Color_Size UNIQUE(ProductID, ColorID, SizeID)
);
GO

-- 8. Order (Đơn đặt hàng)
CREATE TABLE [Order] (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    OrderDate DATETIME DEFAULT GETDATE() NOT NULL,
    CustomerID INT FOREIGN KEY REFERENCES Customer(CustomerID), 
    TotalAmount DECIMAL(10,2) NOT NULL DEFAULT 0,
    Status INT DEFAULT 0 
);
GO

-- 9. OrderDetail (Chi tiết đơn hàng)
CREATE TABLE OrderDetail (
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT FOREIGN KEY REFERENCES [Order](OrderID) NOT NULL,
    ProductDetailID INT FOREIGN KEY REFERENCES ProductDetail(ProductDetailID) NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL 
GO