import userRoutes from './userRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import productRoutes from './productRoutes.js'
const routes = (app) => {
    console.log("inside the routes index js")

  app.use('/api/users', userRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/products',productRoutes);
  
};

export default routes;
