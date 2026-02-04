/**
 * GenZ Smart - Main JavaScript
 * Handles navigation, form submissions, API calls, and UI interactions
 */

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// ============================================
// API Base URL
// ============================================

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// ============================================
// Products
// ============================================

async function loadFeaturedProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products?limit=3`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        
        if (products.length > 0) {
            grid.innerHTML = products.map(product => `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-image">
                        <span>${product.icon || '📦'}</span>
                    </div>
                    <div class="product-content">
                        <span class="product-category">${product.category}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <a href="#" class="product-link">
                            Learn More 
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback content
        grid.innerHTML = getFallbackProducts();
    }
}

async function loadAllProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        
        if (products.length > 0) {
            grid.innerHTML = products.map(product => `
                <div class="product-card-large" data-category="${product.category}">
                    <div class="product-image">
                        <span>${product.icon || '📦'}</span>
                    </div>
                    <div class="product-content">
                        <span class="product-category">${product.category}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        ${product.features && product.features.length > 0 ? `
                            <div class="product-features">
                                ${product.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = getFallbackProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        grid.innerHTML = getFallbackProducts();
    }
}

function getFallbackProducts() {
    return `
        <div class="product-card-large" data-category="saas">
            <div class="product-image"><span>🚀</span></div>
            <div class="product-content">
                <span class="product-category">SaaS</span>
                <h3>SmartFlow Pro</h3>
                <p>All-in-one workflow automation platform that streamlines your business processes and boosts productivity.</p>
            </div>
        </div>
        <div class="product-card-large" data-category="ai">
            <div class="product-image"><span>🤖</span></div>
            <div class="product-content">
                <span class="product-category">AI Solutions</span>
                <h3>AI Assist</h3>
                <p>Intelligent virtual assistant powered by cutting-edge machine learning algorithms.</p>
            </div>
        </div>
        <div class="product-card-large" data-category="mobile">
            <div class="product-image"><span>📱</span></div>
            <div class="product-content">
                <span class="product-category">Mobile Apps</span>
                <h3>TaskMaster</h3>
                <p>Cross-platform mobile application for efficient task and project management.</p>
            </div>
        </div>
        <div class="product-card-large" data-category="web">
            <div class="product-image"><span>🌐</span></div>
            <div class="product-content">
                <span class="product-category">Web Tools</span>
                <h3>WebBuilder</h3>
                <p>Drag-and-drop website builder with advanced customization options.</p>
            </div>
        </div>
    `;
}

function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const productCards = document.querySelectorAll('.product-card-large, [data-category]');
            
            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// Blog Posts
// ============================================

async function loadLatestPosts() {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/posts?limit=3`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        
        if (posts.length > 0) {
            grid.innerHTML = posts.map(post => `
                <article class="post-card" data-category="${post.category}">
                    <div class="post-image">
                        <span>${post.icon || '📝'}</span>
                    </div>
                    <div class="post-content">
                        <div class="post-meta">
                            <span class="post-category">${post.category}</span>
                            <span class="post-date">${formatDate(post.created_at)}</span>
                        </div>
                        <h3>${post.title}</h3>
                        <p>${post.excerpt || (post.content ? post.content.substring(0, 100) : '')}...</p>
                    </div>
                </article>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        // Fallback content
        grid.innerHTML = getFallbackPosts();
    }
}

async function loadAllBlogPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        
        if (posts.length > 0) {
            grid.innerHTML = posts.map(post => `
                <article class="blog-card" data-category="${post.category}">
                    <div class="post-image">
                        <span>${post.icon || '📝'}</span>
                    </div>
                    <div class="post-content">
                        <div class="post-meta">
                            <span class="post-category">${post.category}</span>
                            <span class="post-date">${formatDate(post.created_at)}</span>
                        </div>
                        <h3>${post.title}</h3>
                        <p>${post.excerpt || (post.content ? post.content.substring(0, 150) : '')}...</p>
                    </div>
                </article>
            `).join('');
        } else {
            grid.innerHTML = getFallbackBlogPosts();
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
        grid.innerHTML = getFallbackBlogPosts();
    }
}

function getFallbackPosts() {
    return `
        <article class="post-card">
            <div class="post-image"><span>🤖</span></div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">AI</span>
                    <span class="post-date">Jan 2026</span>
                </div>
                <h3>The Future of AI in Business</h3>
                <p>Exploring how artificial intelligence is transforming industries...</p>
            </div>
        </article>
        <article class="post-card">
            <div class="post-image"><span>🚀</span></div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">Startup</span>
                    <span class="post-date">Jan 2026</span>
                </div>
                <h3>Building a Tech Startup in 2026</h3>
                <p>Key insights for aspiring entrepreneurs in the tech space...</p>
            </div>
        </article>
        <article class="post-card">
            <div class="post-image"><span>💡</span></div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">Innovation</span>
                    <span class="post-date">Dec 2025</span>
                </div>
                <h3>Innovation Strategies That Work</h3>
                <p>Proven approaches to fostering innovation in your organization...</p>
            </div>
        </article>
    `;
}

