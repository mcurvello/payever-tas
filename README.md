# NestJS REST API with MongoDB and External API Integration

This is a sample NestJS REST API that communicates with an external API to retrieve user data and allows users to manage their avatars. It uses MongoDB to store user avatars.

## Prerequisites

- Node.js and npm installed (Node.js version 14 or above recommended).
- MongoDB 4.4 and above installed and running on localhost.
- RabbitMQ 3.7 and above installed and running on localhost (optional for dummy event sending).

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mcurvello/payever-tas.git
cd payerver-tas
```

2. Install dependencies:

```bash
npm install
```

## Configuration

Before running the application, you may need to configure the MongoDB connection URL and RabbitMQ settings if you choose to use RabbitMQ.

Open src/app.module.ts and replace 'mongodb://localhost/your-database-name' with your MongoDB connection URL.

If you want to use RabbitMQ (for dummy event sending), open src/main.ts and modify the RabbitMQ configuration accordingly.

## Running the Application

To start the NestJS server:

```bash
npm run start
```

The server will start on http://localhost:3000

## Testing

To run the unit tests:

```bash
npm run test
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.
