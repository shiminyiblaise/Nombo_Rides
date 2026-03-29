# 🚀 Nombo Rides

A modern, full-stack motorcycle ride-hailing platform built with React, TypeScript, and Supabase. Connect riders with passengers for safe, fast, and affordable motorcycle transportation.

![Nombo Rides](https://d64gsuwffb70l.cloudfront.net/69c87ac8cca9a14789abb64f_1774746342456_bafdf5b6.jpeg)

## ✨ Features

### 👤 Multi-User Platform
- **Passengers**: Book rides with real-time tracking and seamless payments
- **Riders**: Manage earnings, ride history, and vehicle information
- **Admins**: Comprehensive dashboard for platform management and analytics

### 🛡️ Security & Safety
- Secure authentication with role-based access control
- Protected routes and data validation
- Real-time ride monitoring and safety features

### 🎨 Modern UI/UX
- Responsive design with dark/light theme support
- Intuitive booking interface with location inputs
- Professional dashboard for all user types
- Built with shadcn/ui components and Tailwind CSS

### 🔧 Technical Excellence
- TypeScript for type safety
- React Query for efficient data fetching
- Form validation with React Hook Form and Zod
- Modern build tooling with Vite

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nombo-rides.git
   cd nombo-rides
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure your Supabase credentials
   - Update API endpoints if needed

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AppLayout.tsx
│   ├── Navbar.tsx
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── AppContext.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
│   ├── api.ts
│   ├── supabase.ts
│   └── utils.ts
├── pages/              # Route components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── UserDashboard.tsx
│   ├── RiderDashboard.tsx
│   └── AdminDashboard.tsx
└── main.tsx           # Application entry point
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Edge functions

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 User Roles & Permissions

### Passenger (User)
- Book rides with pickup/dropoff locations
- View ride history and receipts
- Rate and review rides
- Manage saved locations
- Real-time ride tracking

### Rider (Driver)
- Accept/reject ride requests
- Update availability status
- Track earnings and ride statistics
- Manage vehicle information
- View rider dashboard

### Administrator
- Platform-wide analytics
- User and rider management
- System configuration
- Financial reporting
- Safety monitoring

## 🔮 Future Features Roadmap

### Phase 1: Core Enhancements (Q2 2024)
- [ ] **Real-time GPS Tracking**
  - Live rider location updates
  - ETA calculations
  - Route optimization

- [ ] **Payment Integration**
  - Multiple payment methods (M-Pesa, card, wallet)
  - Secure payment processing
  - Automatic fare calculation

- [ ] **Push Notifications**
  - Ride status updates
  - Promotional offers
  - Safety alerts

### Phase 2: Advanced Features (Q3 2024)
- [ ] **Rating & Review System**
  - 5-star rating for riders and passengers
  - Detailed feedback collection
  - Reputation management

- [ ] **Emergency Features**
  - SOS button for immediate assistance
  - Emergency contact integration
  - Ride safety monitoring

- [ ] **In-App Messaging**
  - Direct communication between rider and passenger
  - Pre-defined safety messages
  - Support chat integration

### Phase 3: Platform Expansion (Q4 2024)
- [ ] **Multi-Language Support**
  - Localization for multiple regions
  - RTL language support
  - Cultural adaptation

- [ ] **Corporate Solutions**
  - Business accounts
  - Bulk ride booking
  - Expense management

- [ ] **Analytics Dashboard**
  - Advanced reporting for admins
  - Rider performance metrics
  - Market insights and trends

### Phase 4: Innovation & Scale (2025)
- [ ] **AI-Powered Features**
  - Smart route suggestions
  - Dynamic pricing
  - Predictive demand forecasting

- [ ] **Third-Party Integrations**
  - Public transport integration
  - Hotel booking partnerships
  - Event ticketing

- [ ] **Advanced Safety**
  - AI-powered safety monitoring
  - Helmet detection
  - Speed limit enforcement

- [ ] **Sustainability Features**
  - Carbon footprint tracking
  - Eco-friendly routing
  - Green rider incentives

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Write tests for new features
- Update documentation as needed
- Ensure code passes linting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Project Link**: [https://github.com/yourusername/nombo-rides](https://github.com/yourusername/nombo-rides)
- **Email**: contact@nomborides.com
- **Website**: [https://nomborides.com](https://nomborides.com)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Supabase](https://supabase.com/) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the powerful frontend library

---

**Made with ❤️ for safer, faster, and more affordable motorcycle transportation.**
