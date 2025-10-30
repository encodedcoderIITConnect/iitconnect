# MongoDB Setup for IIT Connect

## Quick Setup Instructions

1. **Create `.env.local` file** in the root directory with your MongoDB connection string:

```bash
# Copy this content to .env.local and update with your actual values

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB Database - UPDATE THIS WITH YOUR ACTUAL MONGODB URL
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/iitconnect?retryWrites=true&w=majority
```

2. **MongoDB Database Setup Options:**

### Option A: MongoDB Atlas (Recommended - Free Cloud Database)

1. Go to https://cloud.mongodb.com/
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Create database user with username/password
5. Get connection string and replace in DATABASE_URL above

### Option B: Local MongoDB

1. Install MongoDB locally
2. Use connection string: `mongodb://localhost:27017/iitconnect`

## What Happens After Setup

- When users log in with Google OAuth (@iitrpr.ac.in domain only)
- System automatically checks if user exists in MongoDB
- If user doesn't exist, creates new user with basic info:
  - name, email, image from Google
  - Empty fields for: entryNo, phone, department, course, socialLink
- If user exists, just logs them in
- Profile page now loads real data from MongoDB
- Profile updates are saved to MongoDB

## Database Schema

The `users` collection in MongoDB will have these fields:

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String,
  entryNo: String,
  phone: String,
  department: String,
  course: String,
  socialLink: String,
  isPublicEmail: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

1. After setting up DATABASE_URL, restart the dev server
2. Log in with an @iitrpr.ac.in email
3. Check console logs for MongoDB connection messages
4. Visit profile page to see real data loading
5. Update profile to test saving to database
