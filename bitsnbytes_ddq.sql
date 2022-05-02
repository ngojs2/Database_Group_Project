-- Group 40
-- Project Step 4 Draft Version
-- Data Definition Queries


-- Create Customers Table
CREATE TABLE Customers (
    `customerID` int(9) AUTO_INCREMENT NOT NULL,
    `firstName` varchar(25) NOT NULL,
    `lastName` varchar(25) NOT NULL,
    `username` varchar(25) NOT NULL,
    `password` varchar(25) NOT NULL,
    `dateOfBirth` date NOT NULL,
    `phoneNumber` varchar(15) NOT NULL,
    `email` varchar(30) NOT NULL,
    `street` varchar(25) NOT NULL,
    `city` varchar(25) NOT NULL,
    `state` varchar(2),
    `zip` varchar(10) NOT NULL,
    `country` varchar(25) NOT NULL,
    PRIMARY KEY (`customerID`)
);


-- Create Orders Table
CREATE TABLE Orders (
    `orderID` int(7) AUTO_INCREMENT NOT NULL,
    `customerID` int NOT NULL,
    `orderStatus` varchar(20) NOT NULL,
    `orderDate` date NOT NULL,
    `shippedDate` date,
    `storeID` int NOT NULL,
    `payment` decimal NOT NULL,
    PRIMARY KEY (`orderID`),
    CONSTRAINT fk_orders_customerID
    FOREIGN KEY (`customerID`) REFERENCES Customers(`customerID`) ON DELETE CASCADE
);

-- create a table for locations

CREATE TABLE Locations (
    storeID int(11) NOT NULL UNIQUE AUTO_INCREMENT,
    street varchar(25) NOT NULL,
    city varchar(25) NOT NULL,
    state varchar(2) NOT NULL,
    zip varchar(10) NOT NULL,
    country varchar(25) NOT NULL,
    phoneNumber varchar(25) NOT NULL,
    PRIMARY KEY (storeID)
) ENGINE=InnoDB;

-- create a table for products

