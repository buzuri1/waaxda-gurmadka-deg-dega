# Gurmadka Deg Dega ee Gobolka Banadir

This is the full-stack government web application for the Mogadishu Fire and Emergency Services department.

## Setup Instructions

### 1. Database Setup
1. Go to your [Supabase Dashboard](https://app.supabase.com/) and create a new project.
2. Once created, go to the **SQL Editor** in Supabase.
3. Copy the contents of the `supabase-schema.sql` file and run it. This will create the `incidents` table, set up Row Level Security (RLS), and insert the 10 exact seed records requested.
4. Also make sure to set up Supabase Auth. Since this is an admin system, you should manually create a user in Supabase Auth via the dashboard (e.g. `admin@banadir.gov.so`). This user will be able to log in.

### 2. Environment Variables
Copy the `your_...` variables in your `.env.local` file with the actual keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
OPENAI_API_KEY=your_actual_openai_api_key
```

### 3. Add Logo
Place your logo file as `logo.png` inside the `public/` directory (replace the missing placeholder if needed).

### 4. Run the Project
Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Features Completed
- **Full Authentication**: Login page specifically styled for the Banadir Gov with Supabase integration.
- **Dashboard**: High-level overview with 4 key metrics, dynamic Recharts for districts, property types, response times, and resource usage.
- **Incidents List**: Fully functioning table with filters, search, and pagination. Full CRUD operations with modals.
- **Incident Detail**: Printable report page for specific incidents with professional print styling.
- **AI Chat (`/weydii-ai`)**: Uses OpenAI integration to understand the fire incidents data, answer in Somali, and act as the AI assistant for Banadir.
- **Statistics (`/faahfaahinta`)**: Additional detailed analytics and the ability to export the current data as CSV.
- **Premium Design**: Incorporates the exact requested color scheme (#CC0000 Red, #1B4FBE Blue), glassmorphism effects, modern animations, and smooth layout designs.
