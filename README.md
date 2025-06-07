# Library Management System

A comprehensive library management system consisting of a modern React frontend and a production-ready Laravel 12 API. The frontend is built with TypeScript, Tailwind CSS, and modern React patterns, while the backend provides robust features for managing books, authors, categories, users, and reservations.

## Features

### 🎯 Core Features
- **Axios Service Layer** with interceptors for authentication and error handling
- **Zustand State Management** for global state
- **React Hook Form** for form handling and validation
- **React Hot Toast** for notifications
- **Protected Routes** with role-based access control
- **Responsive Design** with Tailwind CSS

### 🔐 Authentication & Security
- JWT token-based authentication
- Automatic token refresh and logout on expiry
- Role-based route protection (Admin, Librarian, Member)
- Persistent authentication state

### 📚 Library Features
- Browse and search books
- Filter by categories and authors
- Reserve books (for members)
- Manage reservations
- View overdue books
- Real-time notifications

### 🎨 UI/UX Features
- Modern, clean interface
- Mobile-responsive design
- Loading states and error handling
- Toast notifications for user feedback
- Pagination for large datasets
- Search and filtering capabilities

### 🛠 Backend Features
- **Repository-Service Pattern**: Clean architecture with interfaces and dependency injection
- **Custom API Response Helpers**: Consistent JSON responses across the application
- **Exception Handling**: Global exception handling with custom exceptions
- **API Resources**: Transform data using Laravel's JsonResource
- **Authentication & Security**: Sanctum API tokens with role-based access control
- **Notifications**: Email and database notifications for reservations and overdue books
- **Events & Listeners**: Event-driven architecture for business logic
- **Queues**: Background processing for notifications and heavy tasks
- **Validation**: Form request validation for all endpoints
- **Permissions**: Role-based permissions using Spatie Laravel Permission

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for routing
- **Axios** for API calls
- **React Hook Form** for forms
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Laravel 12**
- **PHP 8.1+**
- **MySQL 8.0+** or **PostgreSQL 13+**
- **Redis** (for queues and caching)
- **Composer**

## Installation

### Frontend