CREATE TABLE Products (
    productID int(11) NOT NULL UNIQUE AUTO_INCREMENT,
    productName varchar(25) NOT NULL,
    price decimal NOT NULL,
    brand varchar(25) NOT NULL,
    category varchar(25) NOT NULL,
    storeID int,
    PRIMARY KEY (productID),
    CONSTRAINT fk_products_storeID
    FOREIGN KEY (storeID) REFERENCES Locations (storeID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- create a table for details

CREATE TABLE Details (
    orderID int NOT NULL,
    productID int NOT NULL,
    quantity int NOT NULL,
    CONSTRAINT fk_details_orderID
    FOREIGN KEY (orderID) REFERENCES Orders (orderID) ON DELETE CASCADE,
    CONSTRAINT fk_details_productID
    FOREIGN KEY (productID) REFERENCES Products (productID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sample Customers Data

INSERT INTO Customers (`customerID`, `firstName`, `lastName`, `username`, `password`, `dateOfBirth`, `phoneNumber`, `email`, `street`, `city`, `state`, `zip`, `country`) 
VALUES ('900000000', 'John', 'Doe', 'jdoe', '12345', '1980-01-01', '(123) 555-0909', 'jdoe@email.com', '123 Foggy Street', 'Riverview', 'CA', '90001', 'US');

INSERT INTO Customers (`firstName`, `lastName`, `username`, `password`, `dateOfBirth`, `phoneNumber`, `email`, `street`, `city`, `state`, `zip`, `country`) 
VALUES
('Jane', 'Doe', 'jane5', '67890', '1980-12-12', '(123) 555-7851', 'jane5@email.com', '123 Foggy Street', 'Riverview', 'CA', '90001', 'US'),
('Peter', 'Parker', 'spidey', '12345', '1993-08-27', '(555) 123-4567', 'spidey@email.com', '20 Ingram Street', 'Queens', 'NY', '11375', 'US'),
('Tony', 'Stark', 'ironman', '9999', '1970-05-29', '(444) 456-3247', 'ironman@email.com', '10880 Malibu Point', 'Malibu', 'CA', '90265', 'US'),
('Bruce', 'Wayne', 'batman', '00000', '1963-02-19', '(111) 879-1236', 'batman@email.com', '1007 Mountain Drive', 'Gotham City', '', '90028', 'US'),
('Carol', 'Danvers', 'capmarvel', 'abc123', '1970-04-24', '(555) 654-9876', 'marvel@email.com', '555 Scenic Street', 'Boston', 'MA', '02108', 'US');


-- Sample Orders Data

INSERT INTO Orders (`orderID`, `customerID`, `orderStatus`, `orderDate`, `shippedDate`, `storeID`, `payment`) 
VALUES ('1000000', (SELECT `customerID` FROM `Customers` WHERE `firstName` = 'John' AND `lastName` = 'Doe'), 'Shipped', '2020-03-03', '2020-03-06', '6', '123456789');

INSERT INTO Orders (`customerID`, `orderStatus`, `orderDate`, `shippedDate`, `storeID`, `payment`) 
VALUES
((SELECT `customerID` FROM `Customers` WHERE `firstName` = 'Jane' AND `lastName` = 'Doe'), 'Shipped', '2020-03-05', '2020-03-07', '5', '987654321'),
((SELECT `customerID` FROM `Customers` WHERE `firstName` = 'Peter' AND `lastName` = 'Parker'), 'Shipped', '2020-04-09', '2020-04-11', '1', '759132648'),
((SELECT `customerID` FROM `Customers` WHERE `firstName` = 'Tony' AND `lastName` = 'Stark'), 'Shipped', '2020-05-10', '2020-05-15', '5', '315974268'),
((SELECT `customerID` FROM `Customers` WHERE `firstName` = 'Bruce' AND `lastName` = 'Wayne'), 'In Progress', '2020-05-13', NULL, '2', '987654321'),
((SELECT `customerID` FROM `Customers` WHERE `firstName` = 'Carol' AND `lastName` = 'Danvers'), 'In Progress', '2020-05-14', NULL, '4', '789123456');

-- insert data into Locations table

INSERT INTO Locations (street, city, state, zip, country, phoneNumber)
VALUES ('1234 Silicon Valley', 'San Jose', 'CA', '95113', 'US', '408-123-4567');

INSERT INTO Locations (street, city, state, zip, country, phoneNumber)
VALUES ('910 City Street', 'San Francisco', 'CA', '94105', 'US', '415-987-6543');

INSERT INTO Locations (street, city, state, zip, country, phoneNumber)
VALUES ('5678 Palm Tree', 'Los Angeles', 'CA', '90012', 'US', '213-345-6789');

INSERT INTO Locations (street, city, state, zip, country, phoneNumber)
VALUES ('123 Technology St', 'San Jose', 'CA', '95112', 'US', '123-456-7890');

INSERT INTO Locations (street, city, state, zip, country, phoneNumber)
VALUES ('OSU', 'Corvallis', 'OR', '12345', 'US', '123-123-1234');

INSERT INTO Locations (street, city, state, zip, country, phoneNumber)
VALUES ('9876 Manhattan', 'New York City', 'NY', '98765', 'US', '987-654-3210');

-- insert data into products table

INSERT INTO Products (storeID, brand, productName, price, category)
VALUES((SELECT storeID FROM Locations WHERE storeID='1'),
'Apple', 'MacBook', '1999.99', 'Laptop');

INSERT INTO Products (storeID, brand, productName, price, category)
VALUES((SELECT storeID FROM Locations WHERE storeID='2'),
 'LG', '65" OLED 4K TV', '2599.99', 'TV');

INSERT INTO Products (storeID, brand, productName, price, category)
VALUES((SELECT storeID FROM Locations WHERE storeID='3'),
'Dell', 'Desktop Computer', '999.99', 'Computer');

INSERT INTO Products (storeID, brand, productName, price, category)
VALUES((SELECT storeID FROM Locations WHERE storeID='3'),
'Sony', 'PS4 Pro', '400', 'Games');

INSERT INTO Products (storeID, brand, productName, price, category)
VALUES((SELECT storeID FROM Locations WHERE storeID='1'),
'Sony', 'a7R III', '2799.99', 'Camera');

INSERT INTO Products (storeID, brand, productName, price, category)
VALUES((SELECT storeID FROM Locations WHERE storeID=''),
'Apple', 'iPhone', '999.99', 'Phones');


-- insert data into details table

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000000','1','1');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000000','2','5');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000000','3','3');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000001','4','1');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000001','3','2');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000002','1','1');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000002','4','1');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000002','2','4');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000003','4','4');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000003','1','3');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000004','1','1');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000004','2','3');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000005','1','1');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000005','2','2');

INSERT INTO Details (orderID, productID, quantity)
VALUES ('1000005','3','6');
