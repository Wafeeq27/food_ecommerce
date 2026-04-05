require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
  if (!process.env.MONGO_URI) return console.log('MONGO_URI is missing');
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({});
  for (const p of products) {
    if (p.name.includes('Curry')) p.image = '/images/curry_cut.png';
    else if (p.name.includes('Keema')) p.image = '/images/keema.png';
    else if (p.name.includes('Biryani')) p.image = '/images/biryani.png';
    else if (p.name.includes('Nalli')) p.image = '/images/nalli.png';
    else if (p.name.includes('Chops')) p.image = '/images/chops.png';
    else p.image = '/images/hero.png';
    await p.save();
  }
  console.log('Database product image URIs updated to local paths successfully!');
  process.exit();
}
run();
