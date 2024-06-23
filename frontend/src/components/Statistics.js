
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({ totalSales: 0, soldItems: 0, unsoldItems: 0 });

    useEffect(() => {
        fetchStatistics();
    }, [month]);

    const fetchStatistics = async () => {
        const response = await axios.get(`http://localhost:5000/api/statistics`, {
            params: { month }
        });
        setStatistics(response.data);
    };

    return (
        <div>
            <p>Total Sales: {statistics.totalSales}</p>
            <p>Sold Items: {statistics.soldItems}</p>
            <p>Unsold Items: {statistics.unsoldItems}</p>
        </div>
    );
};

export default Statistics;
