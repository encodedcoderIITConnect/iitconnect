# MongoDB Setup Instructions for IIT Connect

## 1. Replace MongoDB URI in .env.local

Replace the `DATABASE_URL` in your `.env.local` file with your actual MongoDB connection string:

```bash
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/iitconnect?retryWrites=true&w=majority"
```

## 2. MongoDB Atlas Setup (if using cloud MongoDB)

### Create MongoDB Atlas Account:

1. Go to https://cloud.mongodb.com/
2. Sign up for a free account
3. Create a new cluster (free tier is fine)

### Database Configuration:

1. **Database Name**: `iitconnect`
2. **Collections that will be created**:
   - `users` - Store user information (name, email, password, department, entryNo)
   - `accounts` - NextAuth account data
   - `sessions` - NextAuth session data
   - `posts` - User posts and discussions
   - `comments` - Comments on posts
   - `likes` - Post likes
   - `messages` - Chat messages
   - `chats` - Chat rooms
   - `autodrivers` - Auto driver information
   - `games` - Games and activities
   - `collegeprojects` - College project listings

### Get Connection String:

1. In MongoDB Atlas, click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<dbname>` with your actual values
5. Make sure the database name is `iitconnect`

## 3. Local MongoDB Setup (Alternative)

If you prefer local MongoDB:

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/iitconnect`

## 4. User Data Schema

Your users collection will store:

- **name**: String - User's full name
- **email**: String (unique) - Must end with @iitrpr.ac.in
- **password**: String - Hashed password using bcrypt
- **department**: String - User's department
- **entryNo**: String (unique) - Student entry number
- **phone**: String (optional) - Phone number
- **course**: String (optional) - Course information
- **image**: String (optional) - Profile image URL
- **createdAt**: DateTime - Account creation timestamp
- **updatedAt**: DateTime - Last update timestamp

## 5. After Setting Up MongoDB URI

Run these commands to initialize your database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to MongoDB (creates collections)
npx prisma db push

# Start development server
npm run dev
```

## 6. User Registration API

Your registration endpoint is available at:

- **POST** `/api/auth/register`

Required fields:

```json
{
  "name": "Student Name",
  "email": "student@iitrpr.ac.in",
  "password": "securepassword",
  "department": "Computer Science",
  "entryNo": "2021CSB1234"
}
```

## 7. Security Features

- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Email validation (must end with @iitrpr.ac.in)
- ✅ Entry number uniqueness check
- ✅ Input validation with Zod
- ✅ MongoDB ObjectId for all records
- ✅ Proper error handling and responses

Your MongoDB setup is now ready for IIT Connect!
