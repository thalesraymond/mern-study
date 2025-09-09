# Jobify: A MERN Stack Job Application Tracker

![Jobify](./client/src/assets/images/main.svg)

Jobify is a full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It's a comprehensive project created as part of a MERN development course, designed to showcase a complete development workflow from scratch to deployment.

This application helps users track their job applications, providing a clean and intuitive interface to manage job statuses, details, and statistics.

## Features

*   **User Authentication:** Secure user registration and login with JWT (JSON Web Tokens).
*   **CRUD Operations:** Create, Read, Update, and Delete job applications.
*   **Dashboard:** A central hub for users to view and manage their job applications.
*   **Statistical Charts:** Visualize job application data with charts and graphs.
*   **Search and Filter:** Easily search and filter job applications by status, type, and more.
*   **Dark Mode:** A comfortable viewing experience in low-light environments.

## Technologies

This project is built with a modern technology stack:

**Frontend:**

*   [React](https://reactjs.org/)
*   [React Router](https://reactrouter.com/)
*   [Styled Components](https://styled-components.com/)
*   [Vite](https://vitejs.dev/)

**Backend:**

*   [Node.js](https://nodejs.org/)
*   [Express.js](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/)
*   [Mongoose](https://mongoosejs.com/)
*   [JWT](https://jwt.io/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm
*   MongoDB Atlas account or a local MongoDB instance

### Installation

1.  **Clone the repo:**

    ```sh
    git clone https://github.com/your-username/mern-study.git
    ```

2.  **Install NPM packages for both the server and the client:**

    ```sh
    npm run setup-project
    ```

3.  **Set up your environment variables:**

    Create a `.env` file in the root of the project and add the following:

    ```
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

Use the following command to run both the frontend and backend servers concurrently:

```sh
npm run dev
```

Your application will be available at `http://localhost:3000`.
