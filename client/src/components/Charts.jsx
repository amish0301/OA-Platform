import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { getLast7Days } from '../lib/feature';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const LineChart = ({ data, label, isTest = false }) => {

    let labels;
    if (!isTest) {
        labels = getLast7Days();
    } else {
        labels = data?.testDates
    }

    const userChartData = {
        labels,
        datasets: [
            {
                label,
                data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5,
            }
        ],
    }

    const testPerformanceData = {
        labels,
        datasets: [
            {
                label,
                data: data?.scores,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5,
            }
        ],
    }

    const LineChartOption = {
        responsive: true,
        plugins: {
            legend: {
                display: isTest ? false : true,
                position: 'bottom',
            }
        },
        scales: {
            x: {
                title: !isTest ? undefined : {
                    display: true,
                    text: 'Date',
                    color: '#000',
                    font: {
                        size: 14,
                        family: "'Poppins', sans-serif",
                        weight: 'bold',
                    },
                },
                grid: {
                    display: false
                },
            },
            y: {
                title: !isTest ? undefined : {
                    display: true,
                    text: 'Score',
                    color: '#000',
                    font: {
                        size: 14,
                        family: "'Poppins', sans-serif",
                        weight: 'bold',
                    },
                },
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                },
            },
        },
    };

    return <>
        {isTest ? <Line data={testPerformanceData} options={LineChartOption} /> : <Line data={userChartData} options={LineChartOption} />}
    </>
}

export const DoughnutChart = ({ finish, unfinish }) => {

    const chartData = {
        labels: ["Finished Tests", "Unfinished Tests"],
        datasets: [{
            label: 'Test Submission Ratio',
            data: [finish, unfinish],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 2,
            hoverOffset: 30,
        }]
    }

    const options = {
        responsive: true,
        cutout: '70%',
        layout: {
            padding: 10
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#333',
                    font: {
                        size: 12, // Label font size
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        weight: 'normal',
                    },
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    },
                },
            },
        },
        animation: {
            animateRotate: true,
            animateScale: true,
        },
    };

    return <Doughnut data={chartData} options={options} />
}

export const PieChart = ({ pieData = [] }) => {

    const labels = pieData.map(item => item.categoryName);
    const values = pieData.map(item => item.percentage);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Test Category Average (%)',
                data: values,
                backgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                ],
                hoverBackgroundColor: [
                    '#FF6384AA',
                    '#36A2EBAA',
                    '#FFCE56AA',
                    '#4BC0C0AA',
                    '#9966FFAA',
                ],
                borderWidth: 1,
                hoverOffset: 15
            }
        ]
    }

    const options = {
        responsive: true,
        layout: {
            padding: 10,
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#333',
                    font: {
                        size: 14,
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    },
                    padding: 20
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                bodyColor: '#fff',
                bodyFont: {
                    size: 14,
                },
                callbacks: {
                    label: function (tooltipItem) {
                        const label = tooltipItem.label;
                        const value = tooltipItem.raw;
                        return `${label}: ${value}%`;
                    },
                },
                padding: 10,
                cornerRadius: 10,
            },
        },
    }
    return <Pie data={chartData} options={options} />
}