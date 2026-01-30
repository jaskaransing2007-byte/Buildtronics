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
    
    // Here you would normally send data to your backend
    // For demo purposes, we'll just show success
    showSuccessToast('Login successful! Redirecting to dashboard...');
    
    // Simulate redirect after 2 seconds
    setTimeout(() => {
        closeModal('loginModal');
        // In production: window.location.href = '/dashboard';
    }, 2000);
}

function handleSignup(event) {
    event.preventDefault();
    
    // Here you would normally send data to your backend
    // For demo purposes, we'll just show success
    showSuccessToast('Account created successfully! Welcome to Skilio!');
    
    // Simulate redirect after 2 seconds
    setTimeout(() => {
        closeModal('signupModal');
        // In production: window.location.href = '/onboarding';
    }, 2000);
}

function socialLogin(provider) {
    // This would integrate with OAuth providers
    showSuccessToast(`Connecting to ${provider}...`);
    
    // In production, this would redirect to OAuth flow
    // For now, just show the message
    setTimeout(() => {
        showSuccessToast(`${provider} authentication successful!`);
    }, 1500);
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
        socialLogin
    };
}/* ============================================
   PROFILE PAGE JAVASCRIPT
   ============================================ */

// User Data Storage
let profileUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    credits: 10,
    sessions: 0,
    rating: 5.0,
    teachSkills: [],
    learnSkills: [],
    interests: []
};

// Current editing context
let currentEditType = '';
let currentMatches = [];

// ============================================
// PROFILE INITIALIZATION
// ============================================
if (window.location.pathname.includes('profile.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        initProfilePage();
    });
}

function initProfilePage() {
    loadProfileData();
    displayProfileInfo();
    
    // Add Enter key listener for skill input
    const skillInput = document.getElementById('skillInput');
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }
    
    // Add Enter key for search
    const searchInput = document.getElementById('skillSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSkills();
            }
        });
    }
    
    // Avatar upload
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
}

function loadProfileData() {
    const saved = localStorage.getItem('skilioUserData');
    if (saved) {
        profileUserData = JSON.parse(saved);
    }
}

function saveProfileData() {
    localStorage.setItem('skilioUserData', JSON.stringify(profileUserData));
}

