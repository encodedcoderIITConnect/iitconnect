import { getDatabase } from "./mongodb";

// Helper function to get posts collection
export async function getPostsCollection() {
  const db = await getDatabase();
  return db.collection("posts");
}

// Helper function to get comments collection
export async function getCommentsCollection() {
  const db = await getDatabase();
  return db.collection("comments");
}

// Helper function to get likes collection
export async function getLikesCollection() {
  const db = await getDatabase();
  return db.collection("likes");
}
