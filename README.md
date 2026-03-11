🛒 Next.js E-Commerce Platform

A modern, full-featured e-commerce application built with Next.js, React, and JavaScript.
This platform provides secure authentication, shopping cart functionality, and integrated online payments.

<a href="https://next-ecommerce-alpha-inky.vercel.app/" target="_blank">
  <img width="1904" height="696" alt="Next Ecommerce Preview" src="https://github.com/user-attachments/assets/b3714f77-8693-449c-8cf5-da5c48256f52" />
</a>


✨ Features

🔐 User Authentication – Secure login and registration system
🛍️ Shopping Cart – Add, update, and remove items from cart
💳 Payment Integration – eSewa payment gateway integration
📦 Order Management – Complete order tracking and history
🎨 Responsive Design – Mobile-first responsive UI
⚡ Performance Optimized – Built with Next.js App Router and server components
🔒 Security – Secure payments and protected data handling


🛠️ Tech Stack
| Category             | Technology               |
| -------------------- | ------------------------ |
| **Framework**        | Next.js 14+ (App Router) |
| **Language**         | JavaScript (JSX)         |
| **Styling**          | Tailwind CSS             |
| **Animations**       | Framer Motion            |
| **Icons**            | Lucide React             |
| **State Management** | React Context API        |
| **Payment Gateway**  | eSewa                    |
| **Deployment**       | Vercel                   |

📦 Installation
Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

Setup steps
# 1. Clone the repository
git clone https://github.com/yourusername/next-ecommerce-alpha.git

# 2. Navigate to project directory
cd next-ecommerce-alpha

# 3. Install dependencies
npm install

# 4. Setup environment variables
cp .env.example .env.local


🔑 Environment Variables

Create a .env.local file in the root directory.

# Database
DATABASE_URL=your_database_url

# Authentication
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Gateway
ESEWA_MERCHANT_ID=your_esewa_merchant_id
ESEWA_SECRET_KEY=your_esewa_secret_key

# API Keys
NEXT_PUBLIC_API_URL=your_api_url


🚀 Getting Started
Development
# Start development server
npm run dev


Open in browser:
- http://localhost:3000

Production Build
# Build the project
npm run build

# Start production server
npm start

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/api/payment/initiate` | Initiate eSewa payment |
| POST   | `/api/auth/login`       | User login             |
| POST   | `/api/auth/register`    | User registration      |
| POST   | `/api/auth/Adminlogin`  | Adminlogin             |
| POST   | `/api/auth/Adminregister`|Admin Registration     |
| GET    | `/api/products`         | Get all products       |
| POST   | `/api/orders`           | Create new order       |


🌐 Deployment
Vercel (Recommended)
# Install Vercel CLI
npm i -g vercel
# Deploy project
vercel

Manual Deployment

- Build the project
- npm run build
- Deploy .next folder to hosting provider
- Add environment variables in hosting dashboard


📱 Browser Support
| Browser | Supported Version |
| ------- | ----------------- |
| Chrome  | Latest            |
| Firefox | Latest            |
| Safari  | Latest            |
| Edge    | Latest            |


🤝 Contributing

1. Fork the repository
1. Create your feature branch
  - git checkout -b feature/AmazingFeature
3. Commit your changes
  - git commit -m "Add some AmazingFeature"
4. Push to branch
  - git push origin feature/AmazingFeature
5. Open a Pull Request


🙏 Acknowledgments

Next.js – React framework
Tailwind CSS – Utility-first CSS framework
Framer Motion – Animation library
eSewa – Payment gateway


