# Copilot Instructions for IIT Connect

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js webapp for IIT Ropar students called "IIT Connect" - a comprehensive platform for campus communication and community building.

## Key Features to Implement

1. **Messaging & Discussions**: Cab sharing, cycle sharing, books, electronics buy/sell
2. **Auto Driver Directory**: Numbers, ratings, and pricing
3. **Google Authentication**: Restricted to @iitrpr.ac.in domain only
4. **Gaming Hub**: Physical games and video games available in college
5. **College Projects**: WhatsApp groups, websites, B.tech group management
6. **User Profiles**: Name, Entry No., email visibility, phone, department, course, social links
7. **Timeline**: Instagram-like interface with text posts, likes, comments
8. **Global Chat**: WhatsApp-style messaging
9. **Coding & Placement**: Coding practice discussions

## Tech Stack

- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google Provider (domain restricted)
- **Database**: Prisma with PostgreSQL/SQLite
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Code Guidelines

- Use TypeScript for all components and APIs
- Follow Next.js 15 App Router conventions
- Implement server components where possible
- Use Prisma for database operations
- Ensure mobile-responsive design
- Implement proper authentication checks
- Use proper error handling and loading states
- Follow accessibility best practices

## Authentication Rules

- Only allow users with @iitrpr.ac.in email domain
- Verify email domain in NextAuth configuration
- Redirect unauthorized users appropriately

## Database Schema Considerations

- Users: id, name, entryNo, email, phone, department, course, socialLink, profileImage
- Posts: id, content, authorId, likes, createdAt
- Comments: id, content, postId, authorId, createdAt
- Messages: id, content, senderId, receiverId, chatId, createdAt
- AutoDrivers: id, name, phone, rating, pricePerKm, location
- Games: id, name, type (physical/video), availability, location

## File Structure

- `/src/app`: Pages and layouts
- `/src/components`: Reusable UI components
- `/src/lib`: Utilities, database, auth config
- `/src/types`: TypeScript type definitions
- `/prisma`: Database schema and migrations
