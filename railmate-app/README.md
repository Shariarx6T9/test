# RailMate Bangladesh

Your Railway, Simplified. / আপনার রেলযাত্রা, সহজ করা হলো।

RailMate Bangladesh is the most trusted railway companion app for Bangladeshi travelers — the app they open before, during, and after every train journey.

## Tech Stack

- **Framework:** Expo SDK 52 (React Native)
- **Routing:** Expo Router v4
- **Backend:** Supabase
- **State Management:** Zustand
- **Data Fetching:** TanStack Query v5
- **Styling:** NativeWind v4 (Tailwind CSS)
- **Icons:** Phosphor Icons
- **Forms:** React Hook Form + Zod

## Prerequisites

- Node.js 18+
- Expo CLI
- Supabase CLI

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shaheenx/test.git
   cd railmate-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Fill in your `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings.

4. **Database Setup:**
   - Create a new project at [supabase.com](https://supabase.com).
   - Go to the SQL Editor in the Supabase Dashboard.
   - Run the contents of `supabase/migrations/001_initial_schema.sql` to set up the tables and functions.
   - Run the contents of `supabase/seed.sql` to populate initial data.

5. **Run the application:**
   ```bash
   npx expo start
   ```

## Running on Android

You can run the app on an Android emulator or a physical device using Expo Go:
- Press `a` in the terminal after starting the app to open it in an Android emulator.
- Scan the QR code with the Expo Go app on your physical device.

## Project Structure

```
railmate-app/
├── app/               # Expo Router pages
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── stores/            # Zustand state stores
├── lib/               # Third-party library configs (Supabase, QueryClient)
├── api/               # API service functions
├── constants/         # Design tokens and app config
├── i18n/              # Internationalization files
├── utils/             # Helper functions
├── types/             # TypeScript type definitions
└── supabase/          # Database migrations and seed data
```

## Data Attribution

Train schedule data sourced from Bangladesh Railway (railway.gov.bd).
