/*
  Seeder script for sample categories and products.
  Usage:
    1. Create a file named .env.local at project root with MONGO_URI (see .env.local.example).
    2. From project root run: `npm install dotenv mongoose` (if not installed)
    3. Run: `node scripts/seed.js`
*/

const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is required in .env.local');
  process.exit(1);
}

const categorySchema = new mongoose.Schema({ name: String }, { timestamps: true });
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  image: String,
  stock: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function main() {
  await mongoose.connect(MONGO_URI, { dbName: 'myshop' });
  console.log('Connected to DB');

  await Category.deleteMany({});
  await Product.deleteMany({});

  const categories = await Category.create([
    { name: 'Electronics' },
    { name: 'Clothing' }
  ]);

  const products = [
    {
      title: 'Wireless Headphones',
      description: 'Comfortable wireless headphones with noise cancellation.',
      price: 99.99,
      image: 'https://via.placeholder.com/400x300?text=Headphones',
      stock: 15,
      category: categories[0]._id
    },
    {
      title: 'T-Shirt',
      description: '100% cotton tee',
      price: 19.99,
      image: 'https://via.placeholder.com/400x300?text=T-Shirt',
      stock: 50,
      category: categories[1]._id
    }
  ];

  await Product.create(products);
  console.log('Seed data created');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
