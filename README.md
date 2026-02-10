# Thrift Shop - Minimalist E-commerce UI

A minimalist thrifting business UI built with React, Redux, shadcn/ui, Tailwind CSS, and Supabase.

## Features

### Customer Features
- User authentication with Supabase Auth (sign up/login)
- Browse products from Supabase database
- Shopping cart management
- Checkout with Google Pay integration (demo)
- Order creation and tracking
- Responsive design

### Admin Features
- **Admin Dashboard** at `/admin`
- **Product Management**: Add, edit, delete products with image upload to Supabase Storage
- **Order Management**: View all orders, update order status
- Real-time sync with Supabase PostgreSQL

## Tech Stack

- React 18
- Redux Toolkit for state management
- React Router for navigation
- Supabase (PostgreSQL, Storage, Auth)
- shadcn/ui components
- Tailwind CSS for styling
- Vite for build tooling

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Quick steps:
1. Create a Supabase project at https://supabase.com/
2. Create database tables (SQL provided in setup guide)
3. Set up Storage bucket for images
4. Enable Email Authentication
5. Copy your credentials to `.env` file

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Access the App

- **Customer Store**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── admin/           # Admin-specific components
│   └── Navbar.jsx
├── pages/
│   ├── Home.jsx         # Product listing
│   ├── Login.jsx        # Authentication
│   ├── Cart.jsx         # Shopping cart
│   ├── Checkout.jsx     # Order checkout
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── Products.jsx  # Product CRUD
│       └── Orders.jsx    # Order management
├── services/
│   ├── productService.js # Supabase product operations
│   ├── orderService.js   # Supabase order operations
│   └── authService.js    # Supabase authentication
├── store/
│   ├── authSlice.js
│   ├── cartSlice.js
│   └── store.js
├── lib/
│   ├── utils.js         # Utility functions
│   └── supabase.js      # Supabase client
└── App.jsx

```

## Admin Panel Usage

### Product Management
1. Navigate to `/admin/products`
2. Click "Add Product" to create new products
3. Upload product images (stored in Firebase Storage)
4. Edit or delete existing products

### Order Management
1. Navigate to `/admin/orders`
2. View all customer orders
3. Update order status (pending → processing → shipped → delivered)

## Supabase Database Structure

### Tables

**products**
```sql
id          UUID PRIMARY KEY
name        TEXT NOT NULL
price       DECIMAL(10, 2) NOT NULL
image       TEXT
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

**orders**
```sql
id          UUID PRIMARY KEY
user_email  TEXT NOT NULL
items       JSONB NOT NULL
total       DECIMAL(10, 2) NOT NULL
status      TEXT DEFAULT 'pending'
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

## Security

Row Level Security (RLS) is enabled on all tables:

**Products:**
- Read: Public access
- Write: Authenticated users only

**Orders:**
- Read: Users can only see their own orders
- Write: Authenticated users only

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed security policies.

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options

**Vercel (Recommended)**
```bash
npm i -g vercel
vercel
```

**Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

Make sure to add environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Next Steps

- [ ] Add Supabase real-time subscriptions for live updates
- [ ] Implement admin role checking with custom claims
- [ ] Add email notifications for orders
- [ ] Integrate real payment gateway (Stripe/PayPal)
- [ ] Add product categories and filters
- [ ] Implement search functionality
- [ ] Add inventory management
- [ ] Customer order history page
- [ ] Add product reviews and ratings

## Troubleshooting

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for common issues and solutions.

## License

MIT
