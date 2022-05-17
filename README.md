# Grapple Gears

>Note: This is a bootcamp project where a full stack web framework and React frontend was created.

## Web Application Framework and Backend Web Application for Admins

This is a web application framework built using ```Express.js```, ```Bookshelf.js``` and ```db-migrate``` for a Brazilian Jiu Jitsu (BJJ) e-commerce web application, Grapple Gears, as part of Trent Global College's Diploma in Web Application Development Project 3. The frontend interface was created with React and the repository can be found [here](https://github.com/nanometre/bjj-ecommerce-tgc-proj3-react).

## Index

1. [Context](#1-context)
2. [Database Design](#2-database-design)
3. [API Endpoints](#3-api-endpoints)
4. [Backend Web Application Structure and Features](#4-backend-web-application-structure-and-features)
5. [Technologies Used](#5-technologies-used)
6. [Acknowledgements](#6-acknowledgements)

## 1. Context

This is a web application framework and backend web application for admins for the [Grapple Gears](https://grapple-gears.netlify.app/) project. The framework has API to support the functionality of Grapple Gears React Frontend and uses ```Bookshelf.js``` and ```db-migrate``` to allow the ease of migration across different databases. The backend web application allows admins to manage the operations of the e-commerce web application which includes managing product listings, orders, and users. The API and web application for admins can be accessed [here](https://bjj-ecom-tgc-proj3-express.herokuapp.com/).


## 2. Database Design
### 2.1 Entity Relationship Diagram (ERD)
<img src="public\images\readme-images\grapple-gears-erd.png" style="display: block">
<br>

### 2.2 Logical Schema Diagram
<img src="public\images\readme-images\grapple-gears-logical-schema.png" style="display: block">
<br>

## 3. API Endpoints
Base API URL: ```https://bjj-ecom-tgc-proj3-express.herokuapp.com/api```
### 3.1 Orders
#### 3.1.1 Get the list of all orders of a given ```user_id``` (retrieved from JWT)
#### Request
```
GET /orders
```
#### Response
Returns an array of all orders (pending and completed order) made by a given ```user_id```

### 3.2 Products
#### 3.2.1 Get the list of all products 
#### Request
```
GET /products
```
#### Response
Returns an array of all products

#### 3.2.2 Get the list of all products based on search params
#### Request
```
POST /products
```
#### Response
Returns an array of all products which matches the search params

#### 3.2.3 Get the list of available materials, weaves, categories, and brands for search form selection
#### Request
```
GET /products/materials, GET /products/weaves, GET /products/categories, GET /products/brands
```
#### Response
Returns an array of available materials, weaves, categories, and brands from the database, respectively.

#### 3.2.4 Get the list of all variants of a given product
#### Request
```
GET /products/:product_id/variants
```
#### Response
Returns an array of all variants of a given product

### 3.3 Users
#### 3.3.1 Create a new user account
#### Request
```
POST /users/register
```
#### Response
Returns access and refresh JWT tokens on successful account creation

#### 3.3.2 Login an existing user account
#### Request 
```
POST /users/login
```
#### Response
Returns access and refresh JWT tokens on successful login

#### 3.3.3 Get user profile based on information retrieve from JWT
#### Request
```
GET /users/profile
```
#### Response
Returns user details

#### 3.3.4 Get new access JWT based on refresh JWT
#### Request
```
POST /users/refresh
```
#### Response
Returns new access JWT, if refresh JWT is valid

#### 3.3.5 Logout user account
#### Request
```
POST /users/logout
```
#### Response
Returns ```"Successfully logged out"`` on successful logout

### 3.4 Cart
#### 3.4.1 Get all cart items of a given ```user_id``` (retrieved from JWT)
#### Request
```
GET /cart
```
#### Response
Returns an array of cart items of a given ```user_id```

#### 3.4.2 Add product variant to a given ```user_id```'s cart
#### Request
The request takes a variable ```quantity``` in its body, which sets the quantity of product variant to be added to cart
```
POST /:variant_id/add
```
#### Response
Returns ```"XXX no. of variant ID: XXX added to cart"``` on success. 

#### 3.4.3 Update product variant quantity in a given ```user_id```'s cart
#### Request
The request takes a variable ```newQuantity``` in its body, which sets the new quantity of product variant in the cart
```
POST /:variant_id/quantity/update
```
#### Response
Returns ```"Updated quantity of variant ID: XXX to XXX in cart"``` on success. 

#### 3.4.4 Delete product variant of a given ```user_id```'s cart
#### Request
```
GET /:variant_id/delete
```
#### Response
Returns ```"Deleted variant ID: XXX from cart"``` on success. 

### 3.5 Checkout
#### 3.5.1 Create a Stripe checkout session
#### Request
```
GET /checkout
```
#### Response
Returns the Stripe session ID and Stripe publishable key

#### 3.5.2 
#### Request
```
POST /checkout/process_payment
```
#### Response
Stripe calls this API. On ```checkout.session.completed``` event, the API will delete the items from user's cart and create new order, order item(s) and address entries in the database.


## 4. Backend Web Application Structure and Features
### 4.1 Structure
The employees can only access the backend web application. There are 2 types of employees, the owner(s) and the manager(s). The owner(s) have access to all pages and the manager(s) have access to all pages except the ```users``` pages. All pages of the web application can be accessed through the side navigation bar. 

The image below shows a flowchart of how the different pages can be accessed. The pages in the red box can only be accessed by the owner(s)

<img src="public\images\readme-images\site-map-be.jpg" style="display: block">
<br>

### 4.2 Wireframe
The wireframes for mobile and laptop display for the backend web application can be accessed [here](https://benedict19472.invisionapp.com/freehand/Wireframe--TGC-Proj-3--mXGLRhfsr?dsid_h=9f01afd460f4abe049266bb426a246b6674b778867a010bd8e6045c7b243d429&uid_h=5a1828007a271c9d5497b0558b46e0ef2ead753c17efbedf4d212e9bec42337b)

### Features
Features                                  | Descriptions
----------------------------------------- | -------------
Login for employees                       | Only allow employees to access the backend admin web application.
Management of products and its variants   | Search products and CRUD operations on products and its variants.
Management of orders                      | Search orders and RUD operations on orders. Create operation of orders is done by the server on successful checkout from Stripe. The admins do not create directly create an order.
Management of users                       | RUD operations on users for owner only. Create operation of users is done by the server when a customer register for an account. The admins do not directly create a user.

## 5. Technologies Used

Technology                                                                                | Description
----------------------------------------------------------------------------------------  | -----------
[Bookshelf.js](https://bookshelfjs.org/)                                                  | JavaScript ORM used for querying and forming relationship in the project's database
[cloudinary](https://cloudinary.com/)                                                     | Image hosting service used to upload and store the project's images
[connect-flash](https://github.com/jaredhanson/connect-flash)                             | Middleware to enable flash messages for Express.js
[cors](https://expressjs.com/en/resources/middleware/cors.html)                           | Middleware to enable CORS for Express.js
[csurf](https://expressjs.com/en/resources/middleware/csurf.html)                         | Middleware to enable CSRF for Express.js
[db-migrate](https://github.com/db-migrate)                                               | Database migration framework for node.js, allowing for easy database migrations.
[Express.js](https://expressjs.com/)                                                      | The API uses Express.js, a fast, unopinionated, minimalist web framework for Node.js. CRUD for the database was created using the framework.
[express-async-errors](https://github.com/davidbanham/express-async-errors)               | Handles async errors in Express.js
[express-session](https://expressjs.com/en/resources/middleware/session.html)             | Middleware to create sessions on Express.js
[forms](https://github.com/caolan/forms)                                                  | Forms framework for node.js
[hbs](https://handlebarsjs.com/)                                                          | Template framework for Express.js view engine
[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)                                | JWT implementation for node.js
[knex](https://github.com/knex/knex)                                                      | Query builder for PostgreSQL, MySQL, CockroachDB, SQL Server, SQLite3 and Oracle on node.js
[mysql](https://github.com/mysqljs/mysql)                                                 | Node.js JavaScript Client implementing the MySQL protocol
[nodemon](https://nodemon.io/)                                                            | Utility to monitor any changes in source and automatically restart the server
[session-file-store](https://github.com/valery-barysok/session-file-store)                | Provision for storing session data in the session file in node.js
[stripe](https://stripe.com/)                                                             | Payment processing service
[wax-on](https://github.com/keithws/wax-on)                                               | Support to Handlebars for template inheritance with the 'block' and 'extends' helpers.

## 6. Acknowledgements
- Web layouts are inspired by [MDBootstrap](https://mdbootstrap.com/)

- Images and videos are taken from [Nick Lim (Carpe Diem BJJ Singapore)](https://instagram.com/nickycdbjj?igshid=YmMyMTA2M2Y=), Lachlan McAdam, [Progress JJ](https://progressjj.co.uk/), and [Scramble Brand](https://scramblestuff.com/).

- YouTube and Stack Overflow community for guidance on various issues faced.