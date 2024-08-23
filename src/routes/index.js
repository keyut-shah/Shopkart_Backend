import userRoutes from './userRoutes.js';


const routes = (app) => {
    console.log("inside the routes index js")

  app.use('/api/users', userRoutes);
  
  
};

export default routes;
