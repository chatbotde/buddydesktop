# Authentication and Database Setup

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Set application type to "Desktop application"
6. Add your redirect URI (e.g., `http://localhost:3000/auth/google/callback`)
7. Copy the Client ID and Client Secret to your `.env` file

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service
3. Use default connection string: `mongodb://localhost:27017/buddy`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com/
2. Create a new cluster
3. Get connection string and add to `.env` file
4. Whitelist your IP address

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/buddy

# JWT Secret (change this in production)
JWT_SECRET=your_jwt_secret_key_here

# AI Provider API Keys
GOOGLE_API_KEY=your_google_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
CLAUDE_API_KEY=your_claude_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Features

### Authentication
- Google OAuth2 login
- Guest mode (local storage only)
- JWT-based session management
- User preferences syncing

### Database Storage
- MongoDB integration
- Chat history storage
- User preferences storage
- Session management
- Automatic cleanup of old sessions

### Security
- JWT tokens for authentication
- Environment variable configuration
- Database indexes for performance
- Input validation and sanitization

## Usage

1. **Authenticated Users**: Chat history and preferences are saved to MongoDB and synced across devices
2. **Guest Users**: Data is stored locally in browser storage only
3. **Offline Mode**: App works without authentication, but no data syncing

## Data Storage

### Authenticated Users
- Chat sessions stored in MongoDB
- User preferences synced to database
- History accessible across devices
- Automatic session cleanup after 30 days

### Guest Users
- Local storage only
- No cross-device syncing
- Manual history management
- Data cleared when browser cache is cleared
