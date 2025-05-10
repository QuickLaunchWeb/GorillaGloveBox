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

## Testing

The project includes comprehensive mock Kong server utilities for development and testing:

```typescript
// Example test setup
import { startTestKong, stopTestKong } from './test/kongTestUtils';

describe('Gateway Management', () => {
  let server: SetupServerApi;

  beforeAll(() => {
    server = startTestKong(); // Start mock server
  });

  afterAll(() => {
    stopTestKong(server); // Clean up
  });
  
  // Tests...
});
```

### Test Commands
```bash
npm test       # Run tests using mock Kong server
npm run test:coverage  # Run tests with coverage reporting
```

### Mock Server Features
- Full CRUD operations for Services, Routes, and Plugins
- Realistic responses matching Kong Admin API specs
- Supports all core Kong entities:
  - Services, Routes, Plugins
  - Consumers, Certificates
  - Upstreams, SNIs
- Automatic cleanup after tests

## Development Setup

### Prerequisites

- Node.js (v16+ recommended)
- (Optional) Kong Gateway instance for end-to-end testing
- npm/yarn

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

### Testing
```bash
npm test       # Runs tests with mock server
npm run test:watch  # Watch mode for development
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

## Connecting to Kong
1. Click the gateway selector in the top-right
2. Choose "Add New Gateway"
3. Enter your Kong Admin URL (e.g. http://localhost:8001)
4. Configure TLS settings if needed

## License

MIT
