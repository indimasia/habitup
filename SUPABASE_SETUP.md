# Supabase Setup Guide

This project is now configured to work with Supabase. Follow these steps to complete the setup:

## 1. Environment Variables

Your `.env.local` file already contains the Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jycbjkwobqztghsfmncn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 2. Database Schema

Run the SQL commands in `supabase-schema.sql` in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the query

This will create:
- `profiles` table for user profiles
- `habits` table for habit tracking
- `habit_completions` table for tracking habit completions
- Row Level Security (RLS) policies
- Triggers for automatic profile creation

## 3. Authentication Setup

The project includes:
- **Client-side auth**: `src/lib/supabase-client.ts`
- **Server-side auth**: `src/lib/supabase-server.ts`
- **Middleware**: `src/middleware.ts` for route protection
- **Auth utilities**: `src/lib/supabase-utils.ts` for common operations

## 4. Usage Examples

### Sign Up
```typescript
import { signUp } from '@/lib/supabase-utils'

const { data, error } = await signUp(email, password)
```

### Sign In
```typescript
import { signIn } from '@/lib/supabase-utils'

const { data, error } = await signIn(email, password)
```

### Get Current User
```typescript
import { getCurrentUser } from '@/lib/supabase-utils'

const { user, error } = await getCurrentUser()
```

### Database Operations
```typescript
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

// Create a habit
const { data, error } = await supabase
  .from('habits')
  .insert({
    title: 'Exercise',
    description: 'Daily workout',
    frequency: 'daily',
    user_id: user.id
  })

// Get user's habits
const { data: habits, error } = await supabase
  .from('habits')
  .select('*')
  .eq('user_id', user.id)
```

## 5. Type Safety

The project includes TypeScript types for your database schema in `src/lib/database.types.ts`. These types are automatically applied to your Supabase client for full type safety.

## 6. Row Level Security

All tables have RLS enabled, ensuring users can only access their own data. The policies are automatically applied based on the authenticated user's ID.

## Next Steps

1. Run the SQL schema in your Supabase dashboard
2. Test authentication by creating a login page
3. Start building your habit tracking features with full database integration