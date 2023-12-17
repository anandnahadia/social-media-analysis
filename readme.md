# Social Media Analysis Microservice

## Setup

### Prerequisites

- Docker
- Node.js (version x.x.x)
- npm (version x.x.x)

### 1. Docker Compose

Start Postgres, Redis, and RabbitMQ servers using the following command:

```bash
docker-compose up -d
```

### 2. Node Packages

Install Node packages using:

```bash
npm install
```

### 3. Migrations

Run migrations to set up the database:

```bash
npx sequelize-cli db:migrate
```
### 4. Compile TypeScript Code

Compile TypeScript code using:

```bash
npm run tsc
```
### 5. Run the Server

Start the server:

```bash
node dist/index.js
```

## Infrastructure and Scaling

### Redis Cache
The microservice utilizes Redis caching with a TTL of 3600 seconds to store analysis results. This enhances performance by serving cached results for repeated requests within the TTL.

### RabbitMQ Queues
RabbitMQ queues are employed for performing analysis asynchronously. The microservice enqueues analysis tasks, allowing for scalable and efficient processing.

### IP-Based Rate Limiting
To manage request rates, the microservice employs IP-based rate limiting. Each IP is allowed a maximum of 100 requests within a 15-minute window. This helps prevent abuse and ensures fair usage.

## Assumptions and Decisions

### Unique Identifier: 
The assumption is that users will provide a unique identifier along with the text content of the post. This identifier is crucial for distinguishing between posts.

