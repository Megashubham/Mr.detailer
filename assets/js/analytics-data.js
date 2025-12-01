/**
 * Analytics Dashboard Data Handler
 * Manages data for Total Earning, Booking, Customers, and Leads
 */

// Configuration
const ANALYTICS_CONFIG = {
    refreshInterval: 300000, // Refresh every 5 minutes (in milliseconds)
    apiEndpoints: {
        earnings: '/api/earnings',
        bookings: '/api/bookings',
        customers: '/api/customers',
        leads: '/api/leads'
    }
};

/**
 * Calculate percentage growth between current and previous month
 * @param {number} current - Current month value
 * @param {number} previous - Previous month value
 * @returns {object} - Growth percentage and direction
 */
function calculateGrowth(current, previous) {
    if (previous === 0) {
        return { percentage: 100, isPositive: current > 0 };
    }
    
    const growth = ((current - previous) / previous) * 100;
    return {
        percentage: Math.abs(growth).toFixed(2),
        isPositive: growth >= 0
    };
}

/**
 * Update growth indicator HTML
 * @param {string} containerId - Container element ID
 * @param {string} spanId - Span element ID for percentage
 * @param {object} growth - Growth data
 */
function updateGrowthIndicator(containerId, spanId, growth) {
    const container = document.getElementById(containerId);
    const span = document.getElementById(spanId);
    
    if (!container || !span) return;
    
    // Update percentage value
    span.textContent = (growth.isPositive ? '+' : '-') + growth.percentage;
    
    // Update color and icon
    if (growth.isPositive) {
        container.className = 'text-success fs-14 mb-0';
        container.innerHTML = `<i class="ri-arrow-right-up-line fs-13 align-middle"></i> <span id="${spanId}">${growth.isPositive ? '+' : '-'}${growth.percentage}</span> %`;
    } else {
        container.className = 'text-danger fs-14 mb-0';
        container.innerHTML = `<i class="ri-arrow-right-down-line fs-13 align-middle"></i> <span id="${spanId}">${growth.isPositive ? '+' : '-'}${growth.percentage}</span> %`;
    }
}

/**
 * Update counter animation
 * @param {string} elementId - Element ID
 * @param {number} value - Target value
 */
function updateCounter(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.setAttribute('data-target', value);
    
    // Simple counter animation
    let current = 0;
    const increment = value / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
            element.textContent = formatNumber(value);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 20);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Load analytics data from localStorage or API
 */
async function loadAnalyticsData() {
    try {
        // For now, we'll use localStorage to simulate data
        // In production, replace this with actual API calls
        
        // Get current month data (or use defaults)
        const currentData = {
            earnings: parseFloat(localStorage.getItem('current_earnings') || '0'),
            bookings: parseInt(localStorage.getItem('current_bookings') || '0'),
            customers: parseInt(localStorage.getItem('current_customers') || '0'),
            leads: parseInt(localStorage.getItem('current_leads') || '0')
        };
        
        // Get previous month data (or use defaults)
        const previousData = {
            earnings: parseFloat(localStorage.getItem('previous_earnings') || '0'),
            bookings: parseInt(localStorage.getItem('previous_bookings') || '0'),
            customers: parseInt(localStorage.getItem('previous_customers') || '0'),
            leads: parseInt(localStorage.getItem('previous_leads') || '0')
        };
        
        // Calculate growths
        const earningsGrowth = calculateGrowth(currentData.earnings, previousData.earnings);
        const bookingsGrowth = calculateGrowth(currentData.bookings, previousData.bookings);
        const customersGrowth = calculateGrowth(currentData.customers, previousData.customers);
        const leadsGrowth = calculateGrowth(currentData.leads, previousData.leads);
        
        // Update UI
        updateCounter('total-earning', currentData.earnings);
        updateCounter('total-booking', currentData.bookings);
        updateCounter('total-customers', currentData.customers);
        updateCounter('total-leads', currentData.leads);
        
        // Update growth indicators
        updateGrowthIndicator('earning-growth-container', 'earning-growth', earningsGrowth);
        updateGrowthIndicator('booking-growth-container', 'booking-growth', bookingsGrowth);
        updateGrowthIndicator('customer-growth-container', 'customer-growth', customersGrowth);
        updateGrowthIndicator('leads-growth-container', 'leads-growth', leadsGrowth);
        
    } catch (error) {
        console.error('Error loading analytics data:', error);
    }
}

