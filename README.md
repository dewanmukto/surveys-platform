# surveys-platform

A modern, production-ready alternative to Google Forms built with Next.js, TypeScript, and Supabase.

## Features

- 🔐 **Secure Authentication** - User accounts with Supabase Auth
- 📝 **Advanced Form Builder** - Drag & drop interface with 15+ field types
- 📊 **Real-time Analytics** - Track responses with beautiful charts
- 📤 **Data Export** - Export responses to CSV format
- 🎨 **Modern UI** - Glassy, minimalist design with adaptive colors
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Real-time Updates** - Live response tracking
- 🔒 **Row Level Security** - Enterprise-grade data protection

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI**: Tailwind CSS, Radix UI, Iconify (Solar icons)
- **Deployment**: Vercel
- **Database**: PostgreSQL with Row Level Security

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd surveys-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Field Types Supported

- Short Text
- Long Text (Textarea)
- Email
- URL
- Phone Number
- Number
- Rating (Stars)
- Linear Scale
- Dropdown
- Multiple Choice (Radio)
- Checkboxes
- Multiple Choice Grid (Matrix)
- Date
- File Upload
- Section Break

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

© 2025 Dewan Mukto Co. All rights reserved.
