# 🚀 GenZ Smart

A premium, professional website for GenZ Smart - an innovative tech startup. Built with modern technologies, featuring a clean design, SQLite database integration, and comprehensive SEO optimization.

![GenZ Smart Preview](public/images/preview.png)

## ✨ Features

### 🎨 Design & UI
- **Premium Dark Theme** - Modern, sleek design with gradient accents
- **Fully Responsive** - Optimized for all devices (desktop, tablet, mobile)
- **Smooth Animations** - Scroll-triggered animations and hover effects
- **Custom Typography** - Inter and Space Grotesk fonts for premium feel

### 📄 Pages
- **Home** - Hero section, features, featured products, latest blog posts
- **About** - Company story, mission, vision, core values, team, timeline
- **Products** - Product catalog with filtering, featured product showcase
- **Projects** - Portfolio with case studies, testimonials, tech stack
- **Blog** - Article listings with search, categories, newsletter signup
- **Contact** - Contact form, FAQ, social links

### 🗄️ Database (SQLite)
- **Products Table** - Store and manage product information
- **Blog Posts Table** - Content management for articles
- **Projects Table** - Portfolio project storage
- **Messages Table** - Contact form submissions
- **Subscribers Table** - Newsletter subscribers

### 🔍 SEO Optimized
- Comprehensive meta tags on every page
- Open Graph tags for social sharing
- Twitter Card support
- Structured data (JSON-LD)
- Semantic HTML5 markup
- Canonical URLs

### ⚡ Performance
- Optimized CSS with CSS variables
- Efficient JavaScript with async/await
- Lazy loading ready
- Minimal dependencies

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Google Fonts (Inter, Space Grotesk)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/genzsmart.git
   cd genzsmart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
genzsmart/
├── api/
│   └── server.js          # Express server with API endpoints
├── css/
│   └── style.css          # Main stylesheet
├── database/
│   └── genzsmart.db       # SQLite database (auto-created)
├── js/
│   └── main.js            # Main JavaScript file
├── public/
│   ├── index.html         # Home page
│   ├── about.html         # About page
│   ├── products.html      # Products page
│   ├── projects.html      # Projects page
│   ├── blog.html          # Blog page
│   └── contact.html       # Contact page
├── package.json           # Project dependencies
└── README.md             # This file
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Blog Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Contact & Newsletter
- `POST /api/contact` - Submit contact form
- `POST /api/subscribe` - Subscribe to newsletter

### Statistics
- `GET /api/stats` - Get dashboard statistics
- `GET /api/health` - Health check

## 🎨 Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --accent: #06b6d4;
    /* ... */
}
```

### Content
Update the seeded data in `api/server.js` or use the API endpoints to add content dynamically.

### SEO
Each page has comprehensive meta tags. Update the content in the `<head>` section of each HTML file.

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)
1. Upload the `public` folder contents
2. For full functionality with database, deploy the Node.js server

### VPS / Cloud Server
1. Upload all files to your server
2. Install Node.js and npm
3. Run `npm install`
4. Start with `npm start` or use PM2:
   ```bash
   npm install -g pm2
   pm2 start api/server.js --name genzsmart
   ```

### Docker (Optional)
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- Email: hello@genzsmart.com
- Website: [https://genzsmart.com](https://genzsmart.com)
- Twitter: [@genzsmart](https://twitter.com/genzsmart)

---

Made with ❤️ by GenZ Smart Team
