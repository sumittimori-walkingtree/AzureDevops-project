# Next.js Frontend & Express.js Backend with TailwindCSS

This is a full-stack application with a Next.js frontend and Express.js backend, styled with TailwindCSS.

## Project Structure

```
/
├── frontend/           # Next.js frontend application
│   ├── src/            # Source code
│   │   ├── app/        # Next.js App Router
│   │   │   ├── page.js # Home page
│   │   │   └── services/api.js # API service for backend communication
│   │   └── ...             # Other Next.js configuration files
│   ├── public/         # Static assets
│   └── ...             # Other Next.js configuration files
│
├── backend/            # Express.js backend application
│   ├── server.js       # Main server file
│   ├── .env            # Environment variables
│   └── ...             # Other backend files
│
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on http://localhost:5000.

#### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend development server will run on http://localhost:3000.

## Features

- Next.js frontend with App Router
- Express.js backend with RESTful API
- TailwindCSS for styling
- API service for communication between frontend and backend



## Environment Variables



```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)

```
PORT=5000
NODE_ENV=development
```

## License

This project is open source and available under the [MIT License](LICENSE). 