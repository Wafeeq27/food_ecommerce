require('dotenv').config();
const mongoose = require('mongoose');

const updateDB = async () => {
  try {
    let finalUri = process.env.MONGO_URI;
    if (!finalUri) {
      console.log('No MONGO_URI, relying on memory server logic is not possible here. Please ensure a DB is running.');
      return;
    }
    
    await mongoose.connect(finalUri);
    console.log('Connected to DB to update images...');
    
    const Product = require('./models/Product');
    const products = await Product.find({});
    
    for (let product of products) {
      if (product.name.includes('Curry Cut')) product.image = 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      else if (product.name.includes('Keema')) product.image = 'https://images.unsplash.com/photo-1599577902998-33306917cba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      else if (product.name.includes('Biryani Cut')) product.image = 'https://images.unsplash.com/photo-1598514981881-2292f7dc2a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      else if (product.name.includes('Nalli')) product.image = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      else if (product.name.includes('Chops')) product.image = 'https://images.unsplash.com/photo-1602491453631-e2a5fc836dea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      else product.image = 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=800&q=80';
      
      await product.save();
    }
    
    console.log('Successfully updated images for all existing products!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateDB();
