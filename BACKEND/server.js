const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './config/.env' });

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const roleRoutes = require('./routes/roleRoutes'); // Added role routes

const app = express();
app.use(express.json());
app.use(cors());

app.use('/admin', adminRoutes);  // Routes for admin
app.use('/user', userRoutes);    // Routes for users
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/roles', roleRoutes);   // Routes for roles

const HTTP_PORT = process.env.HTTP_PORT || 6382;
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});
