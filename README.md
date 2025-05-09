# GorillaGloveBox

A modern web-based graphical user interface (GUI) for managing Kong Gateway instances through their Admin APIs.

## Features

- Connect to multiple Kong Gateway instances (both OSS and Enterprise)
- View, create, update, and delete Kong entities (Services, Routes, Plugins, etc.)
- Support for HTTP and HTTPS with TLS verification option
- Modern, intuitive interface with responsive design
- Local storage of gateway configurations

## Tech Stack

- React (with TypeScript)
- Material UI for component library
- Zustand for state management
- Axios for API requests
- js-yaml for YAML parsing/stringifying

## Development Setup

### Prerequisites

- Node.js (v14+) and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Usage

1. Start the application
2. Add a Kong Gateway connection using the dropdown in the top-right corner
3. Navigate between Kong entities using the sidebar
4. Create, view, update, or delete Kong entities as needed

## Configuration

Gateway connections support the following options:

- Name: A friendly name for your Kong Gateway instance
- Admin API URL: The URL of the Kong Admin API (e.g., http://localhost:8001 or https://kong-admin.example.com:8444)
- Authentication: Optional username/password if your Kong Admin API requires Basic Auth
- Skip TLS Verification: Option to disable TLS certificate verification for self-signed certificates

## License

MIT
