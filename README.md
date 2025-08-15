# 🏥 Health Tracker

A comprehensive web application for tracking personal health information, built with Vue.js 3 and Firebase. This application provides secure user authentication, detailed health data collection, and admin management capabilities.

## ✨ Features

### 🔐 Authentication System
- **User Registration & Login** with email/password
- **Password Reset** functionality with email verification
- **Email Change** with re-authentication security
- **Rate Limiting** to prevent spam and abuse
- **Secure Session Management** with Firebase Auth
- **Admin Panel** with role-based access control

### 📋 Health Data Management
- **Personal Information** collection and validation
- **Health History** tracking with decimal year support (e.g., 0.5 = 6 months)
- **Medical Conditions** and treatment history
- **Lifestyle Factors** (smoking, alcohol, exercise)
- **Family Medical History** documentation
- **Real-time Data Synchronization** with Firebase Firestore

### 👑 Admin Features
- **User Management** - View all registered users with detailed profiles
- **Admin Assignment** - Promote users to admin status
- **Email System** - Professional email simulation for development/testing
- **Batch Messaging** - Send emails to multiple users with templates
- **Statistics Dashboard** - Monitor app usage and user activity
- **Security Controls** - Secure admin authentication and permissions

### 📧 Email System (Simulation Mode)
- **Individual Emails** - Send appointment reminders to specific users
- **Batch Emails** - Send to multiple recipients with personalization
- **Email Templates** - Pre-built professional healthcare templates
  - 📅 Appointment Reminder
  - 📰 Health Newsletter  
  - 💝 Follow-up Care
  - 🛡️ Wellness Check
- **Simulation Mode** - Cost-effective development and testing solution
- **Console Logging** - Detailed email content for development review
- **Professional UI** - Realistic email sending notifications

### 🎨 User Interface
- **Responsive Design** optimized for all devices
- **Modern UI Components** using PrimeVue library
- **Real-time Form Validation** with instant feedback
- **Professional Styling** with custom CSS
- **Accessible Design** following WCAG guidelines
- **Mobile-First Design** with touch-friendly components

### 🔒 Security Features
- **Input Validation** with pattern matching and sanitization
- **XSS Protection** through proper data handling
- **User Enumeration Prevention** with generic error messages
- **Role-Based Access Control** for admin features
- **Secure Authentication** with Firebase Auth

## 💻 Email System Usage

### For Admins
1. **Login** to the admin panel
2. **Navigate** to User Management → Select user → Click "Send Mail"
3. **Use Batch Emails** for sending to multiple users
4. **Choose Templates** or write custom messages
5. **Check Console** (F12) for detailed simulation logs

### Sample Console Output
```
📧 EMAIL SIMULATION MODE ACTIVATED
=====================================
To: user@example.com
Subject: Important: Appointment Reminder - Health Tracker
From Admin: admin@healthtracker.com
---
Message Preview:
Hello John Doe,
We hope this email finds you in good health...
```

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **PrimeVue** - Rich UI component library
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with Flexbox and Grid

### Backend & Services
- **Firebase Authentication** - Secure user management
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Hosting** - Fast and secure web hosting

### Development & Deployment
- **GitHub Actions** - Automated CI/CD pipeline
- **Environment Variables** - Secure configuration management
- **ESLint** - Code quality and consistency
- **Git** - Version control with detailed commit history

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) 
- **Firebase project** with Authentication and Firestore enabled
- **Firebase CLI** (for deployment): `npm install -g firebase-tools`

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Contraill/Breast-Cancer-Tracker.git
   cd health-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your Firebase configuration
   # Get these values from Firebase Console > Project Settings > General
   ```

4. **Firebase Setup** (if deploying)
   ```bash
   # Login to Firebase
   firebase login
   
   # Deploy Firestore security rules
   firebase deploy --only firestore:rules
   ```

5. **Start development server**
   ```bash
   npm run dev
   # Opens at http://localhost:5173
   ```

### Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run deploy`** - Build and deploy to Firebase
- **`npm run deploy-rules`** - Deploy only Firestore rules
- **`npm run deploy-hosting`** - Deploy only hosting

### Admin Setup

First user can become admin automatically (Emergency Admin Mode):
1. **Register** a new account with your email
2. **Emergency Mode** activates if no admins exist
3. **Automatic Admin** privileges granted
4. **Configure** `VITE_SUPER_ADMIN_EMAILS` in `.env` for permanent admin access

