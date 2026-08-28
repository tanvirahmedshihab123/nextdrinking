// seedAdmin.js
import 'dotenv/config';
import { connectDB } from './config/mongodb.js';
import User from './models/User.js';

const run = async () => {
  try {
    await connectDB();

    const email = 'admin@supershop.com';      // <-- change if you want
    const password = '123045';              // <-- change if you want

    const existing = await User.findOne({ email });

    if (existing) {
      console.log('✅ Admin already exists:', existing.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Super Admin',
      email,
      password,
      role: 'admin'
    });

    console.log('✅ Admin user created:');
    console.log('Email:', admin.email);
    console.log('Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed admin:', err.message);
    process.exit(1);
  }
};

run();
