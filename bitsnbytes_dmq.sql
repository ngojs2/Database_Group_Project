-- Group 40
-- Project Step 4 Draft Version
-- Data Manipulation Queries


--  CUSTOMERS PAGE

-- Display all Customers data in Customers page
SELECT customerID AS 'Customer ID', firstName AS 'First Name', lastName AS 'Last Name', username AS 'Username', password AS 'Password', dateOfBirth AS 'Date of Birth', phoneNumber AS 'Phone', email AS 'Email', street AS 'Street', city AS 'City', state AS 'State', zip AS 'Zip', country AS 'Country'
FROM Customers;

-- Add a Customer
INSERT INTO Customers (firstName, lastName, username, password, dateOfBirth, phoneNumber, email, street, city, state, zip, country)
VALUES (:firstName_input, :lastName_input, :username_input, :password_input, :dateOfBirth_input, :phoneNumber_input, :email_input, :street_input, :city_input, :state_input, :zip_input, :country_input);

-- Search Customer by First Name, Last Name, Date of Birth, or Customer ID
SELECT customerID AS 'Customer ID', firstName AS 'First Name', lastName AS 'Last Name', username AS 'Username', password AS 'Password', dateOfBirth AS 'Date of Birth', phoneNumber AS 'Phone', email AS 'Email', street AS 'Street', city AS 'City', state AS 'State', zip AS 'Zip', country AS 'Country'
FROM Customers WHERE firstName = :firstName_input OR lastName = :lastName_input OR dateOfBirth = :dateOfBirth_input OR customerID = :customerID_input;

-- Update a Customer
UPDATE Customers
SET firstName = :firstName_input, lastName = :lastName_input, phoneNumber = :phoneNumber_input, email = :email_input, street = :street_input, city = :city_input, state = :state_input, zip = :zip_input, country = :country_input
WHERE customerID = :customerID_input;

-- Delete a Customer
DELETE FROM Customers 
WHERE customerID = :customerID_input;



--   ORDERS PAGE

-- Display all Orders data in Orders page
SELECT orderID AS 'Order ID', customerID AS 'Customer ID', orderStatus AS 'Order Status', orderDate AS 'Order Date', shippedDate AS 'Shipped Date', storeID AS 'Store ID', payment AS 'Payment'
FROM Orders;

-- Add an Order 
INSERT INTO Orders (customerID, orderDate, storeID, payment)
VALUES (:customerID_input, :orderDate_input, :storeID_input, :payment_input);

-- Add order items to Details table
INSERT INTO Details (orderID, productID, quantity, price)
VALUES ((SELECT orderID FROM Orders WHERE customerID = customerID_input), :productID_input, :quantity_input,(SELECT price FROM Products WHERE productID = :productID_input));

-- Delete a detail row from details table
DELETE FROM Details 
WHERE customerID AND productID = :customerID_input, :productID_input;                                                                                                            
                                                                                                             
                                                                                                             
-- Search orders by Order ID, Customer ID, or OrderDate, 
SELECT orderID AS 'Order ID', customerID AS 'Customer ID', orderStatus AS 'Order Status', orderDate AS 'Order Date', shippedDate AS 'Shipped Date', storeID AS 'Store ID', payment AS 'Payment' 
FROM Orders WHERE orderID = :orderID_input OR customerID = :customerID_input OR orderDate = :orderDate_input;

 -- Search In Progress Orders 
SELECT orderID AS 'Order ID', customerID AS 'Customer ID', orderStatus AS 'Order Status', orderDate AS 'Order Date', shippedDate AS 'Shipped Date', storeID AS 'Store ID', payment AS 'Payment' 
FROM Orders WHERE orderStatus = 'In Progress';

 -- Search Completed Orders
SELECT orderID AS 'Order ID', customerID AS 'Customer ID', orderStatus AS 'Order Status', orderDate AS 'Order Date', shippedDate AS 'Shipped Date', storeID AS 'Store ID', payment AS 'Payment' 
FROM Orders WHERE orderStatus = 'Shipped';

--Update an Order
UPDATE Orders
SET orderStatus = :orderStatus_input, shippedDate = :shippedDate_input, payment = :payment_input
WHERE orderID = :orderID_input;

-- Delete an Order
DELETE FROM Orders 
WHERE orderID = :orderID_input;
                                                                                                             
                                                                                                             
-- Products
-- Display all products from products table

SELECT productID AS 'Product ID', productName AS 'Product Name', price AS 'Price',
 brand AS 'Brand', category AS 'Category', storeID as 'Store ID' FROM Products;

 -- Add a product

 INSERT INTO Products (productName, price, brand, category, storeID)
 VALUES (:productName_input, :price_input, :brand_input, :category_input, :storeID_input);
                                                                                                        
 -- Changes made for M:M relationship between Products and Locations
 -- Search for a product by Product ID, Product Name, Price, Brand, Category, Store
 SELECT  productID AS 'Product ID', productName AS 'Product Name', price AS 'Price',
 brand AS 'Brand', category AS 'Category', storeID as 'Store ID'
 FROM Products
 JOIN Locations ON Products.storeID = Locations.storeID                                                                                                            
 WHERE orderID = :orderID_input OR productName = :productName_input
 OR price = :price_input OR brand = :brand_input OR category = :category_input;

-- Update a product

UPDATE Products
SET productName = :productName_input, price = :price_input, brand = :brand_input,
category = :category_input,
WHERE productID = :productID_input;

-- Changes made for the M:M Deletion                                                                                                           --
-- Delete a product
DELETE FROM Products
WHERE productsID = :productsID_input AND storeID = :storeID_input;


--Locations                                                  
-- Display all the locations from the locations table

SELECT storeID AS 'Store ID', street AS 'Street', city AS 'City', state AS 'State',
zip AS 'Zip Code', country AS 'Country', phoneNumber AS 'Phone Number' FROM Locations;

-- Add a location

INSERT INTO Locations (street, city, state, zip, country, phoneNumber)
VALUES (:street_input, :city_input, :state_input, :zip_input, :country_input, :phoneNumber_input);

-- Search a location by store id, street, city, state, zip code, country, phone number

SELECT storeID AS 'Store ID', street AS 'Street', city AS 'City', state AS 'State',
zip AS 'Zip Code', country AS 'Country', phoneNumber AS 'Phone Number'
FROM Locations WHERE storeID = :storeID_input OR street = :street_input OR city = :city_input
OR state = state_input OR zip = :zip_input OR country = :country_input OR phoneNumber = :phoneNumber_input;

-- Update a Location

UPDATE Locations
SET street = :street_input, city = :city_input, state = state_input, zip = :zip_input,
country = :country_input, phoneNumber = :phoneNumber_input,
WHERE storeID = :storeID_input;

-- Delete a location

DELETE FROM Locations
WHERE storeID = :storeID_input;                                                                                                          

