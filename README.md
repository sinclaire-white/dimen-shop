# 🎨 DimenShop - 3D Printed Products Store

> **Your one-stop shop for unique 3D printed products**

A beautiful e-commerce platform where you can browse, purchase, and manage 3D printed products. Features an intuitive shopping experience with a powerful admin dashboard for store management.

🌐 **[Visit DimenShop](https://dimen-shop.vercel.app)**

---

## 🛍️ What Can You Do?

### As a Shopper
- **Browse Products** - Explore our collection of 3D printed items with beautiful product cards
- **Search Anything** - Use the animated search modal to find products instantly
- **Filter by Category** - Browse products by specific categories (Art, Miniatures, Gadgets, etc.)
- **View Product Details** - See detailed information, images, and specifications for each product
- **Featured Products** - Check out handpicked premium products on the homepage
- **Popular Products** - See what's trending based on purchase counts
- **Save Favorites** - Bookmark products you love for later
- **Dark/Light Mode** - Switch themes based on your preference
- **Order History** - Track all your past orders in one place
- **User Profile** - Manage your account information

### As a Store Admin
- **Product Management** - Add, edit, delete products with image uploads
- **Category Management** - Organize products into categories
- **Order Management** - View and update order statuses (pending → confirmed → shipped → delivered)
- **User Management** - View all registered users and their details
- **Toggle Featured** - Mark products as featured to showcase them on the homepage
- **Dashboard Analytics** - See statistics and charts about your store performance
- **Search & Filter** - Quickly find products, orders, or users with built-in search

---

## ✨ Key Features

### 🎯 Smart Shopping Experience
- **Animated Search Modal** - Beautiful search interface with popular search suggestions
- **Category Browsing** - Products organized into intuitive categories
- **Product Filtering** - Filter by price (low to high), date, categories
- **Featured Products Section** - Curated showcase on homepage
- **Popular Products** - Auto-calculated based on sales

### 🔐 User Accounts
- **Easy Registration** - Sign up with email or Google account
- **Secure Login** - Password-protected accounts with NextAuth
- **Role-Based Access** - Different permissions for users and admins
- **Personal Dashboard** - Each user gets their own dashboard
- **Google Sign-In** - One-click authentication option

### 📊 Admin Dashboard
- **Overview Page** - Quick stats and analytics at a glance
- **Product Management** - Full CRUD operations (Create, Read, Update, Delete)
- **Category Manager** - Modal-based category management
- **User Directory** - View all registered users
- **Order Tracking** - Manage customer orders with status updates
- **Image Uploads** - Easy product image management via ImgBB

### 🎨 Beautiful Design
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion powered transitions
- **Dark Mode** - System-aware theme switching
- **Modern UI** - Clean interface with shadcn/ui components
- **Animated Navbar** - Cool hamburger menu with circle expand effect

### ⚡ Performance
- **Fast Loading** - Server-side rendering for instant page loads
- **Optimized Images** - Automatic image optimization
- **Smart Caching** - 5-minute cache for frequently accessed data
- **No Lag** - Smooth transitions and interactions

---

## 🚀 Quick Start

### What You Need
- Node.js installed on your computer
- MongoDB database (free tier from MongoDB Atlas)
- ImgBB account for image hosting (free)

### Setup in 5 Minutes

1. **Download the project**
   ```bash
   git clone https://github.com/sinclaire-white/dimen-shop.git
   cd dimen-shop
   ```

2. **Install packages**
   ```bash
   npm install
   ```

3. **Set up your environment**
   
   Create a file named `.env.local` and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=any_random_secret_key
   NEXTAUTH_URL=http://localhost:3000
   IMGBB_API_KEY=your_imgbb_api_key
   ```

4. **Start the website**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Go to `http://localhost:3000`

---

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with featured products
- `/products` - All products with filtering
- `/products/[id]` - Individual product details
- `/categories/[id]` - Products by category
- `/about` - About the store
- `/contact` - Contact form
- `/faq` - Frequently asked questions
- `/login` - User login
- `/signup` - New user registration

### Dashboard Pages
**Regular Users:**
- `/dashboard/overview` - Personal dashboard
- `/dashboard/orders` - Order history
- `/dashboard/favorites` - Saved products
- `/dashboard/profile` - Account settings

**Admin Only:**
- `/dashboard/overview` - Admin analytics
- `/dashboard/products` - Manage products
- `/dashboard/categories` - Manage categories
- `/dashboard/users` - View all users
- `/dashboard/orders` - Manage all orders

---

## 🎭 User Types

### 👤 Regular User (Default)
When you sign up, you automatically become a **User**.

**What you can do:**
- Browse all products
- Search and filter
- View product details
- Add to favorites
- View your orders
- Update your profile

**Your dashboard shows:**
- Personal information
- Order history
- Favorite products

### 👨‍💼 Admin
Admins have full control over the store.

**What admins can do:**
- Everything users can do, PLUS:
- Add new products
- Edit existing products
- Delete products
- Mark products as featured
- Create/edit/delete categories
- View all users
- Delete user accounts
- See all orders
- Update order status

**Admin dashboard shows:**
- Store statistics
- Recent orders
- User count
- Product management tools

---

## 🛠️ Built With

**Main Technologies:**
- Next.js 15 - Website framework
- React 19 - UI components
- MongoDB - Database
- Tailwind CSS - Styling
- Framer Motion - Animations

**Why these?**
- **Next.js** - Makes the site super fast with server-side rendering
- **MongoDB** - Flexible database perfect for products and users
- **Tailwind** - Quick styling without writing CSS files
- **Framer Motion** - Beautiful smooth animations

---

## 🌟 Cool Features Explained

### 🔍 Animated Search Modal
Click the search icon anywhere to get a beautiful popup with:
- Large search box
- Popular search suggestions
- Smooth animations
- Works on all screen sizes

### 📁 Category System
Products are organized into categories like:
- Art & Sculptures
- Miniatures & Figurines
- Gadgets & Tools
- Home Decor
Each category has its own page with filtered products.

### ⭐ Featured Products
Admins can mark any product as "featured" to:
- Show it on the homepage
- Give it a special badge
- Highlight it to customers

### 📊 Dashboard
Different dashboards for different users:
- **Users** see their orders and favorites
- **Admins** see store analytics and management tools

### 🎨 Theme Toggle
One click to switch between:
- Light mode (bright background)
- Dark mode (dark background)
Remembers your choice!

---




---


**Q: How do I become an admin?**
A: Currently, admin role must be set directly in the database. Sign up, then update your user document in MongoDB to have `role: "admin"`.

**Q: Can customers checkout and pay?**
A: The payment integration is not included yet. You can add Stripe or PayPal later.

**Q: How do featured products work?**
A: Admins can toggle the "featured" status on any product. Featured products appear on the homepage.

**Q: Where are images stored?**
A: Images are uploaded to ImgBB via their API. URLs are stored in MongoDB.

---

## 📧 Contact & Links

- **GitHub**: [@sinclaire-white](https://github.com/sinclaire-white)
- **Live Demo**: [dimen-shop.vercel.app](https://dimen-shop.vercel.app)
- **Issues**: [Report a bug](https://github.com/sinclaire-white/dimen-shop/issues)

---
