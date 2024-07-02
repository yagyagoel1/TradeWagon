# Trade Wagon

Welcome to the Trade Wagon(e.g., Nike, MamaEarth). This platform is designed to showcase and sell products specifically for your company.This project is not your ordinary product selling platform it has lot of industry stuff used in it like s3,bullmq ,proemtheus, github Actions etc.  The project is built with a focus on scalability, security, and ease of use, leveraging various modern technologies and best practices.

## Key Features

- **User Authentication and Authorization:** Secure user sign-up using otp , login, and profile management.
- **Product Management:** Comprehensive product catalog with detailed information.
- **Cart and Checkout:** Seamless shopping cart and checkout process.
- **Order Management:** Efficient order tracking and management.
- **Payment Integration:** Secure payments via Razorpay.
- **Image Storage:**
  - Profile images stored in **Amazon S3**.
  - Product images stored in **Cloudinary**.
- **Scheduled Tasks:** OTP verification emails on signup using **BullMQ**.
- **Containerization:** Docker for consistent development and deployment environments.
- **Monitoring:** Application metrics collected using **Prometheus**.
- **CI/CD:** Automated testing and deployment with **GitHub Actions**.
- **Secure Routes:** Comprehensive security measures implemented across all routes.
- **Tech Stack:** Built with **TypeScript, Prisma, PostgreSQL, and Express**.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Development](#development)
5. [Contributing](#contributing)
6. [License](#license)

## Installation

### With Docker

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yagyagoel1/tradewagon
    cd tradewagon
    ```

2. **Set Up Environment Variables:**

    Create a `.env` file based on the `.env.example` provided and fill in the required environment variables.

3. **Start the Application:**

    ```bash
    docker-compose up
    ```

### Without Docker

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yagyagoel1/tradewagon
    cd tradewagon
    ```

2. **Set Up Environment Variables:**

    Create a `.env` file based on the `.env.example` provided and fill in the required environment variables.

3. **Install Dependencies:**

    ```bash
    npm install
    ```

4. **Database Migration:**

    Ensure PostgreSQL is running and migrate the database:

    ```bash
    npx prisma migrate dev
    ```

5. **Start the Application:**

    ```bash
    npm run dev
    ```

## Usage

After setting up and running the application, you can access the API at `http://localhost:3000`. Use tools like Postman or curl to interact with the API endpoints.

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Register a new user.
- **POST** `/api/auth/login` - User login.
- **GET** `/api/auth/logout` - User logout.

### User Profile

- **GET** `/api/users/me` - Get current user's profile.
- **PUT** `/api/users/me` - Update user profile.
- **DELETE** `/api/users/me` - Delete user account.

### Product Management

- **GET** `/api/products` - Get a list of available products.
- **GET** `/api/products/:id` - Get details of a specific product.
- **POST** `/api/products` - Create a new product (admin only).
- **PUT** `/api/products/:id` - Update product details (admin only).
- **DELETE** `/api/products/:id` - Delete a product (admin only).

### Cart and Checkout

- **GET** `/api/cart` - Get user's cart items.
- **POST** `/api/cart/:productId` - Add a product to the cart.
- **PUT** `/api/cart/:productId` - Update quantity or remove a product from the cart.
- **DELETE** `/api/cart` - Clear the entire cart.
- **POST** `/api/checkout` - Process checkout and create an order.

### Order Management

- **GET** `/api/orders` - Get a list of user's orders.
- **GET** `/api/orders/:orderId` - Get details of a specific order.
- **PUT** `/api/orders/:orderId` - Update order status (admin only).
- **DELETE** `/api/orders/:orderId` - Cancel an order (admin or user).

### Payment Integration

- **POST** `/api/payments` - Process payment for an order using Razorpay.
- **GET** `/api/payments/:id` - Get payment details.

### And many Other Routes

## Development

### Tech Stack

- **Express** - For the web server and API routing.
- **Docker** - For containerization of the application.
- **Prometheus** - For monitoring and collecting metrics.
- **BullMQ** - For job scheduling and processing.
- **Amazon S3** - For storing profile images.
- **Cloudinary** - For storing and managing product images.
- **GitHub Actions** - For CI/CD pipelines.
- **TypeScript** - For a robust and type-safe development experience.
- **Prisma** - For ORM and database management.
- **PostgreSQL** - As the relational database.

### Code Quality


- **Prettier** - For code formatting.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

