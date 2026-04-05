require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Configure Database Connection
const connectDB = async () => {
  let finalUri = process.env.MONGO_URI;

  try {
    await mongoose.connect(finalUri);
    console.log('MongoDB connected successfully to', finalUri);
  } catch (err) {
    console.warn("\n=======================================================");
    console.warn("WARNING: Failed to connect to the standard MongoDB database.");
    console.warn("Falling back to an in-memory MongoDB database for testing!");
    console.warn("=======================================================\n");

    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    finalUri = mongoServer.getUri();
    await mongoose.connect(finalUri);
    console.log('In-Memory MongoDB connected successfully at', finalUri);
  }

  // Seed default products if DB is completely empty
  try {
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Seeding default Khaleel Bhai menu...');
      const defaultProducts = [
        { name: 'Mutton Curry Cut', price_per_kg: 850, description: 'Perfectly sized chunks of tender mutton on the bone, ideal for rich curries.', image: '/images/curry_cut.png' },
        { name: 'Mutton Keema (Minced)', price_per_kg: 950, description: 'Finely ground premium mutton, great for kebabs, samosas, and kheema pav.', image: '/images/keema.png' },
        { name: 'Mutton Biryani Cut', price_per_kg: 880, description: 'Large, succulent pieces of mutton custom cut for authentic Indian biryanis.', image: '/images/biryani.png' },
        { name: 'Mutton Nalli (Bones)', price_per_kg: 700, description: 'Marrow-rich bones perfect for slow-cooked Paya soup and Nihari.', image: '/images/nalli.png' },
        { name: 'Mutton Chops', price_per_kg: 900, description: 'Tender rib chops that cook quickly, excellent for grilling or pan-frying.', image: '/images/chops.png' }
      ];
      await Product.insertMany(defaultProducts);
      console.log('Default menu seeded successfully!');
    }

    // Seed admin if missing
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('No admin found. Seeding default admin account...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Shop Manager',
        email: 'admin@khaleel.com',
        password: hashedPassword,
        phone: '0000000000',
        role: 'admin'
      });
      console.log('Admin seeded (admin@khaleel.com / admin123)');
    }
  } catch (seedErr) {
    console.error('Failed to seed DB:', seedErr);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Online Mutton Shop API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