1. **Clone the repository:**
\`\`\`bash
git clone <repository-url>
cd library-management-frontend
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables:**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your configuration:
\`\`\`env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Library Management System
VITE_PUSHER_APP_KEY=your_pusher_app_key
VITE_PUSHER_APP_CLUSTER=mt1
\`\`\`

4. **Start the development server:**
\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

### Backend

#### Option 1: Automated Setup (Recommended)

1. **Clone and install:**
\`\`\`bash
git clone <repository-url>
cd library-management-api
composer install
\`\`\`

2. **Environment setup:**
\`\`\`bash
cp .env.example .env
php artisan key:generate
\`\`\`

3. **Configure your .env file:**
\`\`\`env
APP_NAME="Library Management API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=library_management
DB_USERNAME=root
DB_PASSWORD=

# Add other configurations as needed
\`\`\`

4. **Create database:**
\`\`\`bash
# MySQL
mysql -u root -p -e "CREATE DATABASE library_management;"

# Or PostgreSQL
createdb library_management
\`\`\`

5. **Run the automated setup:**
\`\`\`bash
# Fresh installation (recommended for new setup)
php artisan library:setup --fresh

# Or if you want to keep existing data
php artisan library:setup
\`\`\`

6. **Start the server:**
\`\`\`bash
php artisan serve
\`\`\`

#### Option 2: Manual Setup

If you prefer to run each step manually:

1. **Install dependencies:**
\`\`\`bash
composer install
\`\`\`

2. **Publish vendor packages:**
\`\`\`bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
\`\`\`

3. **Run migrations:**
\`\`\`bash
php artisan migrate
\`\`\`

4. **Seed the database:**
\`\`\`bash
php artisan db:seed
\`\`\`

5. **Clear cache:**
\`\`\`bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
\`\`\`

#### Option 3: Using Raw SQL Scripts

If you prefer to use the raw SQL scripts:

1. **Run the SQL scripts:**
\`\`\`bash
# Create tables
mysql -u root -p library_management < scripts/create_tables.sql

# Seed data
mysql -u root -p library_management < scripts/seed_data.sql
\`\`\`

2. **Run Laravel-specific migrations:**
\`\`\`bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
\`\`\`

## Project Structure

### Frontend
\`\`\`
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── books/          # Book-related components
│   ├── layout/         # Layout components
│   ├── reservations/   # Reservation components
│   └── ui/             # Base UI components
├── pages/              # Page components
├── services/           # API service layer
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── hooks/              # Custom React hooks
\`\`\`

### Backend
\`\`\`
app/
├── Http/
│   ├── Controllers/    # Handle HTTP requests/responses
│   ├── Middleware/     # Middleware for authentication and permissions
│   └── Requests/       # Form request validation
├── Models/             # Database models
├── Repositories/       # Repository pattern for data access
├── Services/           # Service layer for business logic
├── Events/             # Event classes
├── Listeners/          # Listener classes
├── Notifications/      # Notification classes
├── Providers/          # Service providers
├── Exceptions/         # Custom exceptions
└── Resources/          # API resources
\`\`\`

## Key Components

### Service Layer
- **apiService**: Base Axios configuration with interceptors
- **authService**: Authentication API calls
- **bookService**: Book management API calls
- **reservationService**: Reservation management API calls
- **userService**: User management API calls

### State Management
- **authStore**: Authentication state and actions
- **bookStore**: Book data and filtering state
- **reservationStore**: Reservation data and actions

### UI Components
- **Layout**: Main application layout with sidebar and header
- **ProtectedRoute**: Route protection with role-based access
- **BookCard**: Individual book display component
- **ReservationCard**: Individual reservation display component
- **Pagination**: Reusable pagination component

### Backend Components
- **Custom Exceptions**: Specific error handling
- **API Resources**: Consistent data transformation
- **Form Requests**: Input validation
- **Events & Listeners**: Decoupled business logic
- **Notifications**: Email and database notifications

## Authentication Flow

1. User logs in with email/password
2. API returns JWT token and user data
3. Token is stored in localStorage via Zustand persist
4. Token is automatically added to all API requests
5. On token expiry, user is automatically logged out

## Role-Based Access

### Member
- Browse and search books
- Reserve available books
- View own reservations
- Return books

### Librarian
- All member permissions
- Manage books (CRUD)
- Manage authors and categories
- View all reservations
- Generate reports

### Admin
- All librarian permissions
- Manage users
- System administration

## API Integration

The frontend integrates with the Laravel API using:

- **Axios interceptors** for automatic token handling
- **Error handling** with toast notifications
- **Loading states** for better UX
- **Pagination** for large datasets
- **Real-time updates** (ready for Laravel Echo/Pusher)

## Development

### Available Scripts

#### Frontend
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
\`\`\`

#### Backend
\`\`\`bash
# Start development server
php artisan serve

# Start queue worker (for notifications)
php artisan queue:work

# Check for overdue books (run daily)
php artisan books:check-overdue

# Reset database with fresh data
php artisan library:setup --fresh

# Run tests
php artisan test
\`\`\`

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional component structure

### Adding New Features

#### Frontend
1. Create types in \`src/types/\`
2. Add API service methods in \`src/services/\`
3. Create Zustand store if needed in \`src/stores/\`
4. Build UI components in \`src/components/\`
5. Create pages in \`src/pages/\`
6. Add routes in \`src/App.tsx\`

#### Backend
1. Define interfaces in \`app/Repositories/\`
2. Implement repositories in \`app/Repositories/\`
3. Handle business logic in \`app/Services/\`
4. Create controllers in \`app/Http/Controllers/\`
5. Add form requests in \`app/Http/Requests/\`
6. Define events and listeners in \`app/Events/\` and \`app/Listeners/\`
7. Create notifications in \`app/Notifications/\`

## Deployment

### Frontend

\`\`\`bash
npm run build
\`\`\`

### Backend

#### Environment Variables

Set the following environment variables for production:

\`\`\`env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=library_management
DB_USERNAME=root
DB_PASSWORD=

# Add other configurations as needed
\`\`\`

#### Production Setup

1. **Optimize:**
\`\`\`bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
\`\`\`

2. **Queue Worker:**
\`\`\`bash
# Use supervisor or similar to keep queue worker running
php artisan queue:work --daemon
\`\`\`

3. **Cron Job:**
\`\`\`bash
# Add to crontab for overdue book checks
0 9 * * * cd /path/to/project && php artisan books:check-overdue
\`\`\`

#### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

#### Deploy to Netlify

\`\`\`bash
npm run build
# Upload dist/ folder to Netlify
\`\`\`

## Demo Accounts

Use these accounts to test the application:

- **Admin**: admin@library.com / password
- **Librarian**: librarian@library.com / password  
- **Member**: member@library.com / password

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