### Environment Variables

```env
# Firebase Configuration (required)
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"  
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Admin Configuration (optional)
VITE_SUPER_ADMIN_EMAILS="admin@example.com,admin2@example.com"
VITE_EMERGENCY_ADMIN_ENABLED="true"
```

## 📁 Project Structure

```
health-tracker/
├── public/
│   ├── icon.svg                 # Application icon
│   └── index.html              # HTML template
├── src/
│   ├── assets/
│   │   └── countries.js        # Country list data
│   ├── router/
│   │   └── index.js            # Vue Router configuration
│   ├── style/
│   │   └── main.css            # Global styles (1,450+ lines)
│   ├── views/
│   │   ├── AuthView.vue        # Authentication page (445 lines)
│   │   └── HomeView.vue        # Main application (1,531 lines)
│   ├── App.vue                 # Root component
│   ├── firebase.js             # Firebase configuration
│   └── main.js                 # Application entry point
├── .firebaserc                 # Firebase project configuration
├── firebase.json               # Firebase hosting configuration
├── package.json                # Dependencies and scripts
└── vite.config.js             # Vite configuration
```

## 🎯 Key Features Detail

### Form Validation System
- **Real-time validation** with instant feedback
- **Pattern matching** for names, emails, and phone numbers
- **Date validation** with calendar picker support
- **Decimal number support** for duration fields
- **Required field highlighting** and error messages

### Database Optimization
- **Conditional saving** - only saves relevant data fields
- **Data type validation** before database operations
- **Optimized queries** for better performance
- **Real-time synchronization** across devices

### Security Implementations
- **Rate limiting**: 60-second cooldown for password reset
- **Email change protection**: 5-minute cooldown between attempts
- **Input sanitization** to prevent injection attacks
- **Secure authentication** with Firebase best practices

## 🔧 Development Highlights

### Recent Achievements (Aug 11-14, 2025)
- ✅ **24 commits** with comprehensive feature additions
- ✅ **3,328 lines** of new code added
- ✅ **17 files** enhanced and optimized
- ✅ **Complete authentication system** implemented
- ✅ **Production deployment** with CI/CD pipeline

### Code Quality
- **Modular architecture** with reusable components
- **Consistent coding standards** throughout the project
- **Comprehensive error handling** and user feedback
- **Performance optimized** with efficient data loading

## 🌐 Deployment

## 🔒 Security & Best Practices

### Security Considerations:
- **Environment Variables**: Never commit `.env` files - use `.env.example` as template
- **Firebase Configuration**: API keys are client-safe but restrict by domain in production
- **Admin Access**: First user becomes admin automatically if none exist (Emergency Mode)
- **Input Validation**: All data validated client and server-side
- **Authentication**: Firebase Auth provides secure session management

### Production Checklist:
- ✅ Set environment variables in hosting platform
- ✅ Configure Firebase security rules
- ✅ Use separate Firebase projects for dev/staging/prod
- ✅ Monitor Firebase usage and set quotas
- ✅ Test email simulation thoroughly

## 🚀 Deployment

The application is automatically deployed using GitHub Actions:

1. **Push to main branch** triggers deployment
2. **Build process** runs automatically  
3. **Firebase Hosting** serves the application
4. **Environment variables** are securely managed

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines:
- Follow Vue.js 3 Composition API patterns
- Use PrimeVue components consistently
- Validate all user inputs properly
- Test email simulation thoroughly
- Add proper error handling

## 📞 Support

- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Documentation**: All setup instructions are in this README
- **Email Simulation**: Check browser console (F12) for detailed logs

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🏥 Built with ❤️ for healthcare professionals and patients**

## 👨‍💻 Developer

**Contrail** - [GitHub Profile](https://github.com/Contraill)

---

### 📊 Project Statistics
- **Languages**: JavaScript (Vue.js), HTML, CSS
- **Framework**: Vue.js 3 with Options API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **UI Library**: PrimeVue
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting + GitHub Actions

### 🏗️ Architecture Decisions
- **Single Page Application (SPA)** for smooth user experience
- **Component-based architecture** for maintainability
- **Real-time database** for instant data synchronization
- **Progressive Web App** capabilities for mobile experience

---

*Built with ❤️ for better health tracking and management*
