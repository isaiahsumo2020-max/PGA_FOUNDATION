class AuthService {
    constructor() {
        this.USERS_KEY = 'pgaf_users';
        this.CURRENT_USER_KEY = 'pgaf_current_user';
    }
 initDemoUsers() {
        const demoUsers = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123', 
                role: 'user',
                bio: 'Passionate about youth empowerment and education.',
                profilePhoto: null,
                joined: new Date().toISOString()
            },
            {
                id: 'admin',
                name: 'Admin User',
                email: 'admin@pgaf.org',
                password: 'admin123',
                role: 'admin',
                bio: 'PGAF Administrator',
                profilePhoto: null,
                joined: new Date().toISOString()
            }
        ];

        let users = this.getAllUsers();
        if (!users || users.length === 0) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(demoUsers));
        }
    }

    getAllUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    saveUser(user) {
        const users = this.getAllUsers();
        const existingIndex = users.findIndex(u => u.id === user.id);
        
        if (existingIndex !== -1) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    signup(userData) {
        const users = this.getAllUsers();
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            role: 'user',
            bio: '',
            profilePhoto: null,
            joined: new Date().toISOString()
        };

        this.saveUser(newUser);
        return newUser;
    }

    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        localStorage.setItem(this.CURRENT_USER_KEY, user.id);
        return user;
    }

    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        const userId = localStorage.getItem(this.CURRENT_USER_KEY);
        if (!userId) return null;

        const users = this.getAllUsers();
        return users.find(u => u.id === userId) || null;
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }
}

// Global instance
const authService = new AuthService();
authService.initDemoUsers(); // Initialize demo users

// Global helper functions
function login(email, password) {
    try {
        return authService.login(email, password);
    } catch (error) {
        throw error;
    }
}

function signup(userData) {
    try {
        return authService.signup(userData);
    } catch (error) {
        throw error;
    }
}

function logout() {
    authService.logout();
}

function getCurrentUser() {
    return authService.getCurrentUser();
}

function isLoggedIn() {
    return authService.isLoggedIn();
}

function isAdmin() {
    return authService.isAdmin();
}
