# User Management Guide

## How to Create a New User

### Option 1: Through the Website (Recommended)

1. **Navigate to Sign Up Page**
   - Click "Sign In" in the header
   - Click "Sign up" link at the bottom of the login form
   - Or go directly to `/signup`

2. **Fill Out the Form**
   - Enter your full name
   - Enter your email address
   - Create a password (minimum 6 characters)
   - Confirm your password

3. **Submit**
   - Click "Create Account"
   - You'll be automatically logged in and redirected to the home page

### Option 2: Programmatically (For Development)

Users are currently stored in localStorage. To create a user programmatically:

```javascript
// In browser console or code
const users = JSON.parse(localStorage.getItem('summercamp_users') || '[]');
const newUser = {
  id: Date.now().toString(),
  email: 'user@example.com',
  password: 'password123', // In production, this should be hashed!
  name: 'John Doe',
  createdAt: new Date().toISOString(),
};
users.push(newUser);
localStorage.setItem('summercamp_users', JSON.stringify(users));
```

### Option 3: Database (For Production)

For production, you should use the Neon database. First, run the users schema:

```bash
# Connect to your Neon database and run:
psql $NETLIFY_DATABASE_URL -f database/users-schema.sql
```

Then create a user via API or directly in the database:

```sql
-- Note: In production, passwords should be hashed using bcrypt or similar
INSERT INTO users (email, password_hash, name)
VALUES ('user@example.com', '$2b$10$hashedpassword', 'John Doe');
```

## Current Implementation

### Authentication System

- **Storage**: Currently uses localStorage (client-side only)
- **Password Security**: ⚠️ Passwords are stored in plain text (NOT secure for production!)
- **Session**: User session persists in localStorage

### Features

- ✅ Sign up / Create account
- ✅ Sign in / Login
- ✅ Logout
- ✅ User profile display in header
- ✅ Session persistence

### Future Improvements (For Production)

1. **Backend API**: Create Netlify Functions for authentication
2. **Password Hashing**: Use bcrypt or similar
3. **Database Storage**: Store users in Neon database
4. **JWT Tokens**: Use secure token-based authentication
5. **Email Verification**: Add email verification for new accounts
6. **Password Reset**: Add password reset functionality

## User Data Structure

```javascript
{
  id: "1234567890",
  email: "user@example.com",
  name: "John Doe",
  createdAt: "2026-01-15T10:30:00.000Z"
}
```

## User Favorites

User favorites are stored separately:
- **Location**: localStorage key `summercamp_favorites`
- **Format**: Array of camp IDs
- **Camp ID Format**: `campName_category` (e.g., "Camp Name_community")

## User Notes

User notes for saved camps:
- **Location**: localStorage key `summercamp_admin_notes`
- **Format**: Object with camp IDs as keys and notes as values

## Testing

To test the user system:

1. Create a test account at `/signup`
2. Log in at `/login`
3. Save some camps as favorites
4. Add notes to saved camps
5. Log out and log back in to verify persistence

## Security Notes

⚠️ **Important**: The current implementation is for development/demo purposes only. For production:

- Never store passwords in plain text
- Use secure password hashing (bcrypt, argon2)
- Implement proper authentication tokens (JWT)
- Use HTTPS for all communications
- Add rate limiting for login attempts
- Implement email verification
- Add password complexity requirements
