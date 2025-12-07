import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        // Admin credentials
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@netflixfake.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
        const adminName = process.env.ADMIN_NAME || 'Administrator';

        // Check if admin already exists
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin account already exists!');
            console.log(`Email: ${adminEmail}`);
            process.exit(0);
        }

        // Create admin account
        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            isAdmin: true,
            isVerified: true,
            accountStatus: 'active', // Admin doesn't need approval
        });

        console.log('✅ Admin account created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`👤 Name: ${admin.name}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log(`🛡️  Role: ${admin.role}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
