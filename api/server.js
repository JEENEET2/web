/**
 * GenZ Smart - API Server
 * Express.js server with SQLite3 database (async implementation)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize Database
const dbPath = path.join(__dirname, '../database/genzsmart.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Promisify database methods
const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Create tables if they don't exist
async function initDatabase() {
    try {
        // Products table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                icon TEXT DEFAULT '📦',
                features TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Blog posts table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                category TEXT NOT NULL,
                icon TEXT DEFAULT '📝',
                author TEXT DEFAULT 'GenZ Smart Team',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Projects table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                icon TEXT DEFAULT '🚀',
                technologies TEXT,
                client TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Contact messages table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Newsletter subscribers table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS subscribers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database tables initialized');
        
        // Seed initial data
        await seedData();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Seed initial data
async function seedData() {
    try {
        // Check if products exist
        const productRow = await dbGet('SELECT COUNT(*) as count FROM products');
        if (productRow.count === 0) {
            const products = [
                ['SmartFlow Pro', 'All-in-one workflow automation platform that streamlines your business processes and boosts productivity.', 'saas', '🚀', JSON.stringify(["Automated Workflows", "Real-time Analytics", "Team Collaboration", "Enterprise Security"])],
                ['AI Assist', 'Intelligent virtual assistant powered by cutting-edge machine learning algorithms.', 'ai', '🤖', JSON.stringify(["Natural Language Processing", "24/7 Availability", "Custom Training", "Multi-language Support"])],
                ['DataVision', 'AI-powered analytics and business intelligence platform for data-driven decisions.', 'saas', '📊', JSON.stringify(["Real-time Dashboards", "Predictive Analytics", "Custom Reports", "Data Integration"])],
                ['TaskMaster', 'Cross-platform mobile application for efficient task and project management.', 'mobile', '📱', JSON.stringify(["Task Management", "Team Collaboration", "Time Tracking", "Offline Mode"])],
                ['SecureShield', 'Enterprise-grade security solutions to protect your digital assets.', 'web', '🔒', JSON.stringify(["Threat Detection", "Encryption", "Access Control", "Security Audits"])],
                ['WebBuilder', 'Drag-and-drop website builder with advanced customization options.', 'web', '🌐', JSON.stringify(["Drag & Drop", "Responsive Design", "SEO Tools", "E-commerce Ready"])]
            ];

            for (const p of products) {
                await dbRun('INSERT INTO products (name, description, category, icon, features) VALUES (?, ?, ?, ?, ?)', p);
            }
            console.log('Products seeded');
        }

        // Check if posts exist
        const postRow = await dbGet('SELECT COUNT(*) as count FROM posts');
        if (postRow.count === 0) {
            const posts = [
                ['The Future of AI in Business: Trends to Watch in 2026', 'Artificial Intelligence continues to reshape the business landscape. In this comprehensive guide, we explore the key AI trends that will define 2026 and how businesses can leverage them for competitive advantage. From generative AI to autonomous systems, the possibilities are endless.', 'Exploring how artificial intelligence is transforming industries and creating new opportunities.', 'ai', '🤖', 'GenZ Smart Team'],
                ['Building a Tech Startup in 2026', 'Starting a tech company has never been more exciting or challenging. This article covers everything from finding your niche to scaling your team. Learn from our experience and avoid common pitfalls.', 'Key insights and strategies for aspiring entrepreneurs in the rapidly evolving tech landscape.', 'entrepreneurship', '🚀', 'GenZ Smart Team'],
                ['Cloud Migration Best Practices', 'Moving to the cloud is a major decision for any business. This guide covers the essential steps for a successful migration, from planning to execution.', 'A comprehensive guide to successfully migrating your infrastructure to the cloud.', 'technology', '☁️', 'GenZ Smart Team'],
                ['Cybersecurity Trends to Watch', 'Stay ahead of emerging threats with these essential cybersecurity insights. Learn about zero-trust architecture, AI-powered security, and more.', 'Stay ahead of emerging threats with these essential cybersecurity insights.', 'technology', '🔒', 'GenZ Smart Team'],
                ['Innovation Strategies That Work', 'Innovation is not just about having great ideas. It is about creating a culture that nurtures creativity and turns ideas into reality.', 'Proven approaches to fostering innovation and creativity in your organization.', 'innovation', '💡', 'GenZ Smart Team'],
                ['The Rise of Progressive Web Apps', 'PWAs are changing how we think about web and mobile development. Discover why they are becoming the preferred choice for modern applications.', 'Why PWAs are becoming the preferred choice for modern web development.', 'technology', '📱', 'GenZ Smart Team']
            ];

            for (const p of posts) {
                await dbRun('INSERT INTO posts (title, content, excerpt, category, icon, author) VALUES (?, ?, ?, ?, ?, ?)', p);
            }
            console.log('Posts seeded');
        }

        // Check if projects exist
        const projectRow = await dbGet('SELECT COUNT(*) as count FROM projects');
        if (projectRow.count === 0) {
            const projects = [
                ['E-Commerce Platform', 'Full-stack e-commerce solution with AI-powered product recommendations and seamless checkout experience.', 'web', '🛒', JSON.stringify(["React", "Node.js", "MongoDB", "AI/ML"]), 'ShopMax Global'],
                ['HealthTrack App', 'Mobile health monitoring application with real-time vitals tracking and doctor consultation features.', 'mobile', '🏥', JSON.stringify(["React Native", "Firebase", "HealthKit"]), 'MediCare Plus'],
                ['Analytics Dashboard', 'Real-time business intelligence platform with customizable dashboards and predictive analytics.', 'saas', '📊', JSON.stringify(["Vue.js", "Python", "AWS", "TensorFlow"]), 'DataCorp'],
                ['ChatBot Assistant', 'AI-powered customer service chatbot with natural language understanding and sentiment analysis.', 'ai', '🤖', JSON.stringify(["Python", "TensorFlow", "NLP", "Docker"]), 'ServiceHub'],
                ['E-Learning Platform', 'Interactive online learning management system with video streaming and progress tracking.', 'web', '🎓', JSON.stringify(["Next.js", "PostgreSQL", "AWS S3"]), 'EduTech Institute'],
                ['Finance Tracker', 'Personal finance management mobile app with expense categorization and budget planning.', 'mobile', '💰', JSON.stringify(["Flutter", "Node.js", "Plaid API"]), 'MoneyWise']
            ];

            for (const p of projects) {
                await dbRun('INSERT INTO projects (name, description, category, icon, technologies, client) VALUES (?, ?, ?, ?, ?, ?)', p);
            }
            console.log('Projects seeded');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

// ============================================
// API Routes
// ============================================

// Health check
app.get('/api/health', async (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================
// Products API
// ============================================

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        let query = 'SELECT * FROM products ORDER BY created_at DESC';
        const params = [];
        if (limit) {
            query += ' LIMIT ?';
            params.push(limit);
        }
        const products = await dbAll(query, params);
        
        // Parse features JSON
        const parsedProducts = products.map(p => ({
            ...p,
            features: p.features ? JSON.parse(p.features) : []
        }));
        
        res.json(parsedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        product.features = product.features ? JSON.parse(product.features) : [];
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create product
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, category, icon, features } = req.body;
        const result = await dbRun(
            'INSERT INTO products (name, description, category, icon, features) VALUES (?, ?, ?, ?, ?)',
            [name, description, category, icon, JSON.stringify(features || [])]
        );
        
        res.status(201).json({ id: result.id, message: 'Product created' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, description, category, icon, features } = req.body;
        await dbRun(
            'UPDATE products SET name = ?, description = ?, category = ?, icon = ?, features = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, description, category, icon, JSON.stringify(features || []), req.params.id]
        );
        
        res.json({ message: 'Product updated' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await dbRun('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ============================================
// Blog Posts API
// ============================================

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        let query = 'SELECT * FROM posts ORDER BY created_at DESC';
        const params = [];
        if (limit) {
            query += ' LIMIT ?';
            params.push(limit);
        }
        const posts = await dbAll(query, params);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await dbGet('SELECT * FROM posts WHERE id = ?', [req.params.id]);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Create post
app.post('/api/posts', async (req, res) => {
    try {
        const { title, content, excerpt, category, icon, author } = req.body;
        const result = await dbRun(
            'INSERT INTO posts (title, content, excerpt, category, icon, author) VALUES (?, ?, ?, ?, ?, ?)',
            [title, content, excerpt, category, icon, author]
        );
        
        res.status(201).json({ id: result.id, message: 'Post created' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Update post
app.put('/api/posts/:id', async (req, res) => {
    try {
        const { title, content, excerpt, category, icon, author } = req.body;
        await dbRun(
            'UPDATE posts SET title = ?, content = ?, excerpt = ?, category = ?, icon = ?, author = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [title, content, excerpt, category, icon, author, req.params.id]
        );
        
        res.json({ message: 'Post updated' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
    try {
        await dbRun('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// ============================================
// Projects API
// ============================================

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        let query = 'SELECT * FROM projects ORDER BY created_at DESC';
        const params = [];
        if (limit) {
            query += ' LIMIT ?';
            params.push(limit);
        }
        const projects = await dbAll(query, params);
        
        // Parse technologies JSON
        const parsedProjects = projects.map(p => ({
            ...p,
            technologies: p.technologies ? JSON.parse(p.technologies) : []
        }));
        
        res.json(parsedProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        project.technologies = project.technologies ? JSON.parse(project.technologies) : [];
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Create project
app.post('/api/projects', async (req, res) => {
    try {
        const { name, description, category, icon, technologies, client } = req.body;
        const result = await dbRun(
            'INSERT INTO projects (name, description, category, icon, technologies, client) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, category, icon, JSON.stringify(technologies || []), client]
        );
        
        res.status(201).json({ id: result.id, message: 'Project created' });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const { name, description, category, icon, technologies, client } = req.body;
        await dbRun(
            'UPDATE projects SET name = ?, description = ?, category = ?, icon = ?, technologies = ?, client = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, description, category, icon, JSON.stringify(technologies || []), client, req.params.id]
        );
        
        res.json({ message: 'Project updated' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        await dbRun('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// ============================================
// Contact Form API
// ============================================

// Submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        await dbRun(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get all messages (admin endpoint)
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await dbAll('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// ============================================
// Newsletter API
// ============================================

// Subscribe to newsletter
app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email is required' });
        }
        
        await dbRun('INSERT INTO subscribers (email) VALUES (?)', [email]);
        
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already subscribed' });
        }
        console.error('Error subscribing:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

// Get all subscribers (admin endpoint)
app.get('/api/subscribers', async (req, res) => {
    try {
        const subscribers = await dbAll('SELECT * FROM subscribers ORDER BY created_at DESC');
        res.json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
});

// ============================================
// Statistics API
// ============================================

// Get dashboard statistics
app.get('/api/stats', async (req, res) => {
    try {
        const productRow = await dbGet('SELECT COUNT(*) as count FROM products');
        const postRow = await dbGet('SELECT COUNT(*) as count FROM posts');
        const projectRow = await dbGet('SELECT COUNT(*) as count FROM projects');
        const messageRow = await dbGet('SELECT COUNT(*) as count FROM messages');
        const subscriberRow = await dbGet('SELECT COUNT(*) as count FROM subscribers');
        
        res.json({
            products: productRow.count,
            posts: postRow.count,
            projects: projectRow.count,
            messages: messageRow.count,
            subscribers: subscriberRow.count
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// ============================================
// Serve Frontend
// ============================================

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 GenZ Smart Server Running!                        ║
║                                                        ║
║   📡 Port: ${PORT}                                    ║
║   🌐 URL: http://localhost:${PORT}                    ║
║   💾 Database: SQLite                                  ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

module.exports = app;