/**
 * Fetch data from actual backend API (placeholder)
 * Replace this with your actual API integration
 */
async function fetchFromAPI(endpoint) {
    // This is a placeholder for actual API calls
    // Example:
    // const response = await fetch(endpoint);
    // return await response.json();
    
    return {
        current: 0,
        previous: 0
    };
}

/**
 * Calculate all-time totals from database
 * This should be replaced with actual database queries
 */
async function calculateAllTimeData() {
    // Placeholder for calculating all-time data
    // In production, this should query your database for:
    // - Total earnings (sum of all completed transactions)
    // - Total bookings (count of all bookings)
    // - Total customers (count of unique customers)
    // - Total leads (count of all leads)
    
    // For now, aggregate from localStorage or default values
    const allTimeData = {
        totalEarnings: parseFloat(localStorage.getItem('alltime_earnings') || '0'),
        totalBookings: parseInt(localStorage.getItem('alltime_bookings') || '0'),
        totalCustomers: parseInt(localStorage.getItem('alltime_customers') || '0'),
        totalLeads: parseInt(localStorage.getItem('alltime_leads') || '0')
    };
    
    return allTimeData;
}

/**
 * Update analytics with all-time data
 */
async function updateAllTimeAnalytics() {
    const allTimeData = await calculateAllTimeData();
    
    // Update counters with all-time data
    updateCounter('total-earning', allTimeData.totalEarnings);
    updateCounter('total-booking', allTimeData.totalBookings);
    updateCounter('total-customers', allTimeData.totalCustomers);
    updateCounter('total-leads', allTimeData.totalLeads);
    
    // Calculate growth from previous month
    const previousMonthData = {
        earnings: parseFloat(localStorage.getItem('lastmonth_earnings') || '0'),
        bookings: parseInt(localStorage.getItem('lastmonth_bookings') || '0'),
        customers: parseInt(localStorage.getItem('lastmonth_customers') || '0'),
        leads: parseInt(localStorage.getItem('lastmonth_leads') || '0')
    };
    
    const currentMonthData = {
        earnings: parseFloat(localStorage.getItem('thismonth_earnings') || '0'),
        bookings: parseInt(localStorage.getItem('thismonth_bookings') || '0'),
        customers: parseInt(localStorage.getItem('thismonth_customers') || '0'),
        leads: parseInt(localStorage.getItem('thismonth_leads') || '0')
    };
    
    // Calculate and update growth indicators
    const earningsGrowth = calculateGrowth(currentMonthData.earnings, previousMonthData.earnings);
    const bookingsGrowth = calculateGrowth(currentMonthData.bookings, previousMonthData.bookings);
    const customersGrowth = calculateGrowth(currentMonthData.customers, previousMonthData.customers);
    const leadsGrowth = calculateGrowth(currentMonthData.leads, previousMonthData.leads);
    
    updateGrowthIndicator('earning-growth-container', 'earning-growth', earningsGrowth);
    updateGrowthIndicator('booking-growth-container', 'booking-growth', bookingsGrowth);
    updateGrowthIndicator('customer-growth-container', 'customer-growth', customersGrowth);
    updateGrowthIndicator('leads-growth-container', 'leads-growth', leadsGrowth);
}

/**
 * Initialize analytics dashboard
 */
function initAnalytics() {
    // Load data on page load
    updateAllTimeAnalytics();
    
    // Set up auto-refresh
    setInterval(updateAllTimeAnalytics, ANALYTICS_CONFIG.refreshInterval);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}

// Export functions for external use
window.AnalyticsDashboard = {
    updateAllTimeAnalytics,
    calculateGrowth,
    updateCounter,
    formatNumber
};
