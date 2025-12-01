/**
 * Lead Source Chart
 * Shows percentage breakdown of lead sources using a donut chart
 */

(function() {
    'use strict';

    // Sample data for demonstration (replace with actual data from backend)
    const leadSourceData = {
        labels: ['Direct', 'Social Media', 'Email', 'Referrals', 'Website'],
        values: [44, 55, 41, 17, 15] // Total: 172 leads
    };

    function initLeadSourceChart() {
        const chartElement = document.querySelector("#store-visits-source");
        if (!chartElement) return;

        // Get colors from data attributes
        const colors = chartElement.getAttribute('data-colors');
        const chartColors = colors ? JSON.parse(colors) : ["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"];
        
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

        const chartDonutBasicColors = getChartColorsArray(chartColors);

        const options = {
            series: leadSourceData.values,
            labels: leadSourceData.labels,
            chart: {
                height: 333,
                type: 'donut'
            },
            legend: {
                position: 'bottom'
            },
            stroke: {
                show: false
            },
            dataLabels: {
                dropShadow: {
                    enabled: false
                }
            },
            colors: chartDonutBasicColors,
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%'
                    }
                }
            }
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();
    }

    // Initialize chart when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLeadSourceChart);
    } else {
        initLeadSourceChart();
    }

    // Expose function globally for updates
    window.updateLeadSourceChart = function(newData) {
        if (newData) {
            Object.assign(leadSourceData, newData);
            // Re-initialize chart with new data
            const chartElement = document.querySelector("#store-visits-source");
            if (chartElement) {
                chartElement.innerHTML = '';
                initLeadSourceChart();
            }
        }
    };

})();
