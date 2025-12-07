# 🎬 Netflix Clone - Backend API

Complete backend API for a Netflix-style streaming platform built with Node.js, Express, MongoDB, and modern best practices.

## 🚀 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Email verification with Nodemailer
- ✅ Admin approval workflow
- ✅ Password reset functionality
- ✅ Role-based access control (User/Admin)
- ✅ Premium user tier system

### Movie & Content Management
- ✅ Full CRUD operations for movies
- ✅ TMDb API integration
- ✅ Movie import from TMDb with automatic data mapping
- ✅ Advanced search and filtering
- ✅ Category management
- ✅ Review system with ratings

### User Features
- ✅ Watchlist management
- ✅ Watch history tracking
- ✅ Favorite movies
- ✅ User profiles
- ✅ Ban/unban functionality (admin)

### Payment Integration
- ✅ Stripe checkout sessions
- ✅ Webhook handling
- ✅ Premium subscription management

### Cloud Storage
- ✅ Cloudinary integration
- ✅ Image upload with validation
- ✅ Video upload with transcoding
- ✅ File management (delete)

### Security
- ✅ Helmet (HTTP headers)
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ XSS protection
- ✅ NoSQL injection prevention
- ✅ Input validation & sanitization
- ✅ HPP (HTTP Parameter Pollution)

### Documentation
- ✅ Swagger/OpenAPI 3.0
- ✅ Comprehensive API docs
- ✅ Interactive API explorer

---

## 📋 Prerequisites

