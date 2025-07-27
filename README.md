# IIT Connect - Campus Community Platform

A comprehensive Next.js webapp designed specifically for IIT Ropar students to connect, share, and collaborate on campus life activities.

## Features

### 🚗 **Discussions & Sharing**

- Cab sharing coordination
- Cycle sharing arrangements
- Books and electronics marketplace
- Campus-wide discussions

### 🚙 **Auto Driver Directory**

- Verified driver profiles with ratings
- Transparent pricing per kilometer
- Contact information and reviews
- Location-based driver search

### 🔐 **Secure Authentication**

- Google OAuth integration
- Restricted to @iitrpr.ac.in domain only
- Automatic domain verification

### 🎮 **Gaming Hub**

- Physical games available on campus
- Video game discussions and tournaments
- Gaming equipment sharing

### 🍽️ **Mess Food Reviews**

- Daily menu discussions
- Food quality ratings and reviews
- Mess feedback system

### 📚 **College Projects**

- WhatsApp group management
- Project collaboration platform
- B.tech group organization

### 👤 **User Profiles**

- Complete student profiles with Entry No.
- Department and course information
- Social media links integration
- Privacy controls for contact information

### 📱 **Social Features**

- Instagram-style timeline
- Post likes and comments
- Global WhatsApp-style chat
- Real-time messaging

### 💻 **Coding & Placement Hub**

- Coding practice discussions
- Placement preparation resources
- Technical interview tips

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google Provider
- **Database**: Prisma with SQLite (development)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google OAuth credentials

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd iitconnet
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