function getFallbackBlogPosts() {
    const posts = [
        { icon: '🤖', category: 'AI & ML', title: 'The Future of AI in Business', date: 'Jan 15, 2026', excerpt: 'Exploring how artificial intelligence is transforming industries and creating new opportunities.' },
        { icon: '🚀', category: 'Entrepreneurship', title: 'Building a Tech Startup in 2026', date: 'Jan 10, 2026', excerpt: 'Key insights and strategies for aspiring entrepreneurs in the rapidly evolving tech landscape.' },
        { icon: '☁️', category: 'Technology', title: 'Cloud Migration Best Practices', date: 'Jan 5, 2026', excerpt: 'A comprehensive guide to successfully migrating your infrastructure to the cloud.' },
        { icon: '🔒', category: 'Technology', title: 'Cybersecurity Trends to Watch', date: 'Dec 28, 2025', excerpt: 'Stay ahead of emerging threats with these essential cybersecurity insights.' },
        { icon: '💡', category: 'Innovation', title: 'Innovation Strategies That Work', date: 'Dec 20, 2025', excerpt: 'Proven approaches to fostering innovation and creativity in your organization.' },
        { icon: '📱', category: 'Technology', title: 'The Rise of Progressive Web Apps', date: 'Dec 15, 2025', excerpt: 'Why PWAs are becoming the preferred choice for modern web development.' }
    ];
    
    return posts.map(post => `
        <article class="blog-card" data-category="${post.category.toLowerCase()}">
            <div class="post-image"><span>${post.icon}</span></div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span class="post-date">${post.date}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
            </div>
        </article>
    `).join('');
}

function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const excerpt = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || excerpt.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-category]');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<span>Subscribing...</span>';
        
        try {
            const response = await fetch(`${API_BASE_URL}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                btn.innerHTML = '<span>Subscribed! ✓</span>';
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 3000);
            } else if (response.status === 409) {
                btn.innerHTML = '<span>Already Subscribed</span>';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            btn.innerHTML = '<span>Try Again</span>';
            btn.disabled = false;
        }
    });
}

// ============================================
// Projects
// ============================================

async function loadAllProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projects = await response.json();
        
        if (projects.length > 0) {
            grid.innerHTML = projects.map(project => `
                <div class="project-card" data-category="${project.category}">
                    <div class="project-image">
                        <span>${project.icon || '🚀'}</span>
                    </div>
                    <div class="project-content">
                        <span class="project-category">${project.category}</span>
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        ${project.technologies && project.technologies.length > 0 ? `
                            <div class="project-tags">
                                ${project.technologies.map(t => `<span class="project-tag">${t}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = getFallbackProjects();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        grid.innerHTML = getFallbackProjects();
    }
}

function getFallbackProjects() {
    const projects = [
        { icon: '🛒', category: 'web', name: 'E-Commerce Platform', desc: 'Full-stack e-commerce solution with AI recommendations', tech: ['React', 'Node.js', 'AI'] },
        { icon: '🏥', category: 'mobile', name: 'HealthTrack App', desc: 'Mobile health monitoring application', tech: ['React Native', 'Firebase'] },
        { icon: '📊', category: 'saas', name: 'Analytics Dashboard', desc: 'Real-time business intelligence platform', tech: ['Vue.js', 'Python', 'AWS'] },
        { icon: '🤖', category: 'ai', name: 'ChatBot Assistant', desc: 'AI-powered customer service chatbot', tech: ['Python', 'TensorFlow', 'NLP'] },
        { icon: '🎓', category: 'web', name: 'E-Learning Platform', desc: 'Interactive online learning management system', tech: ['Next.js', 'MongoDB'] },
        { icon: '💰', category: 'mobile', name: 'Finance Tracker', desc: 'Personal finance management mobile app', tech: ['Flutter', 'Node.js'] }
    ];
    
    return projects.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image"><span>${project.icon}</span></div>
            <div class="project-content">
                <span class="project-category">${project.category}</span>
                <h3>${project.name}</h3>
                <p>${project.desc}</p>
                <div class="project-tags">
                    ${project.tech.map(t => `<span class="project-tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// Contact Form
// ============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            subject: form.querySelector('#subject').value,
            message: form.querySelector('#message').value
        };
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                statusDiv.className = 'form-status success';
                statusDiv.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
                form.reset();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send message');
            }
        } catch (error) {
            statusDiv.className = 'form-status error';
            statusDiv.textContent = error.message || 'Sorry, something went wrong. Please try again later.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// ============================================
// FAQ Accordion
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ============================================
// Utility Functions
// ============================================

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Intersection Observer for Animations
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-card, .product-card, .post-card, .value-card, .why-us-card, .team-card, .project-card, .blog-card'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ============================================
// Initialize Everything on DOM Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    
    // Initialize page-specific functions
    const path = window.location.pathname;
    
    if (path.includes('index') || path === '/' || path === '') {
        loadFeaturedProducts();
        loadLatestPosts();
    }
    
    if (path.includes('products')) {
        loadAllProducts();
        initProductFilters();
    }
    
    if (path.includes('blog')) {
        loadAllBlogPosts();
        initBlogSearch();
        initBlogFilters();
        initNewsletterForm();
    }
    
    if (path.includes('projects')) {
        loadAllProjects();
        initProjectFilters();
    }
    
    if (path.includes('contact')) {
        initContactForm();
        initFAQ();
    }
});

// Export functions for use in inline scripts
window.loadFeaturedProducts = loadFeaturedProducts;
window.loadLatestPosts = loadLatestPosts;
window.loadAllProducts = loadAllProducts;
window.loadAllBlogPosts = loadAllBlogPosts;
window.loadAllProjects = loadAllProjects;
window.initProductFilters = initProductFilters;
window.initBlogSearch = initBlogSearch;
window.initBlogFilters = initBlogFilters;
window.initNewsletterForm = initNewsletterForm;
window.initProjectFilters = initProjectFilters;
window.initContactForm = initContactForm;
window.initFAQ = initFAQ;
