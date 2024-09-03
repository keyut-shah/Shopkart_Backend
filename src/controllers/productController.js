import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

const generateUniqueProductId = async () => {
  let productId;
  let isUnique = false;
  while (!isUnique) {
    productId = `PROD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const existingProduct = await Product.findOne({ productId });
    if (!existingProduct) {
      isUnique = true;
    }
  }
  return productId;
};


const createProduct = asyncHandler(async (req, res) => {
  console.log("inside create product");
  console.log("req body is ",req.body);
  try {
    const productData = {
      productId: req.body.productId,
      name: req.body.name,
      description: req.body.description,
      price: {
        amount: req.body.price.amount,
        currency: req.body.price.currency || "INR",
      },
      discount: {
        amount: req.body.discount?.amount || 0,
        percentage: req.body.discount?.percentage || 0,
        validFrom: req.body.discount?.validFrom,
        validTo: req.body.discount?.validTo,
      },
      category: req.body.category,
      gender: req.body.gender,
      size: req.body.size,
      color: req.body.color,
      brand: req.body.brand,
      stock: req.body.stock || 0,
      availability: req.body.availability,
      ratings: req.body.ratings || 0,
      numOfReviews: req.body.numOfReviews || 0,
      owner: req.user._id,
    };
    console.log("product data is ", productData);
    let imageUrls = [];
    console.log("req.files value ",req.files);
    
    // return res.send(req.files);
    // not able to upload multiple files


    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        imageUrls.push(result.secure_url);
      }
    }
    const product_Id = await generateUniqueProductId();
    productData.productId = product_Id;

    productData.images = imageUrls;

    const newProduct = new Product(productData);

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });

    console.log(error);
  }
});
const updateProduct = asyncHandler(async (req, res) => {
  console.log("Inside the update product method");
  try {
    const { productId } = req.params; // Extract productId from the request parameters
    const { 
      name, 
      description, 
      price, 
      discount, 
      category, 
      gender, 
      size, 
      color, 
      brand, 
      stock, 
      availability, 
      ratings, 
      numOfReviews 
    } = req.body;

    // Find the product using productId instead of _id
    const existingProduct = await Product.findOne({ productId });
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user is the product owner
    if (existingProduct.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You don\'t have permission to edit this product' });
    }

    // Update product fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (price) updateFields.price = price;
    if (discount) updateFields.discount = discount;
    if (category) updateFields.category = category;
    if (gender) updateFields.gender = gender;
    if (size) updateFields.size = size;
    if (color) updateFields.color = color;
    if (brand) updateFields.brand = brand;
    if (stock !== undefined) updateFields.stock = stock;
    if (availability) updateFields.availability = availability;
    if (ratings !== undefined) updateFields.ratings = ratings;
    if (numOfReviews !== undefined) updateFields.numOfReviews = numOfReviews;

    // Update existingProduct with new fields
    Object.assign(existingProduct, updateFields);

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        imageUrls.push(result.secure_url);
      }
    }

    // Update images field if new images are uploaded
    if (imageUrls.length > 0) {
      existingProduct.images = imageUrls;
    }

    // Save the updated product
    await existingProduct.save();

    res.status(200).json({ message: 'Product updated successfully', product: existingProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by productId and exclude the owner field
    const product = await Product.findOne({ productId }).select('-owner'); // Excludes the 'owner' field

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product fetched successfully', product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by productId
    const product = await Product.findOne({ productId });

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user is the product owner or has admin privileges
    if (product.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "You don't have permission to delete this product" });
    }

    // Delete the product
    await Product.findOneAndDelete({ productId });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});




export { createProduct,updateProduct ,getProductById , deleteProduct};