function displayProfileInfo() {
    // Update header
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userCredits = document.getElementById('userCredits');
    const userSessions = document.getElementById('userSessions');
    const userRating = document.getElementById('userRating');
    const sidebarCredits = document.getElementById('sidebarCredits');
    
    if (userName) userName.textContent = profileUserData.name;
    if (userEmail) userEmail.textContent = profileUserData.email;
    if (userCredits) userCredits.textContent = profileUserData.credits;
    if (userSessions) userSessions.textContent = profileUserData.sessions;
    if (userRating) userRating.textContent = profileUserData.rating.toFixed(1);
    if (sidebarCredits) sidebarCredits.textContent = profileUserData.credits;
    
    // Update avatar
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
        if (profileUserData.avatar) {
            avatar.src = profileUserData.avatar;
        } else {
            avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUserData.name)}&size=200&background=FF6B35&color=fff`;
        }
    }
    
    // Display skills
    displayProfileSkills('teachSkillsContainer', profileUserData.teachSkills);
    displayProfileSkills('learnSkillsContainer', profileUserData.learnSkills);
    displayProfileSkills('interestsContainer', profileUserData.interests);
}

function displayProfileSkills(containerId, skills) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p class="empty-message">No skills added yet. Click Edit to add some!</p>';
        return;
    }
    
    container.innerHTML = skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
}

// ============================================
// EDIT SKILLS MODAL
// ============================================
function openEditModal(type) {
    currentEditType = type;
    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    
    if (!modal || !title || !description) return;
    
    switch(type) {
        case 'teach':
            title.textContent = '🎓 Skills I Can Teach';
            description.textContent = 'Add skills you can teach to others';
            displayEditableSkills(profileUserData.teachSkills);
            break;
        case 'learn':
            title.textContent = '📚 Skills I Want to Learn';
            description.textContent = 'Add skills you want to learn';
            displayEditableSkills(profileUserData.learnSkills);
            break;
        case 'interests':
            title.textContent = '💡 Other Interests';
            description.textContent = 'Add your hobbies and interests';
            displayEditableSkills(profileUserData.interests);
            break;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    const skillInput = document.getElementById('skillInput');
    if (skillInput) {
        skillInput.value = '';
    }
}

function displayEditableSkills(skills) {
    const container = document.getElementById('skillTagsContainer');
    if (!container) return;
    
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p class="empty-message">No skills added yet</p>';
        return;
    }
    
    container.innerHTML = skills.map(skill => 
        `<span class="editable-skill-tag">
            ${skill}
            <button class="remove-skill-button" onclick="removeSkill('${skill.replace(/'/g, "\\'")}')">&times;</button>
        </span>`
    ).join('');
}

function addSkill() {
    const input = document.getElementById('skillInput');
    if (!input) return;
    
    const skill = input.value.trim();
    
    if (!skill) {
        showSuccessToast('Please enter a skill');
        return;
    }
    
    let skillArray;
    switch(currentEditType) {
        case 'teach':
            skillArray = profileUserData.teachSkills;
            break;
        case 'learn':
            skillArray = profileUserData.learnSkills;
            break;
        case 'interests':
            skillArray = profileUserData.interests;
            break;
    }
    
    if (skillArray && skillArray.includes(skill)) {
        showSuccessToast('This skill is already added');
        return;
    }
    
    if (skillArray) {
        skillArray.push(skill);
        input.value = '';
        displayEditableSkills(skillArray);
    }
}

function removeSkill(skill) {
    switch(currentEditType) {
        case 'teach':
            profileUserData.teachSkills = profileUserData.teachSkills.filter(s => s !== skill);
            displayEditableSkills(profileUserData.teachSkills);
            break;
        case 'learn':
            profileUserData.learnSkills = profileUserData.learnSkills.filter(s => s !== skill);
            displayEditableSkills(profileUserData.learnSkills);
            break;
        case 'interests':
            profileUserData.interests = profileUserData.interests.filter(s => s !== skill);
            displayEditableSkills(profileUserData.interests);
            break;
    }
}

function saveSkills() {
    saveProfileData();
    displayProfileInfo();
    closeEditModal();
    showSuccessToast('Skills updated successfully!');
}

// ============================================
// AI MATCHMAKING
// ============================================
function searchSkills() {
    const searchInput = document.getElementById('skillSearchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    
    if (!query) {
        showSuccessToast('Please enter a skill to search');
        return;
    }
    
    showLoadingMatches();
    
    setTimeout(() => {
        const matches = generateMockMatches(query);
        currentMatches = matches;
        displayMatches(matches);
    }, 1000);
}

function findAllMatches() {
    if (!profileUserData.learnSkills || profileUserData.learnSkills.length === 0) {
        showSuccessToast('Please add skills you want to learn first!');
        openEditModal('learn');
        return;
    }
    
    showLoadingMatches();
    
    setTimeout(() => {
        const matches = generatePersonalizedMatches();
        currentMatches = matches;
        displayMatches(matches);
    }, 1000);
}

function showLoadingMatches() {
    const container = document.getElementById('matchesContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-spinner-wrapper">
            <div class="spinner-animation"></div>
            <p>Finding your perfect matches...</p>
        </div>
    `;
}

function generateMockMatches(skill) {
    const mockUsers = [
        {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&size=200&background=004E89&color=fff',
            rating: 4.8,
            reviews: 24,
            matchScore: 95,
            canTeach: [skill, 'Web Development', 'UI/UX Design'],
            wantsToLearn: ['Data Science', 'Machine Learning'],
            verified: true,
            available: true
        },
        {
            id: 2,
            name: 'Mike Chen',
            avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&size=200&background=FFD23F&color=333',
            rating: 4.9,
            reviews: 31,
            matchScore: 88,
            canTeach: [skill, 'JavaScript', 'React'],
            wantsToLearn: ['Photography', 'Video Editing'],
            verified: true,
            available: false
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&size=200&background=FF6B35&color=fff',
            rating: 4.7,
            reviews: 18,
            matchScore: 82,
            canTeach: [skill, 'Spanish', 'Content Writing'],
            wantsToLearn: ['Cooking', 'Fitness'],
            verified: false,
            available: true
        }
    ];
    
    return mockUsers;
}

function generatePersonalizedMatches() {
    const allMatches = [];
    
    if (profileUserData.learnSkills) {
        profileUserData.learnSkills.forEach(skill => {
            const matches = generateMockMatches(skill);
            allMatches.push(...matches);
        });
    }
    
    const unique = Array.from(new Map(allMatches.map(m => [m.id, m])).values());
    return unique.sort((a, b) => b.matchScore - a.matchScore);
}

