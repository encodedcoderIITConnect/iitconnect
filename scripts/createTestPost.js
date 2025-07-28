import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iitconnect';

async function createTestPost() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('iitconnect');
    
    // First, let's check if we have any users
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    console.log('Found users:', users.length);
    
    if (users.length === 0) {
      console.log('No users found, creating a test user...');
      const testUser = {
        name: 'IIT Connect',
        email: 'admin@iitrpr.ac.in',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        entryNo: '2024CSB999',
        department: 'Computer Science',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const userResult = await usersCollection.insertOne(testUser);
      console.log('✅ Test user created:', userResult.insertedId);
    }
    
    // Get the first user (or the test user we just created)
    const user = await usersCollection.findOne({});
    console.log('Using user:', user?.name);
    
    // Create test posts
    const postsCollection = db.collection('posts');
    
    const testPosts = [
      {
        content: "🎉 Welcome to IIT Connect! Your new campus community platform is here. Share experiences, find study partners, and stay connected with fellow IIT Ropar students. Let's build an amazing community together!",
        category: "general",
        authorId: user!._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: "Looking for a study group for Advanced Algorithms course. Planning to meet every weekend in the library. Anyone interested? 📚💻",
        category: "projects",
        authorId: user!._id,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        content: "Selling my Data Structures and Algorithms textbook (Cormen). Excellent condition, all chapters covered with notes. Price: ₹800. Contact me if interested!",
        category: "books",
        authorId: user!._id,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ];
    
    const result = await postsCollection.insertMany(testPosts);
    console.log(`✅ Created ${result.insertedCount} test posts`);
    
    // Initialize likes and comments collections (empty for now)
    const likesCollection = db.collection('likes');
    const commentsCollection = db.collection('comments');
    
    // Verify posts were created
    const posts = await postsCollection.find({}).toArray();
    console.log(`📝 Total posts in database: ${posts.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createTestPost();
