# 📊 Narraviz

> **Transform Your Data Into Compelling Visual Stories**

An AI-powered data storytelling platform that instantly converts complex datasets into engaging, interactive visual narratives for business insights, presentations, and data-driven decision making.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=flat-square&logo=greensock)](https://greensock.com/gsap/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

## ✨ Features

- 🤖 **AI-Powered Insights** - Advanced algorithms automatically discover patterns and generate actionable insights
- 📈 **Smart Visualizations** - Intelligent chart selection and adaptive layouts for maximum impact
- ⚡ **One-Click Publishing** - Transform analysis into polished presentations in seconds
- 🎨 **White-Label Branding** - Custom colors, fonts, and styling for brand consistency
- 📤 **Multi-Format Export** - PDF, PowerPoint, web widgets, and secure sharing links
- 🔒 **Enterprise Security** - SOC 2 Type II certified with end-to-end encryption
- 📱 **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- 🎭 **Smooth Animations** - Professional GSAP-powered animations and interactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohmmadpouryousefi/Narraviz.git
   cd Narraviz
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: GSAP (GreenSock)
- **Icons**: Lucide React

### Development Tools
- **Linting**: ESLint
- **Code Formatting**: Prettier (via ESLint config)
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm/yarn

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components (Navbar, Footer)
│   ├── sections/         # Page sections (Hero, Features, etc.)
│   ├── animations/       # GSAP animation components
│   ├── charts/          # Chart components
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## 🎨 Design System

Narraviz uses a carefully crafted design system with:

- **Custom Color Palette**: Data-primary, secondary, and accent colors
- **Typography**: Responsive text scales and font weights
- **Components**: Consistent UI components built with shadcn/ui
- **Animations**: Smooth GSAP-powered micro-interactions
- **Dark/Light Mode**: Adaptive theming support

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler check
```

### Component Development

All components follow these conventions:
- **TypeScript**: Fully typed with proper interfaces
- **Client Components**: Use `"use client"` directive when needed
- **Responsive**: Mobile-first design approach
- **Accessible**: ARIA labels and semantic HTML
- **Animated**: GSAP animations for enhanced UX

### Adding New Sections

1. Create component in `src/components/sections/`
2. Export from the component file
3. Import and use in `src/app/page.tsx`
4. Add smooth scroll target if needed

## 🌟 Key Components

### Landing Page Sections
- **HeroSection**: Video background with animated text and CTAs
- **HowItWorksSection**: 3-step process with interactive demonstrations
- **FeaturesSection**: 6 feature cards with hover animations
- **PricingSection**: 3-tier pricing with popular plan highlighting
- **CTASection**: Final conversion section with gradient background

### Layout Components
- **Navbar**: Sticky navigation with smooth scroll and mobile menu
- **Footer**: Professional footer with social links and newsletter

### Animation Components
- **HeroTextAnimation**: Staggered text reveal animations
- **RevealOnScroll**: Intersection observer-based animations
- **MagneticButton**: Magnetic hover effect for buttons
- **DataVisualization**: Interactive chart demonstrations

## 📱 Responsive Design

Narraviz is built mobile-first with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

All components adapt seamlessly across devices with optimized touch targets and readable typography.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@narraviz.com
- **Documentation**: [docs.narraviz.com](https://docs.narraviz.com)
- **Issues**: [GitHub Issues](https://github.com/mohmmadpouryousefi/Narraviz/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [GSAP](https://greensock.com/) for powerful animations
- [Lucide](https://lucide.dev/) for beautiful icons

---

<div align="center">
  <strong>Built with ❤️ by the Narraviz Team</strong><br>
  <sub>Transform your data. Tell your story. Drive results.</sub>
</div>
