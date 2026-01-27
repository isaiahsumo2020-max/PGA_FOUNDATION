// userService.js - Handles user profile operations
class UserService {
    constructor() {
        this.USERS_KEY = 'pgaf_users';
    }

    updateProfile(userId, updates) {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        
        // Update current user if it's the logged-in user
        if (localStorage.getItem('pgaf_current_user') === userId) {
            // Current user session is automatically updated
        }
        
        return users[userIndex];
    }

    uploadProfilePhoto(userId, photoDataUrl) {
        return this.updateProfile(userId, { profilePhoto: photoDataUrl });
    }
}

const userService = new UserService();

// Global helper functions
function updateProfile(updates) {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not logged in');
    return userService.updateProfile(currentUser.id, updates);
}

function uploadProfilePhoto(photoDataUrl) {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not logged in');
    return userService.uploadProfilePhoto(currentUser.id, photoDataUrl);
}
