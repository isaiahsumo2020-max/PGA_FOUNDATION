// donationService.js - Handles donation operations
class DonationService {
    constructor() {
        this.DONATIONS_KEY = 'pgaf_donations';
    }

    initDemoDonations() {
        const demoDonations = [
            {
                id: '1',
                userId: '1',
                amount: 50,
                currency: 'USD',
                date: new Date(Date.now() - 86400000).toISOString(),
                status: 'completed',
                method: 'card'
            },
            {
                id: '2',
                userId: '1',
                amount: 25,
                currency: 'LRD',
                date: new Date(Date.now() - 2 * 86400000).toISOString(),
                status: 'completed',
                method: 'mobile_money'
            }
        ];

        let donations = this.getAllDonations();
        if (!donations || donations.length === 0) {
            localStorage.setItem(this.DONATIONS_KEY, JSON.stringify(demoDonations));
        }
    }

    getAllDonations() {
        const donations = localStorage.getItem(this.DONATIONS_KEY);
        return donations ? JSON.parse(donations) : [];
    }

    getUserDonations(userId) {
        const donations = this.getAllDonations();
        return donations.filter(d => d.userId === userId);
    }

    addDonation(donationData) {
        const donations = this.getAllDonations();
        const newDonation = {
            id: Date.now().toString(),
            userId: getCurrentUser()?.id,
            ...donationData,
            status: 'completed', // For demo
            date: new Date().toISOString()
        };

        donations.unshift(newDonation);
        localStorage.setItem(this.DONATIONS_KEY, JSON.stringify(donations));
        return newDonation;
    }
}

const donationService = new DonationService();
donationService.initDemoDonations();

// Global helper functions
function getUserDonations() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    return donationService.getUserDonations(currentUser.id);
}

function addDonation(donationData) {
    if (!isLoggedIn()) {
        throw new Error('Please login to make a donation');
    }
    return donationService.addDonation(donationData);
}
