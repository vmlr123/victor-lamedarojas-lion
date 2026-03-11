# Inventory EJS

A web application for browsing and managing an inventory. Built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register and login with Passport.js local strategy
- **Items**: Browse and manage items
- **Session Management**: Secure session handling with MongoDB store
- **User Profiles**: User accounts with item management
- **Responsive Design**: EJS templated views

## Tech Stack

### Backend

- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Authentication & Security

- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing
- **helmet** - HTTP headers security
- **xss-clean** - XSS protection
- **host-csrf** - CSRF protection
- **express-rate-limit** - Rate limiting
- **express-session** - Session management
- **connect-mongodb-session** - MongoDB session store

### Frontend

- **EJS** - Templating engine
- **CSS** - Styling

### Development Tools

- **Nodemon** - Auto-reload during development
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Installation

**Clone the repository**

git clone git@github.com:vmlr123/victor-lamedarojas-lion.git
cd victor-lamedarojas-lion

```

**Install dependencies**

npm install

## Environment Variables

Create a `.env` file in the root directory with the following variables:

PORT=3000 (optional)
MONGO_URI=mongodb://your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key

### Development (with auto-reload)

npm start

### Production

npm run

## Usage

### Authentication Routes (`/sessions`)

- `GET /sessions/register` - Register page
- `POST /sessions/register` - Register new user
- `GET /sessions/logon` - Login page
- `POST /sessions/logon` - Login user
- `GET /sessions/logout` - Logout user

### Items Routes (`/items`)

_(Protected - requires authentication)_

- `GET /items` - View all items
- `GET /items/:id` - View specific item
- `POST /items` - Create new item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item

### Home

- `GET /` - Home page
```
