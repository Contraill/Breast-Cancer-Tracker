# 🏥 Health Tracker

A comprehensive web application for tracking personal health information, built with Vue.js 3 and Firebase. This application provides secure user authentication, detailed health data collection, and real-time data synchronization.

## ✨ Features

### 🔐 Authentication System
- **User Registration & Login** with email/password
- **Password Reset** functionality with email verification
- **Email Change** with re-authentication security
- **Rate Limiting** to prevent spam and abuse
- **Secure Session Management** with Firebase Auth

### 📋 Health Data Management
- **Personal Information** collection and validation
- **Health History** tracking with decimal year support (e.g., 0.5 = 6 months)
- **Medical Conditions** and treatment history
- **Lifestyle Factors** (smoking, alcohol, exercise)
- **Family Medical History** documentation
- **Real-time Data Synchronization** with Firebase Firestore

### 🎨 User Interface
- **Responsive Design** optimized for all devices
- **Modern UI Components** using PrimeVue library
- **Real-time Form Validation** with instant feedback
- **Date Picker** with keyboard input support
- **Professional Styling** with custom CSS
- **Accessible Design** following WCAG guidelines

### 🔒 Security Features
- **Input Validation** with pattern matching
- **XSS Protection** through sanitized inputs
- **User Enumeration Prevention** with generic error messages
- **Production-Safe Logging** (console.log hidden in production)
- **Conditional Database Saving** to prevent data bloat

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
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Contraill/Breast-Cancer-Tracker.git
   cd health-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
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

The application is automatically deployed using GitHub Actions:

1. **Push to main branch** triggers deployment
2. **Build process** runs automatically
3. **Firebase Hosting** serves the application
4. **Environment variables** are securely managed

Live Demo: [Health Tracker App](https://your-firebase-app.web.app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
