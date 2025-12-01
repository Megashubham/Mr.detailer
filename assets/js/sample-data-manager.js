/**
 * Sample Data Initializer for Analytics Dashboard
 * 
 * This script provides sample data for testing the analytics dashboard.
 * Replace this with actual database queries in production.
 * 
 * To use this script, run it in the browser console or include it temporarily
 * to populate localStorage with sample data.
 */

// Sample data configuration
const SAMPLE_DATA = {
    // All-time totals
    alltime: {
        earnings: 2547890,    // Total earnings: ₹25,47,890
        bookings: 1234,       // Total bookings: 1,234
        customers: 567,       // Total customers: 567
        leads: 892            // Total leads: 892
    },
    
    // This month (current month)
    thisMonth: {
        earnings: 185000,     // This month earnings: ₹1,85,000
        bookings: 89,         // This month bookings: 89
        customers: 45,        // New customers this month: 45
        leads: 76             // Leads this month: 76
    },
    
    // Last month (previous month)
    lastMonth: {
        earnings: 165000,     // Last month earnings: ₹1,65,000
        bookings: 78,         // Last month bookings: 78
        customers: 38,        // New customers last month: 38
        leads: 65             // Leads last month: 65
    }
};

/**
 * Initialize sample data in localStorage
 */
function initializeSampleData() {
    // Store all-time data
    localStorage.setItem('alltime_earnings', SAMPLE_DATA.alltime.earnings);
    localStorage.setItem('alltime_bookings', SAMPLE_DATA.alltime.bookings);
    localStorage.setItem('alltime_customers', SAMPLE_DATA.alltime.customers);
    localStorage.setItem('alltime_leads', SAMPLE_DATA.alltime.leads);
    
    // Store this month data
    localStorage.setItem('thismonth_earnings', SAMPLE_DATA.thisMonth.earnings);
    localStorage.setItem('thismonth_bookings', SAMPLE_DATA.thisMonth.bookings);
    localStorage.setItem('thismonth_customers', SAMPLE_DATA.thisMonth.customers);
    localStorage.setItem('thismonth_leads', SAMPLE_DATA.thisMonth.leads);
    
    // Store last month data
    localStorage.setItem('lastmonth_earnings', SAMPLE_DATA.lastMonth.earnings);
    localStorage.setItem('lastmonth_bookings', SAMPLE_DATA.lastMonth.bookings);
    localStorage.setItem('lastmonth_customers', SAMPLE_DATA.lastMonth.customers);
    localStorage.setItem('lastmonth_leads', SAMPLE_DATA.lastMonth.leads);
    
    console.log('✅ Sample data initialized successfully!');
    console.log('All-time data:', SAMPLE_DATA.alltime);
    console.log('This month data:', SAMPLE_DATA.thisMonth);
    console.log('Last month data:', SAMPLE_DATA.lastMonth);
    
    // Calculate and display growth percentages
    displayGrowthStats();
}

/**
 * Display growth statistics
 */
function displayGrowthStats() {
    console.log('\n📊 Growth Statistics (This Month vs Last Month):');
    
    const earningsGrowth = calculateGrowthPercentage(
        SAMPLE_DATA.thisMonth.earnings,
        SAMPLE_DATA.lastMonth.earnings
    );
    console.log(`💰 Earnings: ${earningsGrowth}%`);
    
    const bookingsGrowth = calculateGrowthPercentage(
        SAMPLE_DATA.thisMonth.bookings,
        SAMPLE_DATA.lastMonth.bookings
    );
    console.log(`📋 Bookings: ${bookingsGrowth}%`);
    
    const customersGrowth = calculateGrowthPercentage(
        SAMPLE_DATA.thisMonth.customers,
        SAMPLE_DATA.lastMonth.customers
    );
    console.log(`👥 Customers: ${customersGrowth}%`);
    
    const leadsGrowth = calculateGrowthPercentage(
        SAMPLE_DATA.thisMonth.leads,
        SAMPLE_DATA.lastMonth.leads
    );
    console.log(`🎯 Leads: ${leadsGrowth}%`);
}

/**
 * Calculate growth percentage
 */
function calculateGrowthPercentage(current, previous) {
    if (previous === 0) return '+100.00';
    const growth = ((current - previous) / previous) * 100;
    return (growth >= 0 ? '+' : '') + growth.toFixed(2);
}

/**
 * Clear all analytics data from localStorage
 */
function clearAnalyticsData() {
    const keys = [
        'alltime_earnings', 'alltime_bookings', 'alltime_customers', 'alltime_leads',
        'thismonth_earnings', 'thismonth_bookings', 'thismonth_customers', 'thismonth_leads',
        'lastmonth_earnings', 'lastmonth_bookings', 'lastmonth_customers', 'lastmonth_leads'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🗑️ All analytics data cleared from localStorage');
}

/**
 * Update specific metric
 */
function updateMetric(metric, period, value) {
    const key = `${period}_${metric}`;
    localStorage.setItem(key, value);
    console.log(`✅ Updated ${key} to ${value}`);
    
    // Refresh dashboard if available
    if (window.AnalyticsDashboard && window.AnalyticsDashboard.updateAllTimeAnalytics) {
        window.AnalyticsDashboard.updateAllTimeAnalytics();
    }
}

// Auto-initialize on load (comment this out in production)
// initializeSampleData();

// Export functions to window for console access
window.SampleDataManager = {
    initialize: initializeSampleData,
    clear: clearAnalyticsData,
    update: updateMetric,
    showStats: displayGrowthStats,
    data: SAMPLE_DATA
};

console.log('📦 Sample Data Manager loaded!');
console.log('Available commands:');
console.log('  - SampleDataManager.initialize()  : Load sample data');
console.log('  - SampleDataManager.clear()       : Clear all data');
console.log('  - SampleDataManager.showStats()   : Show growth stats');
console.log('  - SampleDataManager.update(metric, period, value) : Update specific metric');
console.log('\nExample: SampleDataManager.update("earnings", "alltime", 3000000)');
