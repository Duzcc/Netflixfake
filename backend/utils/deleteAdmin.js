import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const deleteAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@netflixfake.com';

        await User.deleteOne({ email: adminEmail });
        console.log(`✅ Deleted admin: ${adminEmail}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteAdmin();
