/**
 * Revenue Chart for Financial Year
 * Shows: Bookings, Sales, Leads, and Conversion %
 * Financial Year: April 2025 - March 2026
 */

(function() {
    'use strict';

    // Financial year months (April to March)
    const fyMonths = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    
    // Sample data for demonstration (replace with actual data from backend)
    const chartData = {
        bookings: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        sales: [22.89, 35.50, 28.75, 42.30, 31.20, 38.90, 25.60, 27.80, 45.20, 33.40, 39.80, 41.50],
        leads: [15, 12, 7, 9, 18, 14, 22, 19, 5, 25, 11, 16],
        bookedLeads: [8, 10, 5, 7, 12, 10, 15, 13, 4, 18, 8, 12]
    };

    function initRevenueChart() {
        const chartElement = document.querySelector("#customer_impression_charts");
        if (!chartElement) return;

        // Get colors from data attributes
        const colors = chartElement.getAttribute('data-colors');
        const chartColors = colors ? JSON.parse(colors) : ["--vz-success", "--vz-primary", "--vz-danger"];
        
        // Convert CSS variables to actual colors
        const getChartColorsArray = (colors) => {
            return colors.map(value => {
                const newValue = value.replace(/\s/g, "");
                if (newValue.indexOf(",") === -1) {
                    const color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
                    return color || newValue;
                } else {
                    const val = value.split(',');
                    if (val.length === 2) {
                        const rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                        return "rgba(" + rgbaColor + "," + val[1] + ")";
                    }
                }
            });
        };

        const linechartcustomerColors = getChartColorsArray(chartColors);

        const options = {
            series: [{
                name: 'Bookings',
                type: 'area',
                data: chartData.bookings
            }, {
                name: 'Sales',
                type: 'bar',
                data: chartData.sales
            }, {
                name: 'Leads',
                type: 'line',
                data: chartData.leads
            }],
            chart: {
                height: 370,
                type: 'line',
                stacked: false,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            stroke: {
                width: [2, 0, 2.2],
                curve: 'smooth',
                dashArray: [0, 0, 8]
            },
            plotOptions: {
                bar: {
                    columnWidth: '30%',
                    borderRadius: 0
                }
            },
            fill: {
                opacity: [0.1, 0.9, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: fyMonths,
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 6
                }
            },
            xaxis: {
                type: 'category'
            },
            yaxis: {
                title: {
                    text: undefined
                },
                min: 0
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y, { seriesIndex }) {
                        if (typeof y !== "undefined") {
                            if (seriesIndex === 1) {
                                return "₹" + y.toFixed(2) + "k";
                            } else if (seriesIndex === 2) {
                                return y + " Leads";
                            }
                            return y;
                        }
                        return y;
                    }
                }
            },
            colors: linechartcustomerColors,
            legend: {
                position: 'bottom',
                horizontalAlign: 'center'
            }
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();

        // Update summary cards
        updateSummaryCards();
    }

    function updateSummaryCards() {
        // Calculate totals for current financial year
        const totalBookings = chartData.bookings.reduce((a, b) => a + b, 0);
        const totalSales = chartData.sales.reduce((a, b) => a + b, 0);
        const totalLeads = chartData.leads.reduce((a, b) => a + b, 0);
        const totalBookedLeads = chartData.bookedLeads.reduce((a, b) => a + b, 0);
        
        // Calculate conversion percentage
        const conversionRate = totalLeads > 0 ? ((totalBookedLeads / totalLeads) * 100).toFixed(2) : 0;

        // Update the cards (find counter-value spans in the revenue chart section)
        const revenueCard = document.querySelector('#customer_impression_charts').closest('.card');
        if (revenueCard) {
            const counterValues = revenueCard.querySelectorAll('.counter-value');
            if (counterValues.length >= 4) {
                // Bookings
                counterValues[0].setAttribute('data-target', totalBookings);
                counterValues[0].textContent = totalBookings;
                
                // Sales
                counterValues[1].setAttribute('data-target', totalSales.toFixed(2));
                counterValues[1].textContent = totalSales.toFixed(2);
                
                // Leads
                counterValues[2].setAttribute('data-target', totalLeads);
                counterValues[2].textContent = totalLeads;
                
                // Conversion %
                counterValues[3].setAttribute('data-target', conversionRate);
                counterValues[3].textContent = conversionRate;
            }
        }
    }

    // Initialize chart when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRevenueChart);
    } else {
        initRevenueChart();
    }

    // Expose function globally for updates
    window.updateRevenueChart = function(newData) {
        if (newData) {
            Object.assign(chartData, newData);
            initRevenueChart();
        }
    };

})();
