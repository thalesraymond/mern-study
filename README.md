<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![codecov backend](https://codecov.io/github/thalesraymond/mern-study/branch/main/graph/badge.svg?token=0LXMHIG9FW)](https://codecov.io/github/thalesraymond/mern-study)
[![CI](https://github.com/thalesraymond/mern-study/actions/workflows/ci.yml/badge.svg)](https://github.com/thalesraymond/mern-study/actions/workflows/ci.yml)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/thalesraymond/mern-study">
    <img src="client/src/assets/images/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Jobify</h3>

  <p align="center">
    A full-stack MERN application for tracking job applications.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to help users track their job applications. It provides features for adding, editing, and deleting job applications, as well as viewing statistics about the application process.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]
- [![Node.js][Node.js]][Node-url]
- [![Express.js][Express.js]][Express-url]
- [![MongoDB][MongoDB]][Mongo-url]
- [![TypeScript][TypeScript]][TypeScript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- npm
    ```sh
    npm install npm@latest -g
    ```
- Node.js (v18 or higher)
- MongoDB

### Installation

1. Clone the repo
    ```sh
    git clone https://github.com/thalesraymond/mern-study.git
    ```
2. Install NPM packages for both server and client
    ```sh
    npm run setup-project
    ```
3. Create a `.env` file in the root directory and add the following environment variables:
    ```
     PORT=
     MONGO_URL=
     JWT_SECRET=
     JWT_EXPIRATION=
     CLOUDINARY_CLOUD_NAME=
     CLOUDINARY_API_KEY=
     CLOUDINARY_API_SECRET=
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Use the following command to run the application:

```sh
npm run dev
```

This will start both the client and server concurrently.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the ISC License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[Mongo-url]: https://www.mongodb.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
