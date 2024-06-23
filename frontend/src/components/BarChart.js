
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BarChart = ({ month }) => {
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        fetchBarChartData();
    }, [month]);

    const fetchBarChartData = async () => {
        const response = await axios.get(`http://localhost:5000/api/barchart`, {
            params: { month }
        });
        setBarChartData(response.data);
    };

    return (
        <div>
            {/* Render bar chart here */}
        </div>
    );
};

export default BarChart;
