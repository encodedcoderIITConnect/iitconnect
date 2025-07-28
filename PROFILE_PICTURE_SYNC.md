# Profile Picture Sync Feature

## Overview

This feature automatically synchronizes user profile pictures from Google when users log in to IIT Connect.

## How it Works

### For New Users

- When a user logs in for the first time, their Google profile picture is automatically saved to the database
- The profile picture URL is stored in the `image` field in the user document

### For Existing Users

- Every time an existing user logs in, the system checks if their Google profile picture has changed
- If the profile picture URL is different from what's stored in the database, it gets updated automatically
- The `updatedAt` timestamp is also refreshed to track the last sync

## Implementation Details

### Database Updates

The profile picture sync happens in the `signIn` callback in `/src/lib/auth.ts`:

```typescript
// For existing users
if (user.image && user.image !== existingUser.image) {
  updateData.image = user.image;
  console.log(`🖼️ Updating profile image from Google for ${user.email}`);
}
```

### API Integration

The updated profile picture is accessible through:

- NextAuth session: `session.user.image`
- User API endpoint: `/api/user/me`

## Benefits

1. **Always Current**: Profile pictures stay up-to-date with Google account changes
2. **Automatic**: No manual intervention required from users
3. **Seamless**: Updates happen transparently during login
4. **Reliable**: Graceful handling of failures - login continues even if image sync fails

## Logging

The system logs profile picture updates for debugging:

- `🖼️ Updating profile image from Google for [email]` - When image is updated
- `📝 Updating name from Google for [email]` - When name is also updated

## Type Safety

Custom TypeScript definitions ensure proper typing for the enhanced session object with profile picture data.
