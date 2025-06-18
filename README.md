# 📘 Student Management System (StuMan)

*A modern web application for managing competitive programming students with Codeforces integration.*

![Screenshot of Student Management System](https://res.cloudinary.com/du7a1obsy/image/upload/v1750224977/Screenshot_2025-06-18_105205_ljyrno.png)

---

## 🚀 Overview

**StuMan** is a comprehensive student management system designed specifically for tracking and analyzing competitive programming performance. It integrates with **Codeforces** to provide detailed insights into student progress, contest performance, and problem-solving patterns.

---

## ✨ Features

- **Student Management**: Add, edit, and delete student profiles
- **Codeforces Integration**: Sync and display student performance data from Codeforces
- **Performance Analytics**:
  - Rating history visualization
  - Problem-solving distribution by difficulty
  - Activity heatmap
  - Contest performance analysis
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## 🏗️ Project Structure

``` bash
client/
├── public/               # Static assets and HTML template
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── BarChartSolved.jsx    # Problem difficulty distribution chart
│   │   ├── ChatRating.jsx        # Rating history visualization
│   │   ├── ContestTable.jsx      # Contest performance table
│   │   ├── DarkModeToggle.jsx    # Theme switcher component
│   │   ├── HeatMap.jsx           # Activity visualization
│   │   ├── Navbar.jsx            # Navigation component
│   │   └── ThemeCard.jsx         # Theme-aware card component
│   ├── context/          # React context providers
│   │   └── ThemeContext.jsx      # Dark mode implementation
│   ├── pages/            # Application views
│   │   ├── StudentProfile.jsx    # Detailed student profile
│   │   └── ThemeShowcase.jsx     # Theme demonstration
│   ├── router/           # Routing configuration
│   │   └── AppRoutes.js          # Application routes
│   ├── services/         # API service layer
│   │   └── StudentServices.jsx   # Student data API calls
│   ├── styles/           # Global styles
│   │   └── global.css            # Global CSS rules
│   ├── utils/            # Utility functions
│   ├── App.js            # Main application component
│   └── index.js          # Application entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```


---

## 🔧 Technology Stack

- **Frontend Framework**: React 19
- **Routing**: React Router 7
- **Styling**: TailwindCSS 3
- **Charts**: Recharts 2
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Build Tool**: Create React App

---

## 🌙 Dark Mode Implementation

- Toggle between light and dark themes
- Preferences saved using `localStorage`
- Detects system preference via `prefers-color-scheme`
- Smooth transitions between themes
- Theme-aware components with proper color contrast

---

## 📊 Data Visualization

StuMan includes powerful data visualization tools:

- **Rating History Chart**: Line chart showing rating progression
- **Problem Distribution Chart**: Bar chart for problems solved by difficulty
- **Activity Heatmap**: Calendar-style problem-solving activity view
- **Contest Performance Table**: Detailed view of contest statistics

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/student-management-system.git
cd student-management-system

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Start the development server
```bash
# Run backend
cd server
npm start

# Run frontend
cd ../client
npm start
Open http://localhost:3000 in your browser.
```

## 🔄 API Integration
The frontend communicates with a Node.js/Express backend.

API Endpoints
- GET /api/students - List all students

- POST /api/students - Add a new student

- PUT /api/students/:id - Update student

- DELETE /api/students/:id - Delete student

- GET /api/students/:id/pro - Get detailed student profile

- POST /api/sync - Sync all students' Codeforces data

## 🧩 Component Architecture
- StudentProfile: Main profile with analytics
- ChartRating: Rating history visualization
- BarChartSolved: Difficulty distribution
- HeatMap: Activity calendar
- ContestTable: Contest performance analyzer
- ThemeContext: Manages dark/light theme

## 🎨 Styling and Design System
- TailwindCSS with custom configuration
- Class-based dark mode strategy
- Smooth transitions between themes
- Unified color palette for light/dark modes
- Fully responsive layout for all screen sizes

## 📝 Development Notes
### Code Conventions
- Component files: PascalCase (e.g., StudentProfile.jsx)
- Context providers: PascalCase + Context suffix
- Service files: PascalCase + Services suffix
- Utility functions: camelCase

### State Management
- React Context API: Theme management
- Component-level state: For UI interactions
- Data fetching: Via React hooks

## 🔧 Available Scripts
``` bash
npm start       # Runs the app in development mode
npm test        # Launches test runner
npm run build   # Builds the app for production
npm run eject   # Ejects CRA configuration
```

## 📱 Responsive Design
- Mobile-first layout
- Tailwind breakpoints for all devices
- Optimized UI/UX for small and large screens
- Touch-friendly interactions

## 🔄 Future Enhancements
- 🔐 User authentication and role-based access
- 🎨 Additional theme options
- 📴 Offline support via service workers
- ⚡ Performance optimization for large datasets
- 🔍 Advanced filtering and search features

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

🙌 Credits
Built with ❤️ by Jayant Joshi

