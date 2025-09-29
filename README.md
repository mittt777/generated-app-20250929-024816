# OrbitBill - Subscription Billing SaaS Template

A visually stunning and feature-complete SaaS template for subscription billing applications, built on Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mittt777/generated-app-20250929-024816)

OrbitBill is a production-ready, visually stunning SaaS template designed for building subscription-based applications. It provides a complete frontend and backend foundation running on Cloudflare Workers. The template includes a beautiful marketing landing page, a functional user dashboard, subscription and billing management, and user profile settings. The design prioritizes a minimalist aesthetic, exceptional user experience, and a polished, professional look and feel, making it the perfect starting point for any modern SaaS product.

## Key Features

-   **Stunning Marketing Page**: A professional landing page with a hero section, feature highlights, and a multi-tiered pricing table.
-   **Functional User Dashboard**: An overview of subscription status, key usage metrics, and recent activity for authenticated users.
-   **Subscription & Billing Management**: A dedicated page for users to manage their plan, view invoice history, and update payment methods.
-   **User Profile Settings**: A page for users to update their personal information and manage account preferences.
-   **Modern Authentication**: Clean, user-friendly forms for sign-in, sign-up, and password recovery.
-   **Built on Cloudflare**: Leverages the power and scalability of Cloudflare Workers and Durable Objects for a robust backend.
-   **Design Excellence**: A minimalist, clean, and modern design system built with Tailwind CSS and shadcn/ui.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript
-   **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
-   **Routing**: React Router
-   **State Management**: Zustand
-   **Forms**: React Hook Form, Zod
-   **Backend**: Hono on Cloudflare Workers
-   **Storage**: Cloudflare Durable Objects

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   A Cloudflare account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/orbitbill.git
    cd orbitbill
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Authenticate with Cloudflare:**
    Log in to your Cloudflare account to be able to run the project locally and deploy it.
    ```bash
    bunx wrangler login
    ```

## Development

To start the local development server, which includes both the Vite frontend and the Wrangler dev server for the backend worker, run:

```bash
bun dev
```

This will:
-   Start the Vite development server for the React frontend, typically on `http://localhost:3000`.
-   Start the Wrangler dev server for the Hono backend, proxying API requests from the frontend.

The application will automatically reload when you make changes to the code.

## Project Structure

-   `src/`: Contains the frontend React application.
    -   `pages/`: Top-level page components for each view.
    -   `components/`: Reusable UI components, including shadcn/ui components.
    -   `store/`: Zustand stores for global state management.
    -   `lib/`: Utility functions.
-   `worker/`: Contains the Cloudflare Worker backend code built with Hono.
-   `shared/`: TypeScript types and interfaces shared between the frontend and backend.

## Deployment

This project is configured for easy deployment to Cloudflare.

### One-Click Deploy

You can deploy this template to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mittt777/generated-app-20250929-024816)

### Manual Deployment via CLI

1.  **Build the project:**
    This command bundles the frontend and backend for production.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    This command deploys your application to the Cloudflare network.
    ```bash
    bun run deploy
    ```

Wrangler will handle the process of uploading your assets and deploying your Worker script. After deployment, you will be provided with a URL to your live application.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.