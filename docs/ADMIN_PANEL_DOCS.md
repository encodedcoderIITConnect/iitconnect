# Admin Panel & Test Emails Setup

## Overview

This document describes the admin panel system and test email management for IIT Connect. The system allows designated admins to manage test emails that can bypass the @iitrpr.ac.in domain restriction.

## Features

### 1. Test Email Management

- Add/remove test emails that can login without @iitrpr.ac.in domain
- View current list of allowed test emails
- Audit logging for all admin actions
- Environment variable integration for production

### 2. Admin Access Control

- Only designated admin emails can access the admin panel
- Admin emails are hardcoded in the application for security
- Automatic redirect for unauthorized users

## Current Configuration

### Test Emails (Production Ready)

```
sureshrao10000@gmail.com
sureshrao100000@gmail.com
me.johnwick999@gmail.com
kashish.sundwal@gmail.com
```

### Admin Emails

```
sureshrao10000@gmail.com
sureshrao100000@gmail.com
```

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local` (development) and production environment:

```bash
ALLOWED_TEST_EMAILS="sureshrao10000@gmail.com,sureshrao100000@gmail.com,me.johnwick999@gmail.com,kashish.sundwal@gmail.com"
```

### 2. Production Deployment

#### Vercel

1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add `ALLOWED_TEST_EMAILS` with the comma-separated list
4. Redeploy your application

#### Other Platforms

Add the environment variable in your deployment configuration.

### 3. Adding New Admins

To add new admin emails, update the `ADMIN_EMAILS` array in:

- `/src/app/api/admin/test-emails/route.ts` (line 8)
- `/src/app/admin/page.tsx` (line 8)
- `/src/components/Navbar.tsx` (line 65)

## How It Works

### Authentication Flow

1. User attempts to login with Google OAuth
2. System checks if email ends with `@iitrpr.ac.in` OR is in `ALLOWED_TEST_EMAILS`
3. If neither condition is met, login is denied
4. Test emails get special treatment:
   - Department: "Test Account"
   - Course: "Developer/Tester"
   - Entry No: null

### Admin Panel Access

1. Admin logs in with their test email
2. Admin link appears in profile dropdown (gear icon)
3. Admin can view/manage test emails at `/admin`
4. All actions are logged to MongoDB for audit

## Files Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin panel layout
│   │   └── page.tsx            # Admin panel main page
│   └── api/
│       └── admin/
│           └── test-emails/
│               └── route.ts    # API for managing test emails
├── components/
│   ├── admin/
│   │   └── TestEmailsAdmin.tsx # Admin UI component
│   └── Navbar.tsx              # Updated with admin link
└── lib/
    └── auth.ts                 # Updated auth logic
```

## API Endpoints

### GET `/api/admin/test-emails`

Returns current list of test emails (admin only)

### POST `/api/admin/test-emails`

Adds a new test email (admin only)

```json
{
  "email": "newtest@gmail.com"
}
```

### DELETE `/api/admin/test-emails`

Removes a test email (admin only)

```json
{
  "email": "removetest@gmail.com"
}
```

## Security Considerations

1. **Admin Access**: Admin emails are hardcoded in the application, not in environment variables
2. **Audit Logging**: All admin actions are logged to MongoDB with timestamps
3. **Session Verification**: All admin API calls verify user session and admin status
4. **Production Ready**: Test emails work in both development and production

## Troubleshooting

### Test Email Not Working

1. Check if email is added to `ALLOWED_TEST_EMAILS` environment variable
2. Verify environment variable is set in production
3. Restart application after environment variable changes
4. Check server logs for authentication errors

### Admin Panel Not Accessible

1. Verify your email is in the `ADMIN_EMAILS` array
2. Ensure you're logged in with an admin email
3. Check that the admin link appears in the profile dropdown

### Environment Variable Updates

Remember that environment variable changes require:

- Application restart in development
- Redeployment in production (for most platforms)

## Monitoring

The system logs the following for monitoring:

- Test email login attempts (successful/failed)
- Admin actions (add/remove test emails)
- Unauthorized admin access attempts

Check your application logs and MongoDB admin_action entries for audit trails.
