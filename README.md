# Social Media API (NODE-Repository-API)

A Node.js application to replicate social media platform. Built with the repository-API pattern.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User

  - Sign up
  - Sign in
  - Sign out
  - Sign out from all devices
  - Get user details
  - Get all users
  - Update user details

- Post

  - Create
  - Get post by id
  - Get user posts
  - Get all posts
  - Update (only post creator can do)
  - Delete (only post creator can do)

- Comment

  - Create
  - Get comments by post
  - Update (only post creator or comment creator can do)
  - Delete (only post creator or comment creator can do)

- Like

  - Get likes of comment/post
  - toggle like of comment/post

- Friendship

  - Send friend request
  - Get all friend requests
  - Get all friends
  - Toggle friendship (add or remove from friend list)
  - Accept or Reject friend request

- OTP based password reset
  - Send OTP to reset password
  - Verify the OTP and update the password

## Prerequisites

- Node.js (>=14.x)
- npm (>=6.x)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kirankumar-Matham96/Social-Media-API-2.git

   ```

2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:

- Create a `.env` file in the root directory and add the following:
  ```bash
    PORT=8000
    DB_URL=mongodb://localhost:27017/social-media
    SECRET_KEY='your_secret_key'
  ```

4. Start the application:

- if dev:

```bash
npm run dev
```

- if production

```bash
 npm run start
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

    POST AWAY - II/
    ├── src/
    │ ├── config/
    │ │ └── mongoose.config.js
    │ ├── config/
    │ │ └── mongoose.config.js
    │ ├── features/
    │ │ ├── comments/
    │ │ | ├── controllers/
    │ │ | | └── comment.controller.js
    │ │ | ├── repositories/
    │ │ | | └── comment.repository.js
    │ │ | ├── routes/
    │ │ | | └── comment.routes.js
    │ │ | └── schemas/
    │ │ | └── comment.schema.js
    │ │ ├── friendship/
    │ │ | ├── controllers/
    │ │ | | └── friendship.controller.js
    │ │ | ├── repositories/
    │ │ | | └── friendship.repository.js
    │ │ | ├── routes/
    │ │ | | └── friendship.routes.js
    │ │ | └── schemas/
    │ │ | └── friendship.schema.js
    │ │ ├── likes/
    │ │ | ├── controllers/
    │ │ | | └── likes.controller.js
    │ │ | ├── repositories/
    │ │ | | └── likes.repository.js
    │ │ | ├── routes/
    │ │ | | └── likes.routes.js
    │ │ | └── schemas/
    │ │ | └── likes.schema.js
    │ │ ├── OTP/
    │ │ | ├── controllers/
    │ │ | | └── otp.controller.js
    │ │ | ├── repositories/
    │ │ | | └── otp.repository.js
    │ │ | ├── routes/
    │ │ | | └── otp.routes.js
    │ │ | └── schemas/
    │ │ | └── otp.schema.js
    │ │ ├── posts/
    │ │ │ ├── controllers/
    │ │ │ | └── post.controller.js
    │ │ │ ├── repositories/
    │ │ │ | └── post.repository.js
    │ │ │ ├── routes/
    │ │ │ | └── post.routes.js
    │ │ │ └── schemas/
    │ │ │ └── post.schema.js
    │ │ └── user/
    │ │ ├── controllers/
    │ │ | └── user.controller.js
    │ │ ├── repositories/
    │ │ | └── user.repository.js
    │ │ ├── routes/
    │ │ | └── user.routes.js
    │ │ └── schemas/
    │ │ └── tokenBlocklist.schema.js
    │ │ └── user.schema.js
    | └── middlewares/
    │ ├── 404Handler/
    | | └── unknownPathHandler.middleware.js
    │ ├── authorization/
    | | └── auth.middleware.js
    │ ├── errorHandling/
    | | └── customErrorHandling.middleware.js
    │ ├── Loggers/
    | | └── combinedLogger.middleware.js
    | | └── userLogger.middleware.js
    │ ├── uploadFileHandling/
    | | └── multer.middleware.js
    │ └── validations/
    │ ├── comment/
    │ | └── commentValidation.middleware.js
    │ ├── post/
    │ | └── postValidation.middleware.js
    │ └── user/
    │ └── userValidation.middleware.js
    ├── .env
    ├── .gitignore
    ├── combined.log
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── server.js

## API Endpoints

### User Routes

- `POST /api/users/signup`: Register a new user
- `POST /api/users/signin`: Login a user
- `GET /api/users/logout`: Logout a user
- `GET /api/users/logout-all-devices`: Logout a user from all devices
- `GET /api/users/get-details/:id`: Get details of user by id
- `GET /api/users/get-all-details`: Get details of all users
- `GET /api/users/update-details/:id`: Update user details by id

### Post Routes

- `POST /api/posts/`: Create a post
- `GET /api/posts/:id`: Get a post by id
- `GET /api/posts`: Get all posts of the user
- `GET /api/posts/all`: Get all posts
- `PUT /api/posts/:id`: Update a post by id
- `DELETE /api/posts/:id`: Delete a post by id

### Comment Routes

- `POST /api/comments/:id`: Add a comment to a post by post id (id -> post id)
- `GET /api/comments/:id`: Get comments of a post by post id (id -> post id)
- `PUT /api/comments/:id`: Update comment of a post by id (id -> comment id)
- `DELETE /api/comments/:id`: Update comment of a post by id (id -> comment id)

### Like Routes

- `GET /api/likes/toggle/:id?type=<entity>`: Add or remove like by id (id -> post id or comment id, type entity -> "Post" or "Comment")
- `GET /api/likes/:id`: Get likes by id (id -> post id or comment id)

### Friendship Routes

- `POST /api/friends/send-request/:id`: Send a friend request
- `GET /api/friends/get-friends/:id`: Get friends
- `GET /api/friends/get-pending-requests`: Get friend pending requests
- `GET /api/friends/toggle-friendship/:id`: Add or remove from friend list
- `GET /api/friends/response-to-request/:id?response=<option>`: Accept or reject a friend request (option -> "accept" or "reject")

### OTP Routes

- `POST /api/otp/send`: Send an OTP to email
- `POST /api/otp/verify`: Verify the OTP
- `PUT /api/otp/reset-password`: Reset the password

## Technologies Used

- Node.js
- Express
- MongoDB (Mongoose)
- express-validator (for validation)
- bcrypt
- dotenv
- jsonwebtoken
- mongoose
- multer
- nodemailer
- otp-generator
- winston
- REST Full API

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
