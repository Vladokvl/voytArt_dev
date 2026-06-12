# VoytArt

VoytArt is a modern art gallery web application designed to showcase and sell art. The project includes a user-facing platform (art showcase, exhibition gallery, and shop) and a secure administrative dashboard for managing content such as artists, paintings, collections, categories, and posts.

## [Demo link](https://voyt-art-dev.vercel.app/)

## ✨ Key Features

- **Smooth Scroll Animations:** The main page features a captivating scroll-based animation implemented by sequentially rendering a series of high-quality image frames.
- **Admin Dashboard:** A fully functional, protected area for administrators to manage gallery content. It allows for CRUD operations on artworks, artists, categories, collections, and gallery posts.
- **Dynamic Gallery:** Dedicated pages to explore individual artworks, view collections, and read stories.
- **Shop (WIP):** An e-commerce section designed for purchasing art and related products. *(Note: The shop functionality is currently under development).*

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Media Storage:** [Cloudinary](https://cloudinary.com/) (Fully integrated for uploading, storing, and optimizing images)
- **Authentication:** NextAuth.js / Auth.js (Used to secure the admin panel)
- **Styling:** SCSS (CSS Modules)

## 🛠️ Local Development Setup

Follow these steps to get the project running locally:

### 1. Clone the repository
```bash
git clone <your_repository_url>
cd voytArt_dev
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables Setup
The project uses an `.env.example` file that contains all the required fields for the application to run. Currently, the values are empty and need to be filled in.

1. Copy the `.env.example` file to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and fill in the missing credentials:
   - **Authentication (`AUTH_SECRET`)**: Generate a secret key (e.g., using `npx auth secret`) and paste it here.
   - **Supabase (Prisma)**: Provide the Supabase database connection strings. Use the connection pooling URL for `DATABASE_URL` and the direct database URL for `DIRECT_URL`.
   - **Cloudinary**: Fill in your Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`) so the application can process images correctly.

### 4. Database Setup & Initialization (Prisma + Supabase)
This project uses Supabase as its database. You need to push the Prisma schema to your Supabase instance to create the necessary tables.

1. Push the database schema:
   ```bash
   npx prisma db push
   ```
   *(Alternatively, run `npx prisma migrate dev` if you are using migrations)*

2. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

### 5. Create an Admin User
To access the admin dashboard (`/admin`), you will need an administrative account. Since there is no public registration form for admins, **you must manually create your first admin user directly in your Supabase database** (via the Supabase Studio dashboard or an SQL query). Make sure the user record matches the schema requirements (e.g., email, hashed password using bcrypt 10 rounds, and role if applicable).

### 6. Start the Development Server
Run the local development server:
```bash
npm run dev
```


Open [http://localhost:3000](http://localhost:3000) in your browser to view the application. The admin dashboard is available at `/admin`.
