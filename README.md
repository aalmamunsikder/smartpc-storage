# SmartPC Storage

A modern cloud storage desktop application built with Next.js and Electron.

## Features

- File management with drag and drop functionality
- Category-based file organization
- Multiple view modes (list and grid)
- Sync with external cloud storage services
- Dark/light theme support
- File search and filtering capabilities
- Folder navigation
- Batch operations (move, copy, delete)

## Tech Stack

- Next.js
- Electron
- TypeScript
- TailwindCSS
- Radix UI Components
- dnd-kit for drag and drop

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/smartpc-storage.git
   cd smartpc-storage
   ```

2. Install dependencies
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server
   ```bash
   npm run electron:dev
   ```

### Build for Production

```bash
npm run electron:build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

```
smartpc-storage/
├── app/                   # Next.js 13+ app directory
│   ├── components/        # Shared UI components
│   │   ├── dashboard/     # Dashboard components including CloudStorage
│   │   └── ui/            # UI components (shadcn)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── [routes]/          # App routes
├── public/                # Static assets
└── styles/                # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [DND Kit](https://dndkit.com/)
- [Lucide Icons](https://lucide.dev/) 