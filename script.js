// ============================================
// PROFILE PAGE MANAGEMENT
// ============================================
async function loadProfile() {
    try {
        const result = await apiCall('/users/profile');
        
        if (result.status === 'success') {
            saveUserData(result.user);
            displayProfilePage(result.user);
            showProfilePage();
        }
    } catch (error) {
        // If API fails, use local data
        const userData = getUserData();
        if (userData) {
            displayProfilePage(userData);
            showProfilePage();
        } else {
            showSuccessToast('Please login first');
        }
    }
}

function showProfilePage() {
    // Hide all main sections
    document.querySelectorAll('section:not(#profilePage)').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show profile page
    const profilePage = document.getElementById('profilePage');
    if (profilePage) {
        profilePage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function hideProfilePage() {
    const profilePage = document.getElementById('profilePage');
    if (profilePage) {
        profilePage.classList.remove('active');
    }
    
    // Show all main sections
    document.querySelectorAll('section:not(#profilePage)').forEach(section => {
        section.style.display = 'block';
    });
}

function displayProfilePage(user) {
    // Update profile header
    document.getElementById('profileName').textContent = user.name || 'Your Name';
    document.getElementById('profileEmail').textContent = user.email || 'your.email@example.com';
    document.getElementById('profileCredits').textContent = user.credits || 0;
    document.getElementById('profileSessions').textContent = user.sessionsCompleted || 0;
    document.getElementById('profileRating').textContent = (user.rating || 5.0).toFixed(1);
    
    // Update avatar
    const avatar = document.getElementById('profileAvatar');
    if (user.avatar) {
        avatar.src = API_URL.replace('/api', '') + user.avatar;
    }
    
    // Update skills sections
    displaySkillsList('profileTeachSkills', user.teachSkills || [], 'teach');
    displaySkillsList('profileLearnSkills', user.learnSkills || [], 'learn');
    displaySkillsList('profileOtherInterests', user.otherInterests || [], 'other');
}

function displaySkillsList(containerId, skills, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (skills.length === 0) {
        let message = 'Add your interests to get started!';
        if (type === 'teach') {
            message = 'Add skills you can teach to start matching with learners!';
        } else if (type === 'learn') {
            message = 'Add skills you want to learn to find the perfect teachers!';
        }
        container.innerHTML = `<p class="empty-state">${message}</p>`;
        return;
    }
    
    container.innerHTML = skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
}

// ============================================
// AI MATCHMAKING FUNCTIONS
// ============================================
let currentMatches = [];
let currentFilter = 'all';

async function searchAllMatches() {
    const userData = getUserData();
    if (!userData || !userData.learnSkills || userData.learnSkills.length === 0) {
        showSuccessToast('Please add skills you want to learn first!');
        openEditInterestsModal();
        return;
    }
    
    showLoadingMatches();
    
    try {
        const result = await apiCall('/matches/find');
        
        if (result.status === 'success') {
            currentMatches = result.matches;
            displayMatches(currentMatches);
        }
    } catch (error) {
        document.getElementById('matchesContainer').innerHTML = `
            <div class="no-matches">
                <div class="no-matches-icon">❌</div>
                <h4>Error loading matches</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}

async function searchBySkill(skill) {
    if (!skill || skill.trim() === '') {
        document.getElementById('matchesContainer').innerHTML = `
            <div class="no-matches">
                <div class="no-matches-icon">🔍</div>
                <h4>Search for skills to find matches!</h4>
                <p>Try searching for "guitar", "coding", "spanish", or any skill you want to learn.</p>
            </div>
        `;
        return;
    }
    
    showLoadingMatches();
    
    try {
        const result = await apiCall(`/matches/search?skill=${encodeURIComponent(skill)}`);
        
        if (result.status === 'success') {
            currentMatches = result.users.map(user => ({
                user: user,
                matchScore: 75, // Default score for search results
                teachingMatches: [skill],
                learningMatches: [],
                commonInterests: []
            }));
            displayMatches(currentMatches);
        }
    } catch (error) {
        document.getElementById('matchesContainer').innerHTML = `
            <div class="no-matches">
                <div class="no-matches-icon">❌</div>
                <h4>Error searching</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        const skill = event.target.value.trim();
        searchBySkill(skill);
    }
}

function showLoadingMatches() {
    document.getElementById('matchesContainer').innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p style="margin-top: var(--spacing-md); color: var(--gray);">Finding your perfect matches...</p>
        </div>
    `;
}

function displayMatches(matches) {
    const container = document.getElementById('matchesContainer');
    
    if (!matches || matches.length === 0) {
        container.innerHTML = `
            <div class="no-matches">
                <div class="no-matches-icon">😔</div>
                <h4>No matches found</h4>
                <p>Try adding more skills to your profile or search for different skills.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="matches-grid">
            ${matches.map(match => createMatchCard(match)).join('')}
        </div>
    `;
}

function createMatchCard(match) {
    const user = match.user;
    const avatarUrl = user.avatar ? (API_URL.replace('/api', '') + user.avatar) : 
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23374151' width='200' height='200'/%3E%3Ccircle cx='100' cy='80' r='35' fill='%239CA3AF'/%3E%3Cpath d='M50 160 Q50 120 100 120 Q150 120 150 160 Z' fill='%239CA3AF'/%3E%3C/svg%3E";
    
    return `
        <div class="match-card" onclick="viewUserProfile('${user._id}')">
            <div class="match-header">
                <img src="${avatarUrl}" alt="${user.name}" class="match-avatar">
                <div class="match-info">
                    <h4>${user.name}</h4>
                    <div class="match-rating">⭐ ${user.rating.toFixed(1)} (${user.reviewCount || 0} reviews)</div>
                    ${user.isVerifiedMentor ? '<span class="match-score">✅ Verified</span>' : ''}
                </div>
            </div>
            
            <span class="match-score">🎯 Match Score: ${match.matchScore}%</span>
            
            ${match.teachingMatches && match.teachingMatches.length > 0 ? `
                <div class="match-skills">
                    <h5>Can teach you:</h5>
                    <div class="match-skill-tags">
                        ${match.teachingMatches.map(skill => `<span class="match-skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${match.learningMatches && match.learningMatches.length > 0 ? `
                <div class="match-skills">
                    <h5>Wants to learn from you:</h5>
                    <div class="match-skill-tags">
                        ${match.learningMatches.map(skill => `<span class="match-skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="match-actions">
                <button class="match-btn match-btn-primary" onclick="event.stopPropagation(); connectWithUser('${user._id}', '${user.name}')">
                    💬 Connect
                </button>
                <button class="match-btn match-btn-secondary" onclick="event.stopPropagation(); viewUserProfile('${user._id}')">
                    👤 View Profile
                </button>
            </div>
        </div>
    `;
}

function filterMatches(filterType) {
    currentFilter = filterType;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filteredMatches = [...currentMatches];
    
    switch(filterType) {
        case 'best':
            filteredMatches = filteredMatches.filter(m => m.matchScore >= 70);
            break;
        case 'verified':
            filteredMatches = filteredMatches.filter(m => m.user.isVerifiedMentor);
            break;
        case 'available':
            // Filter by last login (within 7 days)
            filteredMatches = filteredMatches.filter(m => {
                const daysSinceLogin = (Date.now() - new Date(m.user.lastLogin)) / (1000 * 60 * 60 * 24);
                return daysSinceLogin < 7;
            });
            break;
    }
    
    displayMatches(filteredMatches);
}

async function connectWithUser(userId, userName) {
    showSuccessToast(`Connecting with ${userName}...`);
    
    // In a real app, this would open a session booking modal
    const confirmed = confirm(`Would you like to book a session with ${userName}?`);
    
    if (confirmed) {
        // This would call the session creation API
        showSuccessToast('Session booking feature coming soon!');
    }
}

function viewUserProfile(userId) {
    showSuccessToast('User profile view coming soon!');
    // In a real app, this would show detailed user profile
}

// ============================================
// AVATAR UPLOAD
// ============================================
function uploadAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showSuccessToast('Image too large! Maximum size is 5MB');
            return;
        }
        
        const formData = new FormData();
        formData.append('avatar', file);
        
        try {
            const response = await fetch(`${API_URL}/users/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                // Update avatar in UI
                const avatarUrl = API_URL.replace('/api', '') + result.avatar;
                document.getElementById('profileAvatar').src = avatarUrl;
                
                // Update user data
                const userData = getUserData();
                userData.avatar = result.avatar;
                saveUserData(userData);
                
                showSuccessToast('Avatar updated successfully!');
            }
        } catch (error) {
            showSuccessToast('Error uploading avatar');
        }
    };
    
    input.click();
}

// ============================================
// ADDITIONAL FUNCTIONS
// ============================================
function buyCredits() {
    const amount = prompt('How many credits would you like to buy? (₹20 per credit)');
    
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        const total = parseInt(amount) * 20;
        const confirmed = confirm(`Buy ${amount} credits for ₹${total}?`);
        
        if (confirmed) {
            // Call API to process payment
            processCreditPurchase(parseInt(amount));
        }
    }
}

async function processCreditPurchase(amount) {
    try {
        const result = await apiCall('/users/credits/buy', 'POST', { amount });
        
        if (result.status === 'success') {
            const userData = getUserData();
            userData.credits = result.credits;
            saveUserData(userData);
            
            document.getElementById('profileCredits').textContent = result.credits;
            showSuccessToast(`Successfully added ${amount} credits!`);
        }
    } catch (error) {
        showSuccessToast('Payment processing coming soon!');
    }
}

function viewSessions() {
    showSuccessToast('Sessions feature coming soon!');
    // This would navigate to a sessions page
}
