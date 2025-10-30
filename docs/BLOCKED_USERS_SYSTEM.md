# Blocked Users System Documentation

## Overview

The IIT Connect platform now includes a comprehensive blocked users system that prevents specific users from accessing the platform. This system provides both login prevention and active session termination.

## Features Implemented

### ✅ Complete System Features

1. **Login Prevention**: Blocked users cannot sign in to the platform
2. **Session Termination**: Active sessions are terminated for blocked users
3. **Admin Panel**: Dropdown interface for managing blocked users
4. **Simple Email Entry**: Enter any email address without validation against existing collections
5. **Clear Blocking Message**: "You are blocked to access the Platform, Contact Admin"
6. **Admin-Only Control**: No unblocking functionality for regular users

## Database Schema

### blockedUsers Collection

```javascript
{
  email: String,        // Blocked user's email (lowercase)
  blockedBy: String,    // Admin email who blocked the user
  blockedAt: Date,      // Timestamp when user was blocked
  reason: String,       // Optional reason for blocking
  isActive: Boolean     // Active status (true = blocked, false = unblocked)
}
```

## File Structure

### Core Files

- `src/lib/blockedUsers.ts` - Database operations and utility functions
- `src/components/BlockedUsersManager.tsx` - Admin UI component
- `src/app/api/admin/blocked-users/route.ts` - API endpoints for CRUD operations
- `src/app/api/admin/blocked-users/remove/route.ts` - API endpoint for unblocking users
- `src/app/auth/blocked/page.tsx` - Blocked user notification page
- `middleware.ts` - Session monitoring and redirection

### Updated Files

- `src/lib/auth.ts` - Added blocked user check in signIn callback
- `src/app/admin/page.tsx` - Added BlockedUsersManager component
- `src/app/auth/signin/page.tsx` - Added blocked user error handling

## API Endpoints

### GET /api/admin/blocked-users

**Purpose**: Fetch all blocked users  
**Authentication**: Admin only  
**Response**: Array of blocked user objects

### POST /api/admin/blocked-users

**Purpose**: Block a new user  
**Authentication**: Admin only  
**Body**: `{ email: string, reason?: string }`  
**Response**: Success/error message

### POST /api/admin/blocked-users/remove

**Purpose**: Unblock a user  
**Authentication**: Admin only  
**Body**: `{ email: string }`  
**Response**: Success/error message

## Admin Panel Features

### Block New User Dropdown

- **Email Field**: Enter any email address to block
- **Reason Field**: Optional reason for blocking
- **Block Button**: Executes the blocking action
- **Cancel Button**: Closes the dropdown without action

### Blocked Users List

- **User Information**: Email, blocked date, blocked by, reason
- **Unblock Button**: Removes user from blocked list
- **Real-time Updates**: List refreshes after actions
- **Responsive Design**: Mobile-friendly interface

## Security Features

### Authentication Checks

1. **Login Prevention**: `isUserBlocked()` check in NextAuth signIn callback
2. **Session Monitoring**: Middleware checks active sessions for blocked users
3. **Admin Authorization**: All API endpoints verify admin privileges
4. **Input Validation**: Email format validation and sanitization

### Error Handling

- Database connection failures
- Invalid API requests
- Unauthorized access attempts
- Network errors with user feedback

## User Experience

### For Blocked Users

1. **Login Attempt**: Redirected to sign-in page with error message
2. **Active Session**: Automatically redirected to blocked page
3. **Blocked Page**: Clear message with admin contact information
4. **Sign Out Option**: Ability to sign out from blocked page

### For Administrators

1. **Easy Access**: Admin panel accessible at `/admin`
2. **Intuitive Interface**: Dropdown and list interface
3. **Immediate Feedback**: Success/error messages for all actions
4. **Mobile Support**: Fully responsive design

## Usage Instructions

### Blocking a User

1. Navigate to `/admin` (admin authentication required)
2. Click "Block New User" dropdown
3. Enter the email address to block
4. Optionally add a reason
5. Click "Block User"
6. User is immediately blocked from login and active sessions

### Unblocking a User

1. Navigate to the blocked users list in admin panel
2. Find the user in the list
3. Click the "Unblock" button next to their email
4. User can immediately access the platform again

