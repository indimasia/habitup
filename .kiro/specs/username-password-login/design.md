# Design Document

## Overview

This design implements a username/password authentication system using Supabase Auth, replacing the current mock authentication system. The solution will integrate with the existing Supabase setup and provide real authentication with proper session management, error handling, and user feedback.

## Architecture

### Current State Analysis
- The application currently uses a mock authentication system in `auth-context.tsx`
- Supabase is already configured with client and server-side utilities
- The login page exists but doesn't connect to real authentication
- Auth utilities are available in `supabase-utils.ts` with `signIn` and `signUp` functions

### Proposed Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Login Page    │───▶│   Auth Context   │───▶│   Supabase      │
│                 │    │                  │    │   Auth Service  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Form State    │    │  Session State   │    │   User Session  │
│   & Validation  │    │   Management     │    │   Storage       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Components and Interfaces

### 1. Enhanced Auth Context
**Purpose**: Replace mock authentication with real Supabase authentication

**Interface**:
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}
```

**Key Changes**:
- Replace mock user with Supabase user object
- Update login method to accept email/password parameters
- Add proper error handling and return error messages
- Integrate with Supabase session management

### 2. Enhanced Login Page Component
**Purpose**: Provide a functional login form with validation and error handling

**Features**:
- Form validation for email and password fields
- Loading states during authentication
- Error message display
- Accessibility improvements (focus management, keyboard navigation)
- Responsive design maintenance

**State Management**:
```typescript
interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  fieldErrors: {
    email?: string;
    password?: string;
  };
}
```

### 3. Form Validation System
**Purpose**: Provide client-side validation with user-friendly error messages

**Validation Rules**:
- Email: Required, valid email format
- Password: Required, minimum length (configurable)
- Real-time validation on blur
- Form submission validation

## Data Models

### User Profile Integration
The authentication will integrate with the existing `profiles` table in Supabase:

```sql
-- From existing schema
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Session Management
- Leverage Supabase's built-in session management
- Sessions stored securely in httpOnly cookies (server-side)
- Client-side session state managed through Supabase client
- Automatic session refresh handling

## Error Handling

### Authentication Errors
```typescript
enum AuthErrorType {
  INVALID_CREDENTIALS = 'Invalid email or password',
  NETWORK_ERROR = 'Connection error. Please try again.',
  VALIDATION_ERROR = 'Please check your input and try again',
  UNKNOWN_ERROR = 'An unexpected error occurred'
}
```

### Error Mapping Strategy
- Map Supabase auth errors to user-friendly messages
- Provide specific feedback for common scenarios
- Maintain security by not revealing sensitive information
- Log detailed errors for debugging while showing generic messages to users

### Error Display
- Field-level validation errors shown inline
- Authentication errors displayed prominently above the form
- Loading states prevent multiple submissions
- Error persistence until user takes corrective action

## Testing Strategy

### Unit Testing Focus Areas
1. **Form Validation Logic**
   - Email format validation
   - Password requirements
   - Error message generation

2. **Auth Context Integration**
   - Login method functionality
   - Session state management
   - Error handling flows

3. **Component Behavior**
   - Form submission handling
   - Loading state management
   - Error display logic

### Integration Testing
1. **Authentication Flow**
   - Successful login with valid credentials
   - Failed login with invalid credentials
   - Session persistence across page refreshes
   - Automatic redirect for authenticated users

2. **Error Scenarios**
   - Network connectivity issues
   - Invalid email formats
   - Empty form submissions
   - Supabase service errors

### Manual Testing Checklist
- Keyboard navigation and accessibility
- Responsive design across devices
- Form field focus management
- Error message clarity and helpfulness

## Security Considerations

### Client-Side Security
- No sensitive data stored in localStorage
- Form validation as UX enhancement, not security measure
- Proper error message sanitization

### Server-Side Security
- Leverage Supabase's built-in security features
- Session management through secure cookies
- Rate limiting handled by Supabase Auth
- Password hashing managed by Supabase

### Data Protection
- Email addresses handled securely
- No password storage on client-side
- Session tokens managed by Supabase SDK
- Automatic session expiration handling

## Implementation Approach

### Phase 1: Auth Context Enhancement
- Replace mock authentication with Supabase integration
- Update user interface to match Supabase user object
- Implement proper session management

### Phase 2: Login Form Enhancement
- Add form validation and error handling
- Implement loading states and user feedback
- Enhance accessibility and user experience

### Phase 3: Integration and Testing
- Connect enhanced auth context with login form
- Test authentication flows end-to-end
- Verify session persistence and management

### Migration Strategy
- Gradual replacement of mock system
- Maintain existing component interfaces where possible
- Ensure no breaking changes to dependent components
- Test thoroughly before removing mock authentication code