- **Node.js** >= 18.x
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Required API Keys
- TMDb API Key ([Get it here](https://www.themoviedb.org/settings/api))
- Stripe Secret Key ([Stripe Dashboard](https://dashboard.stripe.com))
- Cloudinary Credentials ([Cloudinary Console](https://cloudinary.com/console))
- Gmail App Password (for email verification)

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Netflixfake/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the backend directory:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/netflixo
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/netflixo

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# TMDb API
TMDB_API_KEY=your_tmdb_api_key_here

# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Frontend URLs
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Account (for seeding)
ADMIN_EMAIL=admin@netflixfake.com
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Administrator
```

### 4. Seed Admin User (Optional)
```bash
npm run seed:admin
```

---

## 🏃 Running the Server

### Development Mode
```bash
npm run dev:server
# Server runs on http://localhost:5001
```

### Production Mode
```bash
npm start
```

### With Frontend (Concurrent)
```bash
npm run dev
# Runs both backend and frontend concurrently
```

---

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5001/api/docs`
- **Health Check**: `http://localhost:5001/health`
- **Root**: `http://localhost:5001/`

### API Base URLs
- **v1**: `http://localhost:5001/api/v1/*`
- **Legacy** (deprecated): `http://localhost:5001/api/*`

---

## 🛠️ API Endpoints Overview

### Authentication (`/api/v1/users`)
```
POST   /               - Register new user
POST   /login          - Login user
POST   /forgot-password - Request password reset
PUT    /reset-password/:token - Reset password
GET    /verify-email/:token   - Verify email
POST   /resend-verification   - Resend verification email
GET    /profile        - Get user profile (Protected)
PUT    /profile        - Update profile (Protected)
PUT    /password       - Change password (Protected)
```

### Movies (`/api/v1/movies`)
```
# Public
GET    /popular        - Get popular movies from TMDb
GET    /top-rated      - Get top rated movies
GET    /search         - Search movies
GET    /genres         - Get all genres
GET    /discover       - Discover movies by genre
GET    /:id            - Get movie details
GET    /:id/similar    - Get similar movies

# Protected
POST   /:id/reviews    - Add movie review
PUT    /:id/reviews    - Update review
DELETE /:id/reviews    - Delete review

# Admin Only
GET    /               - Get all movies (with filters)
POST   /               - Create movie
PUT    /:id            - Update movie
DELETE /:id            - Delete movie
POST   /import         - Import movie from TMDb
```

### Upload (`/api/v1/upload`)
```
POST   /image          - Upload image (Protected)
POST   /video          - Upload video (Admin)
DELETE /:publicId      - Delete file (Admin)
```

### Payment (`/api/v1/payment`)
```
POST   /create-checkout-session - Create Stripe checkout
POST   /webhook                 - Stripe webhook handler
```

### Watchlist (`/api/v1/watchlist`)
```
GET    /               - Get user watchlist
POST   /               - Add to watchlist
DELETE /:movieId       - Remove from watchlist
```

### Watch History (`/api/v1/history`)
```
GET    /               - Get watch history
POST   /               - Add to history
DELETE /:movieId       - Remove from history
DELETE /               - Clear all history
```

---

## 🧪 Testing

### Run Existing Tests
```bash
# Test admin registration flow
./test_admin_registration.sh

# Test favorites
./test_favorites.sh

# Test watchlist
./test_watchlist.sh

# Test TMDb import
./test_tmdb_import.sh

# Test upload functionality
./test_uploads.sh
```

### Manual Testing with cURL

#### Register User
```bash
curl -X POST http://localhost:5001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:5001/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

#### Import Movie from TMDb
```bash
curl -X POST http://localhost:5001/api/v1/movies/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tmdbId":550}'
```

---

## 🔒 Security Best Practices

1. **Always use HTTPS in production**
2. **Never commit `.env` files**
3. **Use strong JWT secrets** (minimum 32 characters)
4. **Enable rate limiting** in production
5. **Restrict CORS** to specific domains
6. **Use environment-specific configs**
7. **Regular security audits** with `npm audit`

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   ├── db.js              # MongoDB connection
│   └── swagger.js         # Swagger documentation config
├── controllers/
│   ├── userController.js  # User & auth logic
│   ├── movieController.js # Movie CRUD & TMDb
│   ├── uploadController.js# File uploads
│   ├── paymentController.js # Stripe integration
│   └── ...
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   ├── validationMiddleware.js # Input validation
│   ├── uploadMiddleware.js   # Multer config
│   ├── errorMiddleware.js    # Error handling
│   └── premiumMiddleware.js  # Premium checks
├── models/
│   ├── User.js            # User schema
│   ├── Movie.js           # Movie schema
│   ├── Watchlist.js       # Watchlist schema
│   ├── WatchHistory.js    # History schema
│   └── ...
├── routes/
│   ├── userRoutes.js
│   ├── movieRoutes.js
│   ├── uploadRoutes.js
│   └── ...
├── utils/
│   ├── generateToken.js   # JWT generation
│   ├── sendEmail.js       # Email service
│   ├── emailTemplates.js  # Email HTML templates
│   └── errors.js          # Custom error classes
├── .env                   # Environment variables
├── server.js              # Express app setup
└── package.json
```

---

## 🌟 Key Features Explained

### TMDb Import
The system can import movies directly from TMDb database:
- Fetches complete movie metadata
- Downloads poster and backdrop images
- Extracts cast information (top 10)
- Maps genres and ratings
- Prevents duplicates

### Cloudinary Integration
- Images: Max 5MB, formats: jpg, png, gif, webp
- Videos: Max 100MB, auto-transcode to 1080p/720p
- Automatic cleanup on failures
- Secure URL generation

### Email System
Professional HTML email templates for:
- Email verification
- Password reset
- Welcome messages
- Subscription confirmations
- Admin notifications

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure MongoDB is running locally or check your Atlas connection string.

#### JWT Token Invalid
```
Error: jwt expired / JsonWebTokenError
```
**Solution**: Token has expired. Login again to get a new token.

#### Email Not Sending
```
Error: Invalid login
```
**Solution**: Use Gmail App Password, not your regular password. Enable 2FA first.

#### Cloudinary Upload Failed
```
Error: Must supply api_key
```
**Solution**: Verify Cloudinary credentials in `.env` file.

---

## 📈 Performance Tips

1. **Database Indexes**: Already configured for common queries
2. **Pagination**: Use `pageNumber` query param for large datasets
3. **Rate Limiting**: Adjust limits in `server.js` based on traffic
4. **Cloudinary**: Images are auto-optimized with `q_auto` and `f_auto`

---

## 🚀 Deployment

### Environment Variables
Update production `.env` with:
- Real domain URLs (FRONTEND_URL, CLIENT_URL)
- Production MongoDB URI
- Strong JWT_SECRET
- Production Stripe keys
- Cloudinary production credentials

### Security Checklist
- [ ] Environment variables secured
- [ ] CORS restricted to frontend domain only
- [ ] Rate limiting configured appropriately
- [ ] MongoDB indexes created
- [ ] SSL/TLS enabled
- [ ] Error logging (Sentry, etc.) integrated
- [ ] Backup strategy in place

---

## 📝 License

MIT License - feel free to use this project for learning and production.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the API documentation at `/api/docs`
- Review error logs in the terminal

---

## 🎉 Acknowledgments

- TMDb for movie data API
- Stripe for payment processing
- Cloudinary for media management
- All open-source contributors

---

**Built with ❤️ for learning and production use**
