
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PieChart = ({ month }) => {
    const [pieChartData, setPieChartData] = useState([]);

    useEffect(() => {
        fetchPieChartData();
    }, [month]);

    const fetchPieChartData = async () => {
        const response = await axios.get(`http://localhost:5000/api/piechart`, {
            params: { month }
        });
        setPieChartData(response.data);
    };

    return (
        <div>
            {/* Render pie chart here */}
        </div>
    );
};

export default PieChart;
