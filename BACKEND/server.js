const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './config/.env' });
const path = require('path');  // Add this line to import the path module


const UserRoutes=require('../BACKEND/routes/user/userRoutes');
const ProductRoutes=require('../BACKEND/routes/user/productRoutes');
const CartRoutes=require('../BACKEND/routes/user/cartRoutes');
const OrderRoutes=require('../BACKEND/routes/user/orderRoutes');
const adminRoutes=require('../BACKEND/routes/admin/adminRoutes');
const productRoutes=require('../BACKEND/routes/admin/productRoutes');
const categoryRoutes=require('../BACKEND/routes/admin/categoryRoutes');
const roleRoutes=require('../BACKEND/routes/admin/roleRoutes');
const orderRoutes=require('../BACKEND/routes/admin/orderRoutes');

const app = express();

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  console.log(`Requested URL: ${req.method} ${req.originalUrl}`);
  next();  
});

app.use('/admin', adminRoutes);  // Routes for admin
    // Routes for users
app.use('/orders',orderRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/roles', roleRoutes); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/user', UserRoutes);
app.use('/product', ProductRoutes);
app.use('/cart', CartRoutes);
app.use('/order', OrderRoutes);
  // Serve static files from the uploads directory

const HTTP_PORT = process.env.HTTP_PORT || 6382;
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});
