# Test Logins Admin System

## Overview

The Test Logins Admin System allows the admin to manage email addresses that can login to IIT Connect without having an @iitrpr.ac.in domain. This is useful for development, testing, and allowing external contributors access to the platform.

## Implementation Details

### 1. Admin Configuration

- **Admin Email**: `iitconnect22@gmail.com` (stored in environment variable `ADMIN_EMAIL`)
- **Admin Privileges**: Only the admin can access the admin panel and manage test logins
- **Admin Panel**: Available at `/admin` route

### 2. Database Collection

- **Collection Name**: `testLogins`
- **Collection Structure**:
  ```typescript
  interface TestLogin {
    _id?: string;
    email: string;
    addedBy: string;
    addedAt: Date;
    isActive: boolean;
  }
  ```

### 3. Authentication Flow

The login process now checks three conditions:

1. **IIT Ropar Email**: Emails ending with `@iitrpr.ac.in`
2. **Admin Email**: The designated admin email
3. **Test Logins**: Emails in the `testLogins` collection with `isActive: true`

### 4. User Creation Logic

- **IIT Students**: Department and entry number extracted from email format
- **Admin**: Department = "Administration", Course = "Admin"
- **Test Users**: Department = "Test Account", Course = "Developer/Tester"

## API Endpoints

### GET `/api/admin/test-logins`

- **Purpose**: Fetch all active test logins
- **Access**: Admin only
- **Response**: `{ testLogins: TestLogin[] }`

### POST `/api/admin/test-logins`

- **Purpose**: Add a new test login email
- **Access**: Admin only
- **Body**: `{ email: string }`
- **Response**: `{ message: string }` or `{ error: string }`

### DELETE `/api/admin/test-logins/remove`

- **Purpose**: Remove/deactivate a test login email
- **Access**: Admin only
- **Body**: `{ email: string }`
- **Response**: `{ message: string }` or `{ error: string }`

## Admin Panel Features

### Add Test Emails

- Enter email address in the input field
- Click "Add Email" to add to the database
- Email validation ensures proper format
- Duplicate detection prevents adding the same email twice

### View Test Emails

- List all currently active test login emails
- Shows who added each email and when
- Total count displayed in the header

### Remove Test Emails

- Click the trash icon next to any email
- Confirmation dialog prevents accidental deletion
- Soft delete (sets `isActive: false`)

## Environment Variables

### `.env.local`

```bash
# Admin Configuration
ADMIN_EMAIL="iitconnect22@gmail.com"

# Other existing variables...
DATABASE_URL="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Production Deployment

### 1. Environment Variables

Set the `ADMIN_EMAIL` environment variable in your production deployment:

- **Vercel**: Add to Environment Variables in project settings
- **Netlify**: Add to Environment Variables in site settings
- **Other platforms**: Follow platform-specific instructions

### 2. Database

The `testLogins` collection will be automatically created when the first test email is added through the admin panel.

## Security Features

### 1. Admin Authorization

- Only the designated admin email can access admin routes
- Server-side verification on all admin API endpoints
- Client-side checks for UI display

### 2. Input Validation

- Email format validation on both client and server
- Prevents injection attacks through proper input sanitization
- Rate limiting can be added if needed

### 3. Audit Trail

- Track who added each test email
- Timestamp when each email was added
- Soft delete preserves history

## Usage Examples

### 1. Adding a Test Email

1. Login as admin (`iitconnect22@gmail.com`)
2. Go to `/admin` or click "Admin Panel" in profile dropdown
3. Enter the email address in the input field
4. Click "Add Email"

### 2. Removing a Test Email

1. Go to the admin panel
2. Find the email in the list
3. Click the trash icon
4. Confirm deletion in the popup

### 3. Test Login Flow

1. Test user goes to login page
2. Signs in with Google using their Gmail account
3. System checks if email is in `testLogins` collection
4. If found and active, user is allowed to login
5. User account created with test user metadata

## Monitoring and Logs

### Login Attempts

Check server logs for these messages:

- `👑 Admin login: email@gmail.com`
- `🧪 Test email login allowed: email@gmail.com`
- `❌ Login denied: email@gmail.com - Not IIT email, not admin, and not in test logins`

### Database Operations

- New test login additions
- Test login removals
- Failed authorization attempts

## Troubleshooting

### Common Issues

1. **Admin can't access panel**: Check `ADMIN_EMAIL` environment variable
2. **Test user can't login**: Verify email is in database and `isActive: true`
3. **API errors**: Check MongoDB connection and collection permissions

### Debug Steps

1. Check environment variables are set correctly
2. Verify MongoDB connection
3. Check server logs for specific error messages
4. Use browser dev tools to inspect API responses

## Future Enhancements

### Potential Features

1. **Multiple Admins**: Support for multiple admin emails
2. **Temporary Access**: Expiration dates for test logins
3. **Role-based Access**: Different permission levels for test users
4. **Bulk Operations**: Add/remove multiple emails at once
5. **Admin Logs**: Detailed audit trail of admin actions
