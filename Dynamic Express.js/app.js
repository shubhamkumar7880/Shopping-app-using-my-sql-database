const express = require("express");
const path = require("path");
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const bodyParser = require("body-parser");
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');

// code for mysql db
// const db = require('./util/database');
// db.execute('SELECT * FROM products').then(result => {
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// })

// code for sequelize

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
// app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs' }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) =>{
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
Product.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});


sequelize
// .sync({force: true})
.sync()
.then(result => {
return User.findByPk(1);
})
.then(user => {
    if(!user){
        return User.create({name: 'Subham', email: 'test@test.com'});
    }
    return user;
}).then(user => {
    // console.log(user);
   return user.createCart();
})
.then(user => {
    // console.log(user);
    app.listen(3000);
})
    .catch(err => {
        console.log(err)
    });
