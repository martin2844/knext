![knext](./knext-app.png)
# Knext 🚀

Welcome to **Knext** - a Next.js starter template that incorporates NextAuth, styled using TailwindCSS, and utilizes SQLite with KNEX for efficient query building. Knext combines the powerful features of these technologies to streamline the setup of Next.js projects.

## Technologies Used 🛠️

- **Next.js** - The React framework for production.
- **NextAuth.js** - Authentication for Next.js.
- **TailwindCSS** - A utility-first CSS framework for rapid UI development.
- **SQLite** - A C-language library that implements a small, fast, self-contained SQL database engine.
- **KNEX** - A SQL query builder for JavaScript.

## Getting Started 🏁

Follow these instructions to get your copy of the starter up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js**: `>=20.9.0` (required by Next.js 16 and better-sqlite3 12).
- **npm**: installed on your system. You can install it from [npmjs.com](https://www.npmjs.com/get-npm).

> **Note on dependencies**: this starter uses **NextAuth.js v5 beta** because it is the version built for the Next.js App Router. The latest stable v4 release does not integrate as cleanly with App Router and currently depends on a vulnerable `uuid` version, so v5 beta is intentionally used while it remains the best-supported option for this stack.

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:martin2844/knext.git
   ```

2. Navigate to the project directory:
   ```bash
   cd knext
   ```
3. Install dependencies:
   ```bash
   npm i
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

Now, your server should be running on [http://localhost:3000](http://localhost:3000). Open your browser and visit the address to see your starter in action!

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```sh
AUTH_GITHUB_ID="your-github-app-id"
AUTH_GITHUB_SECRET="your-github-app-secret"
AUTH_SECRET="a-strong-random-secret"
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:3000
```

- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth app credentials.
- `AUTH_SECRET` — a strong random string used by NextAuth.js to sign tokens.
- `AUTH_URL` — the canonical URL of your app (used by NextAuth.js v5).
- `NEXT_PUBLIC_URL` — public URL exposed to the browser.

## Database Migrations

This starter uses KNEX for managing database migrations, which helps in version controlling your database schema. Below are the commands available in `package.json` to handle migrations:

- **`npm run migrate:make <name>`**: Create a new migration file with the specified `<name>`. This is where you define changes to your database schema.
- **`npm run migrate:latest`**: Apply all pending migrations to your database. This updates your schema to the latest version.
- **`npm run migrate:rollback`**: Roll back the last batch of migrations, allowing you to undo recent changes to the schema.

### Example Migration

Included in this starter is a migration for setting up a `users` table, tailored to work with NextAuth. Here's what the migration scripts look like:

#### Up Migration (Create Table)

```javascript
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.string("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("image");
    })
    .then(() => console.log("Migration done"));
};
```

#### Down Migration (Drop Table)

```javascript
exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
    .then(() => console.log("Rollback done"));
};
```

A separate migration (`src/migrations/*_add_unique_email_to_users.js`) adds a unique index on `email` to prevent duplicate accounts from concurrent OAuth callbacks.

These migrations are crucial for managing the user data associated with the GitHub auth provider via NextAuth.

## Docker

To run the application using Docker, follow these steps:

1. Build the Docker image:

   ```bash
   docker build -t knext .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 knext
   ```

Alternatively, you can use Docker Compose for a more streamlined setup:

1. Ensure you have Docker Compose installed on your system.
2. Run the following command in the project root:
   ```bash
   docker-compose up
   ```

This will build the image if it doesn't exist and start the container. The application will be accessible at http://localhost:3000.

## Contributing 🤝

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments 🎉

- Hat tip to anyone whose code was used
- Inspiration
- etc

We hope you enjoy using Knext as much as we enjoyed creating it! 🚀

## Resources

- [Next Auth Docs](https://next-auth.js.org/getting-started/example)
- [Knex Docs](https://knexjs.org/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
