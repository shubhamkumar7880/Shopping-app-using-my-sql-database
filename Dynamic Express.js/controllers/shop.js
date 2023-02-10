// const products = [];
const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
    // console.log('shop.js',adminData.products);
    //   res.sendFile(path.join(rootDir, 'Views', 'shop.html'));

    // for file system, without databse

    // Product.fetchAll((products) => {
    //     res.render("shop/product-list", {
    //         prods: products,
    //         pageTitle: 'All Products',
    //         path: '/products',
    //     });
    // });

    // for databse

    // Product.fetchAll().then(([rows, fieldData]) => {
    //     res.render("shop/product-list", {
    //         prods: rows,
    //         pageTitle: 'All Products',
    //         path: '/products',
    //     });
    // }).catch(err => console.log(err));

    // for sequelize

    Product.findAll().then(products => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    }).catch(err => {
        console.log(err);
    });

}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    // code with fs

    // Product.findById(prodId, product => {
    //     res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    // });

    //code with db
    // Product.findById(prodId,).then(([product]) => {
    //     res.render('shop/product-detail', { product: product[0], pageTitle: product[0].title, path: '/products' });
    // }).catch(err => console.log(err));

    //code with sequelize

    Product.findByPk(prodId,).then((product) => {
        res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    }).catch(err => console.log(err));

    //another aprroach(sequlize)

    // Product.findAll({where:{id: prodId}}).then((product) => {
    //     res.render('shop/product-detail', { product: product[0], pageTitle: product[0].title, path: '/products' });
    // }).catch(err => console.log(err));

};

exports.postCart = (req, res, next) => {
     // for file system, without databse
    // const prodId = req.body.productId;
    // Product.findById(prodId, (product) => {
    //     Cart.addProduct(prodId, product.price);
    // })
    // res.redirect('/cart');

    // for sequelize db
      const prodId = req.body.productId;
      let fetchedCart;
      let newQuantity = 1;
      req.user
      .getCart()
      .then(cart =>{
        fetchedCart = cart;
        return cart.getProducts({where: {id:prodId}});
      })
      .then(products => {
        let product;
        if(products.length > 0){
            product = products[0];
        }
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {quantity: newQuantity}
            })
        .catch(err => console.log(err));
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {

    // for file system, without databse

    // Product.fetchAll((products) => {
    //     res.render("shop/index", {
    //         prods: products,
    //         pageTitle: 'Shop',
    //         path: '/',
    //         hasProducts: products.length > 0,
    //         activeShop: true,
    //         productCSS: true,
    //     });
    // });

    // for mysql databse

    // Product.fetchAll().then(([rows, fieldData]) => {
    //     res.render("shop/index", {
    //         prods: rows,
    //         pageTitle: 'Shop',
    //         path: '/',
    //     });
    // }).catch(err => console.log(err));

    //for sequeliuze
    Product.findAll().then(products => {
        res.render("shop/index", {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    }).catch(err => {
        console.log(err);
    });

}

exports.getCart = (req, res, next) => {
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for (product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty });
    //             }
    //         }
    //         res.render("shop/cart", {
    //             pageTitle: 'Your Cart',
    //             path: '/cart',
    //             products: cartProducts
    //         });
    //     });
    // });

    // sequelize db

    req.user
     .getCart()
     .then(cart => {
       return cart.getProducts()
       .then(products => {
        res.render("shop/cart", {
                        pageTitle: 'Your Cart',
                        path: '/cart',
                        products: products
                    });
       }).catch(err => console.log(err));
     })
     .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // sequlize db
    req.user.getCart().then(cart => {
        return cart.getProducts({where: {id : prodId}});
    })
    .then(products => {
        const product = products[0];
       return product?.cartItem.destroy()
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
    // Product.findById(prodId, product => {
    //     Cart.deleteProduct(prodId, product.price);
    //     res.redirect('/cart');
    // })
};

exports.getOrders = (req, res, next) => {
    req.user
    .getOrders({include: ['products']})
    .then(orders => {
        res.render("shop/orders", {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        });
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
req.user
    .getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    }).then(products => {
        return req.user
            .createOrder()
            .then(order => {
                return order.addProduct(products.map(product => {
                    product.orderItem = {quantity: product.cartItem.quantity};
                    return product;
                }))
            })
            .catch(err => console.log(err));
    })
    .then(result => {
        return fetchedCart.setProducts(null);
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err))
}
