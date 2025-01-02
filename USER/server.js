const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: 'D:\\BackendEcommerce\\Ecommerce\\USER\\BACKEND\\config\\.env' });

const UserRoutes=require('./BACKEND/routes/userRoutes.js');
const ProductRoutes=require('./BACKEND/routes/productRoutes.js');

const app = express();
app.use(express.json());
app.use(cors());

 // Routes for admin
app.use('/user', UserRoutes);  
app.use('/product',ProductRoutes)  ;

const port= 4000;
app.listen(4000, () => {
  console.log(`Server running on port ${port}`);
});
