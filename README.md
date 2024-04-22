This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Creating a PostgreSQL Database

Before proceeding with Prisma setup, ensure you have a PostgreSQL database. Here's how to create one:

1. **Open your terminal**.

2. **Connect to PostgreSQL** using the `psql` command-line tool:

   ```bash
   psql -h localhost -U postgres
   ```

   You might need to replace `postgres` with your PostgreSQL superuser username.

3. **Create the Database**:

   ```sql
   CREATE DATABASE mydatabase;
   ```

   Replace `mydatabase` with your desired database name.

4. **Grant Permissions** (if necessary):

   ```sql
   GRANT ALL PRIVILEGES ON DATABASE mydatabase TO username;
   ```

   Replace `username` with the name of the database user.

## Setting Up a Local Database with Prisma

To set up a local database for development:

1. **Install Prisma CLI**:

   ```bash
   yarn add prisma --dev
   ```

2. **Initialize Prisma** in your project:

   ```bash
   npx prisma init
   ```

   This command creates a new `prisma` directory with a `schema.prisma` file for your database schema, and a `.env` file for environment variables.

3. **Configure your database connection** in the `.env` file:

   ```plaintext
   DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase"
   ```

   Replace `username`, `password`, and `mydatabase` with your PostgreSQL credentials and database name.

4. **Create your database schema** in `schema.prisma`. Define your models which Prisma will use to create database tables.

5. **Run Prisma Migrate** to create the database tables:

   ```bash
   npx prisma migrate dev --name init
   ```

   This command creates the tables in your database based on the models defined in `schema.prisma`.

6. **Install Prisma Client** to query the database:

   ```bash
   yarn add @prisma/client
   ```

7. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```
   This step generates and installs the Prisma Client based on your schema, which you can then use in your application to interact with your database.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