function displayMatches(matches) {
    const container = document.getElementById('matchesContainer');
    if (!container) return;
    
    if (!matches || matches.length === 0) {
        container.innerHTML = `
            <div class="empty-matches-state">
                <div class="empty-icon-large">😔</div>
                <h3>No Matches Found</h3>
                <p>Try searching for different skills or add more skills to your profile.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="matches-grid-display">
            ${matches.map(match => createMatchCard(match)).join('')}
        </div>
    `;
}

function createMatchCard(match) {
    return `
        <div class="match-card-item">
            <div class="match-header-section">
                <img src="${match.avatar}" alt="${match.name}" class="match-avatar-img">
                <div class="match-info-text">
                    <h4>${match.name} ${match.verified ? '✅' : ''}</h4>
                    <div class="match-rating-display">⭐ ${match.rating} (${match.reviews} reviews)</div>
                </div>
            </div>
            
            <div class="match-score-badge">🎯 ${match.matchScore}% Match</div>
            
            <div class="match-skills-section">
                <h5>Can teach you:</h5>
                <div class="match-skill-tags-list">
                    ${match.canTeach.slice(0, 3).map(skill => 
                        `<span class="match-skill-tag-item">${skill}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="match-actions-buttons">
                <button class="match-button match-button-primary" onclick="connectWithUser(${match.id}, '${match.name}')">
                    💬 Connect
                </button>
                <button class="match-button match-button-secondary" onclick="viewProfile(${match.id})">
                    👤 Profile
                </button>
            </div>
        </div>
    `;
}

function filterMatches(type) {
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (!currentMatches || currentMatches.length === 0) return;
    
    let filtered = [...currentMatches];
    
    switch(type) {
        case 'best':
            filtered = filtered.filter(m => m.matchScore >= 70);
            break;
        case 'verified':
            filtered = filtered.filter(m => m.verified);
            break;
        case 'available':
            filtered = filtered.filter(m => m.available);
            break;
    }
    
    displayMatches(filtered);
}

// ============================================
// USER ACTIONS
// ============================================
function connectWithUser(userId, userName) {
    showSuccessToast(`Connecting with ${userName}...`);
    setTimeout(() => {
        showSuccessToast(`Connection request sent to ${userName}!`);
    }, 1000);
}

function viewProfile(userId) {
    showSuccessToast('Opening user profile...');
}

function buyCredits() {
    const amount = prompt('How many credits would you like to buy?\n1 Credit = $1');
    
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        const total = parseInt(amount);
        const confirm = window.confirm(`Purchase ${amount} credits for $${total}?`);
        
        if (confirm) {
            profileUserData.credits += parseInt(amount);
            saveProfileData();
            displayProfileInfo();
            showSuccessToast(`Successfully added ${amount} credits!`);
        }
    }
}

function viewSessions() {
    showSuccessToast('Sessions page coming soon!');
}

function openSettings() {
    showSuccessToast('Settings page coming soon!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('skilioUserData');
        showSuccessToast('Logged out successfully!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ============================================
// AVATAR UPLOAD
// ============================================
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showSuccessToast('Image too large! Maximum size is 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        profileUserData.avatar = e.target.result;
        document.getElementById('profileAvatar').src = e.target.result;
        saveProfileData();
        showSuccessToast('Avatar updated successfully!');
    };
    reader.readAsDataURL(file);
}

// ============================================
// UPDATE AUTH STATE CHECK
// ============================================
function checkAuthState() {
    const userData = localStorage.getItem('skilioUserData');
    const profileLink = document.getElementById('profileLink');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (userData) {
        if (profileLink) profileLink.style.display = 'inline-block';
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
    } else {
        if (profileLink) profileLink.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
    }
}

// Update existing handlers
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const name = email.split('@')[0];
    
    const userData = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        credits: 10,
        sessions: 0,
        rating: 5.0,
        teachSkills: [],
        learnSkills: [],
        interests: []
    };
    
    localStorage.setItem('skilioUserData', JSON.stringify(userData));
    localStorage.setItem('authToken', 'demo-token-12345');
    
    showSuccessToast('Login successful!');
    closeModal('loginModal');
    checkAuthState();
}

function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    
    const userData = {
        name: name,
        email: email,
        credits: 10,
        sessions: 0,
        rating: 5.0,
        teachSkills: [],
        learnSkills: [],
        interests: []
    };
    
    localStorage.setItem('skilioUserData', JSON.stringify(userData));
    localStorage.setItem('authToken', 'demo-token-12345');
    
    showSuccessToast('Account created successfully!');
    closeModal('signupModal');
    checkAuthState();
}
