const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, "Views", "add-product.html"));
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false
        // formsCSS: true,
        // productCSS: true,
        // activeAddProduct: true
    });
}

exports.postAddProduct = (req, res, next) => {
    // products.push({ title: req.body.title });
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // code with file system
    // const product = new Product(null, title, imageUrl, description, price);
    // product.save();
    //res.redirect("/");

    //code with mysql db
    // product.save().then(() => {
    //     res.redirect("/");
    // }).catch(err => console.log(err));

    //code with sequelize
req.user.createProduct({
    title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
})
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     // userId: req.user.id //manual method
    // })
    .then(result => {
        console.log('Created Product!');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
}
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // Product.findById(prodId, product => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Edit Product',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product,
    //     });
    // });

    //sequelize
req.user.getProducts({ where: {id: prodId}})
    // Product.findByPk(prodId)
    .then(products => {
        const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
            });
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    // const updatedProduct = new Product(
    //     prodId,
    //     updatedTitle,
    //     updatedImageUrl,
    //     updatedDesc,
    //     updatedPrice
    // );
    // updatedProduct.save();
    // res.redirect('/admin/products');

    //sequelize
    Product.findByPk(prodId).then(product => {
        product.title= updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product.save();
    }).then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    // console.log('shop.js',adminData.products);
    //   res.sendFile(path.join(rootDir, 'Views', 'shop.html'));
    // Product.fetchAll((products) => {
    //     res.render("admin/products", {
    //         prods: products,
    //         pageTitle: 'Admin Products',
    //         path: '/admin/products',
    //     });
    // });

    //sequelize
req.user.getProducts()
    // Product.findAll()
    .then(products => {
        res.render("admin/products", {
                    prods: products,
                    pageTitle: 'Admin Products',
                    path: '/admin/products',
                });
    }).catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.deleteById(prodId);
    Product.findByPk(prodId).then(product => {
        return product.destroy();
    }).then(result => {
        console.log('DESTROED PRODUCT!');
        res.redirect('/admin/products');
    })
    .catch(err  => console.log(err));
}