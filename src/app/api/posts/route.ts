import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getPostsCollection,
  getLikesCollection,
  getCommentsCollection,
} from "@/lib/posts";
import { getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Fetch all posts
export async function GET() {
  try {
    const postsCollection = await getPostsCollection();
    const usersCollection = await getUsersCollection();
    const likesCollection = await getLikesCollection();
    const commentsCollection = await getCommentsCollection();

    // Get all posts sorted by creation date (newest first)
    const posts = await postsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich posts with author information, likes, and comments
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        // Get author info
        const author = await usersCollection.findOne({
          _id: new ObjectId(post.authorId),
        });

        // Count likes and comments
        const likesCount = await likesCollection.countDocuments({
          postId: post._id.toString(),
        });
        const commentsCount = await commentsCollection.countDocuments({
          postId: post._id.toString(),
        });

        return {
          id: post._id.toString(),
          content: post.content,
          image: post.image || null,
          category: post.category || "general",
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
          author: {
            id: author?._id.toString() || "",
            name: author?.name || "Unknown User",
            username: author?.username || "",
            email: author?.email || "",
            image: author?.image || "",
            entryNo: author?.entryNo || "",
            department: author?.department || "",
            isVerified: false, // You can add verification logic later
          },
          likes: likesCount,
          comments: commentsCount,
          isLiked: false, // Will be updated based on current user
          isSaved: false, // Will be updated based on current user
        };
      })
    );

    return NextResponse.json(enrichedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { content, image, category } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Post content cannot exceed 1000 characters" },
        { status: 400 }
      );
    }

    // Get user info
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new post
    const postsCollection = await getPostsCollection();
    const newPost = {
      content: content.trim(),
      image: image || null,
      category: category || "general",
      authorId: user._id.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await postsCollection.insertOne(newPost);

    // Return the created post with author info
    const createdPost = {
      id: result.insertedId.toString(),
      content: newPost.content,
      image: newPost.image,
      category: newPost.category,
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString(),
      author: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image || "",
        entryNo: user.entryNo || "",
        department: user.department || "",
        isVerified: false,
      },
      likes: 0,
      comments: 0,
      isLiked: false,
      isSaved: false,
    };

    console.log(
      `✅ New post created by ${user.name}: ${content.substring(0, 50)}...`
    );

    return NextResponse.json(createdPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific post
export async function PUT(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Post content cannot exceed 1000 characters" },
        { status: 400 }
      );
    }

    const postsCollection = await getPostsCollection();
    const usersCollection = await getUsersCollection();

    // Get the current user
    const user = await usersCollection.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the post exists and belongs to the user
    const existingPost = await postsCollection.findOne({
      _id: new ObjectId(postId),
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user._id.toString()) {
      return NextResponse.json(
        { error: "You can only edit your own posts" },
        { status: 403 }
      );
    }

    // Update the post
    const updateResult = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          content: content.trim(),
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      );
    }

    console.log(`✅ Post updated by ${session.user.name}: ${postId}`);

    return NextResponse.json(
      { message: "Post updated successfully", content: content.trim() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific post
export async function DELETE(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const postsCollection = await getPostsCollection();
    const usersCollection = await getUsersCollection();

    // Get the current user
    const user = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the post to check ownership
    const post = await postsCollection.findOne({
      _id: new ObjectId(postId),
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user owns the post
    if (post.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Delete the post
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(postId),
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    // Also delete associated likes and comments
    const likesCollection = await getLikesCollection();
    const commentsCollection = await getCommentsCollection();

    await likesCollection.deleteMany({ postId: new ObjectId(postId) });
    await commentsCollection.deleteMany({ postId: new ObjectId(postId) });

    console.log(`✅ Post deleted by ${user.name}: ${postId}`);

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
