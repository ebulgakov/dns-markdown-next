# Dns-markdown service

## About 
This is an unofficial website related to the DNS company. It helps you browse discounted items from different cities listed on the DNS website.

The service provides a convenient way to view products from Moscow, Saint Petersburg, Samara, and Yekaterinburg. You can add items to your favorites to keep track of updates, such as price changes or product availability in stores.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the local site.

## .env file
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... # Your Clerk publishable key
CLERK_SECRET_KEY=sk_test_... # Your Clerk secret key
MONGODB_URI="mongodb+srv:" # Your MongoDB connection string

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/catalog
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/profile
```

## Technologies

* Next.js 16
* MongoDB
* Typescript
* Tailwind CSS
* Jest
