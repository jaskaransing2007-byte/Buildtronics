/* ============================================
   SKILIO - JavaScript Functionality
   Handles all interactive features, modals, animations
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initModals();
    initScrollAnimations();
    initSmoothScroll();
    initFormHandling();
    initProfile();
    checkAuthState();
});

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================
function initModals() {
    // Open modal when clicking login/signup buttons
    document.querySelectorAll('a[href="#login"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('loginModal');
        });
    });
    
    document.querySelectorAll('a[href="#signup"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('signupModal');
        });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchModal(fromModalId, toModalId) {
    closeModal(fromModalId);
    setTimeout(() => openModal(toModalId), 300);
}

// ============================================
// FORM HANDLING
// ============================================
function initFormHandling() {
    // This is where you would integrate with your backend API
    // For now, we'll show success messages
}

function handleLogin(event) {
    event.preventDefault();
    
    // Create minimal user data with 10 welcome back credits
    const userData = {
        isLoggedIn: true,
        name: '',
        email: '',
        avatar: '',
        credits: 10,
        sessions: 0,
        rating: 0,
        teachSkills: [],
        learnSkills: [],
        otherInterests: []
    };
    
    saveUserData(userData);
    checkAuthState();
    
    // Close login modal first
    closeModal('loginModal');
    
    // Show welcome back modal after a short delay
    setTimeout(() => {
        openModal('welcomeBackModal');
    }, 300);
}

function handleSignup(event) {
    event.preventDefault();
    
    console.log('Signup button clicked!'); // Debug log
    
    // Create minimal user data without demo information but with 10 free credits
    const userData = {
        isLoggedIn: true,
        name: '',
        email: '',
        avatar: '',
        credits: 10,
        sessions: 0,
        rating: 0,
        teachSkills: [],
        learnSkills: [],
        otherInterests: []
    };
    
    console.log('Saving user data...', userData); // Debug log
    saveUserData(userData);
    checkAuthState();
    
    console.log('Closing signup modal...'); // Debug log
    // Close signup modal first
    closeModal('signupModal');
    
    // Show welcome bonus modal after a short delay
    console.log('Opening welcome bonus modal...'); // Debug log
    setTimeout(() => {
        openModal('welcomeBonusModal');
    }, 300);
}

function socialLogin(provider) {
    const userData = {
        isLoggedIn: true,
        name: '',
        email: '',
        avatar: '',
        credits: 10,
        sessions: 0,
        rating: 0,
        teachSkills: [],
        learnSkills: [],
        otherInterests: []
    };
    
    saveUserData(userData);
    checkAuthState();
    
    // Close modals first
    closeModal('loginModal');
    closeModal('signupModal');
    
    // Show welcome modal after a short delay
    setTimeout(() => {
        openModal('welcomeBackModal');
    }, 300);
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showSuccessToast(message) {
    const toast = document.getElementById('successToast');
    const messageElement = toast.querySelector('.toast-message');
    
    messageElement.textContent = message;
    toast.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for modal triggers
            if (href === '#login' || href === '#signup') {
                return;
            }
            
            // Only smooth scroll for section links
            if (href.length > 1 && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step, .pricing-card, .safety-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// INTERACTIVE BUTTON EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// ============================================
// FLOATING CARDS ANIMATION (Hero Section)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    // Add random movement to floating cards
    floatingCards.forEach((card, index) => {
        // Random slight rotation on hover
        card.addEventListener('mouseenter', function() {
            const randomRotation = (Math.random() - 0.5) * 10;
            this.style.transform = `rotate(${randomRotation}deg) translateY(-20px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// ============================================
// FEATURE CARD INTERACTIONS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 30);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k+';
    }
    return num.toString();
}

// Trigger counter animation when stats come into view
document.addEventListener('DOMContentLoaded', function() {
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const h3 = entry.target.querySelector('h3');
                const text = h3.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                
                h3.textContent = '0';
                animateCounter(h3, number);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// ============================================
// PRICING CARD HOVER EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Slightly scale other cards down
            pricingCards.forEach(otherCard => {
                if (otherCard !== this && !otherCard.classList.contains('popular')) {
                    otherCard.style.transform = 'scale(0.95)';
                    otherCard.style.opacity = '0.7';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset all cards
            pricingCards.forEach(otherCard => {
                otherCard.style.transform = '';
                otherCard.style.opacity = '';
            });
        });
    });
});

// ============================================
// FORM VALIDATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
        
        inputs.forEach(input => {
            // Real-time validation feedback
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateInput(this);
                }
            });
        });
    });
});

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    
    let isValid = true;
    let errorMessage = '';
    
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        errorMessage = 'Please enter a valid email address';
    } else if (type === 'password') {
        isValid = value.length >= 8;
        errorMessage = 'Password must be at least 8 characters';
    } else if (type === 'text') {
        isValid = value.length >= 2;
        errorMessage = 'Please enter a valid name';
    }
    
    if (isValid) {
        input.classList.remove('invalid');
        input.style.borderColor = '';
        removeErrorMessage(input);
    } else {
        input.classList.add('invalid');
        input.style.borderColor = '#EF4444';
        showErrorMessage(input, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(input, message) {
    removeErrorMessage(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#EF4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ============================================
// PARALLAX EFFECT FOR HERO BACKGROUND
// ============================================
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrolled < heroHeight) {
            const heroBg = document.querySelector('.hero-bg');
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    }
});

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        const activeModal = document.querySelector('.modal.active');
        
        if (activeModal) {
            // Tab trap within modal
            if (e.key === 'Tab') {
                const focusableElements = activeModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Lazy load images when they come into view
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c👋 Welcome to Skilio!', 'font-size: 24px; font-weight: bold; color: #FF6B35;');
console.log('%cInterested in how we built this? Check out our code!', 'font-size: 14px; color: #6B7280;');
console.log('%cWant to contribute? Visit our GitHub: github.com/skilio', 'font-size: 14px; color: #004E89;');

// ============================================
// PROFILE MANAGEMENT
// ============================================

// Initialize profile functionality
function initProfile() {
    // Handle profile button click
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProfile();
        });
    }
}

// Check authentication state
function checkAuthState() {
    const userData = getUserData();
    const profileBtn = document.getElementById('profileBtn');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (userData && userData.isLoggedIn) {
        // Show profile button, hide login/signup
        if (profileBtn) profileBtn.style.display = 'inline-flex';
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        
        // Update profile display only if profile section exists
        const profileSection = document.getElementById('profile');
        if (profileSection) {
            updateProfileDisplay();
        }
    } else {
        // Show login/signup, hide profile button
        if (profileBtn) profileBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
    }
}

// Show profile section
function showProfile() {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'profile') {
            section.style.display = 'none';
        }
    });
    
    // Show profile section
    const profileSection = document.getElementById('profile');
    if (profileSection) {
        profileSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    updateProfileDisplay();
}

// Hide profile section and show home
function hideProfile() {
    const profileSection = document.getElementById('profile');
    if (profileSection) {
        profileSection.style.display = 'none';
    }
    
    // Show all other sections
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'profile') {
            section.style.display = 'block';
        }
    });
}

// Update profile display
function updateProfileDisplay() {
    const userData = getUserData();
    
    if (!userData) return;
    
    // Update basic info - show empty states if no data
    document.getElementById('userName').textContent = userData.name || 'Your Name';
    document.getElementById('userEmail').textContent = userData.email || 'your.email@example.com';
    
    // Show placeholder avatar
    const avatarImg = document.getElementById('userAvatar');
    if (userData.avatar) {
        avatarImg.src = userData.avatar;
    } else {
        // Use a generic placeholder SVG
        avatarImg.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23E5E7EB" width="200" height="200"/%3E%3Ccircle cx="100" cy="80" r="35" fill="%236B7280"/%3E%3Cpath d="M50 160 Q50 120 100 120 Q150 120 150 160 Z" fill="%236B7280"/%3E%3C/svg%3E';
    }
    
    document.getElementById('userCredits').textContent = userData.credits !== undefined ? userData.credits : '0';
    document.getElementById('sessionsCompleted').textContent = userData.sessions || 0;
    document.getElementById('userRating').textContent = (userData.rating || 0).toFixed(1);
    
    // Update interests
    displayInterests('teachSkills', userData.teachSkills || []);
    displayInterests('learnSkills', userData.learnSkills || []);
    displayInterests('otherInterests', userData.otherInterests || []);
}

// Display interests in a container
function displayInterests(containerId, interests) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (interests.length === 0) {
        let emptyMessage = 'Add your interests to get started!';
        if (containerId === 'teachSkills') {
            emptyMessage = 'Add skills you can teach to start matching with learners!';
        } else if (containerId === 'learnSkills') {
            emptyMessage = 'Add skills you want to learn to find the perfect teachers!';
        } else if (containerId === 'otherInterests') {
            emptyMessage = 'Share your hobbies and interests to find like-minded people!';
        }
        container.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
        return;
    }
    
    interests.forEach(interest => {
        const tag = document.createElement('span');
        tag.className = 'interest-tag';
        tag.textContent = interest;
        container.appendChild(tag);
    });
}

// Get user data from localStorage
function getUserData() {
    const data = localStorage.getItem('skilioUserData');
    return data ? JSON.parse(data) : null;
}

// Save user data to localStorage
function saveUserData(userData) {
    localStorage.setItem('skilioUserData', JSON.stringify(userData));
}

// ============================================
// INTEREST MANAGEMENT
// ============================================

// Temporary storage for editing
let tempInterests = {
    teach: [],
    learn: [],
    other: []
};

// Open edit interests modal
function openEditInterestsModal() {
    const userData = getUserData();
    
    if (userData) {
        tempInterests.teach = [...(userData.teachSkills || [])];
        tempInterests.learn = [...(userData.learnSkills || [])];
        tempInterests.other = [...(userData.otherInterests || [])];
    }
    
    updateSelectedTags('teach');
    updateSelectedTags('learn');
    updateSelectedTags('other');
    
    openModal('editInterestsModal');
}

// Add interest
function addInterest(type) {
    const inputId = type === 'teach' ? 'teachInput' : type === 'learn' ? 'learnInput' : 'otherInput';
    const input = document.getElementById(inputId);
    
    if (!input) return;
    
    const value = input.value.trim();
    
    if (value && !tempInterests[type].includes(value)) {
        tempInterests[type].push(value);
        updateSelectedTags(type);
        input.value = '';
    }
}

// Remove interest
function removeInterest(type, interest) {
    tempInterests[type] = tempInterests[type].filter(item => item !== interest);
    updateSelectedTags(type);
}

// Update selected tags display
function updateSelectedTags(type) {
    const containerId = type === 'teach' ? 'selectedTeach' : type === 'learn' ? 'selectedLearn' : 'selectedOther';
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (tempInterests[type].length === 0) {
        container.innerHTML = '<p class="empty-state" style="margin: 0;">No items added yet</p>';
        return;
    }
    
    tempInterests[type].forEach(interest => {
        const tag = document.createElement('span');
        tag.className = 'selected-tag';
        tag.innerHTML = `
            ${interest}
            <button type="button" onclick="removeInterest('${type}', '${interest}')">&times;</button>
        `;
        container.appendChild(tag);
    });
}

// Save interests
function saveInterests(event) {
    event.preventDefault();
    
    let userData = getUserData();
    
    if (!userData) {
        userData = {
            isLoggedIn: true,
            name: '',
            email: '',
            avatar: '',
            credits: 0,
            sessions: 0,
            rating: 0
        };
    }
    
    userData.teachSkills = [...tempInterests.teach];
    userData.learnSkills = [...tempInterests.learn];
    userData.otherInterests = [...tempInterests.other];
    
    saveUserData(userData);
    updateProfileDisplay();
    closeModal('editInterestsModal');
    
    showSuccessToast('Interests saved successfully!');
}

// ============================================
// MATCHMAKING ALGORITHM
// ============================================

// Find matches - Demo functionality removed
function findMatches() {
    showSuccessToast('Matching functionality is currently unavailable. Please check back later!');
}

// ============================================
// UPDATED LOGIN/SIGNUP HANDLERS
// ============================================



// Add logout functionality
function logout() {
    localStorage.removeItem('skilioUserData');
    checkAuthState();
    hideProfile();
    showSuccessToast('Logged out successfully!');
}

// ============================================
// EXPORT FUNCTIONS (if using modules)
// ============================================
// For use in production with module bundlers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openModal,
        closeModal,
        switchModal,
        showSuccessToast,
        handleLogin,
        handleSignup,
        socialLogin,
        addInterest,
        removeInterest,
        saveInterests,
        findMatches,
        connectWithUser,
        viewUserProfile,
        logout
    };
}