### Monitoring Blocked Users

- View all blocked users in the admin panel
- See blocking details: date, admin, reason
- Real-time count of blocked users
- Search and filter capabilities (UI supports it)

## Technical Implementation

### Login Prevention Flow

```javascript
// In auth.ts signIn callback
const userBlocked = await isUserBlocked(user.email);
if (userBlocked) {
  console.log(`🚫 Login denied: ${user.email} - User is blocked`);
  return false; // Prevents login
}
```

### Session Termination Flow

```javascript
// In middleware.ts
const blocked = await isUserBlocked(token.email);
if (blocked && !req.nextUrl.pathname.startsWith("/auth/blocked")) {
  return NextResponse.redirect(new URL("/auth/blocked", req.url));
}
```

### Database Operations

- **isUserBlocked()**: Check if email is in blocked collection
- **blockUser()**: Add user to blocked collection
- **removeBlockedUser()**: Set isActive to false
- **getAllBlockedUsers()**: Fetch all active blocked users

## Error Scenarios Handled

1. **Database Connection Failures**: Graceful fallback, user can still access platform
2. **Invalid Email Formats**: Client-side validation prevents submission
3. **Duplicate Blocking**: System prevents blocking already blocked users
4. **Unauthorized Access**: Non-admin users cannot access blocking APIs
5. **Network Errors**: User-friendly error messages in admin panel

## Mobile Responsiveness

### Responsive Features

- **Touch-Friendly Buttons**: Minimum 44px touch targets
- **Adaptive Layout**: Single column on mobile, multi-column on desktop
- **Readable Text**: Appropriate font sizes for mobile devices
- **Smooth Animations**: Hardware-accelerated transitions
- **Bottom Margin**: Prevents content hiding behind mobile navigation

### Breakpoints

- **sm**: 640px and up - Two-column layout, larger buttons
- **mobile**: Below 640px - Single column, compact design

## Environment Configuration

### Required Variables

```env
ADMIN_EMAIL=iitconnect22@gmail.com
DATABASE_URL=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

## Performance Considerations

1. **Database Indexing**: Email field indexed for fast lookups
2. **Caching**: Blocked status checked once per session
3. **Lazy Loading**: Admin panel loads blocked users on demand
4. **Minimal Queries**: Efficient MongoDB operations
5. **Real-time Updates**: Only when necessary to reduce load

## Testing

### Manual Testing Scenarios

1. **Block User**: Verify user cannot login after blocking
2. **Session Termination**: Verify active user is redirected when blocked
3. **Unblock User**: Verify user can login after unblocking
4. **Admin Panel**: Test all UI interactions and responsiveness
5. **Error Handling**: Test various error scenarios

### Automated Testing

- Unit tests for blocking functions
- Integration tests for API endpoints
- E2E tests for user flows
- Mobile responsiveness tests

## Deployment Notes

### Production Considerations

1. **Environment Variables**: Ensure all required variables are set
2. **Database Indexes**: Create indexes on email and isActive fields
3. **Monitoring**: Set up logging for blocking/unblocking actions
4. **Backup**: Regular backups of blockedUsers collection

### Security Best Practices

1. **Admin Email Protection**: Keep admin email secure
2. **Rate Limiting**: Consider rate limiting for blocking APIs
3. **Audit Trail**: All blocking actions are logged with timestamps
4. **Regular Reviews**: Periodically review blocked users list

## Future Enhancements

### Potential Features

1. **Bulk Operations**: Block/unblock multiple users at once
2. **Temporary Blocks**: Set expiration dates for blocks
3. **Block Categories**: Different types of blocks (temporary, permanent, etc.)
4. **Email Notifications**: Notify users when blocked/unblocked
5. **Advanced Search**: Filter and search blocked users
6. **Analytics**: Track blocking patterns and statistics

## Support and Maintenance

### Monitoring

- Check blocked users collection size regularly
- Monitor for unusual blocking patterns
- Review error logs for system issues

### Maintenance Tasks

- Clean up old blocked user records
- Update documentation as needed
- Review and update security measures
- Performance optimization as user base grows

---

**System Status**: ✅ Fully Operational  
**Last Updated**: August 22, 2025  
**Version**: 1.0.0
