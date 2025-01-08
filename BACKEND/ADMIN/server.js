const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './config/.env' });
const path = require('path');  // Add this line to import the path module

const adminRoutes=require('../ADMIN/routes/adminRoutes');
const categoryRoutes = require('../ADMIN/routes/categoryRoutes');
const productRoutes = require('../ADMIN/routes/productRoutes');
const roleRoutes = require('./routes/roleRoutes'); // Added role routes

const app = express();
app.use(express.json());
app.use(cors());

app.use('/admin', adminRoutes);  // Routes for admin
    // Routes for users
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/roles', roleRoutes); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve static files from the uploads directory

const HTTP_PORT = process.env.HTTP_PORT || 6382;
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});
