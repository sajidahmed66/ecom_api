# E-com-API with node and mongo.

Discription: 

    something something really important.

# Tasks

  An E-commerce app will have the following features
    1. An user that can create a account(signUp) and logIn/signIn with the account credentials.
    2. An user will have a profile that he can add/update/delet personal information. an user will have only one profile.
    3. There will be category and sub-category of products.
    4. Product create/update/upload/delete/stockupdate can be done by admin.
    5. filter of product based on category/name/etc
        -query string
    
    6.shopping cart/ orders/checkouts/wishlists.

## Stacks Used:
    Node.js (environment:local,version:16.9.1 )
    npm (environment:local,version:7.21.1)
    express.js
    mongodb with mongoose

## Packages installed

    - Primary packages
        dotenv, express, morgan, bcrypt,jasonwebtoken, joi, lodash, cors and mongoose
    - express-async-errors
 

## Day: 01 21 november 2021:


  1. creation of usermodel userController and userRoutes for registration of user and logIn of user(all user will have a default role "user")

  2. for a better way to handle promise related error, a package 'express-async-error is used' and a global middleware is defined to check Promise related errors.

  3. written authorization middleware for token validation and role based authorization via midlleware.