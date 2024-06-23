// backend/controllers/transactions.js
const axios = require('axios');
const Transaction = require('../models/Transaction');

const dataSourceUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get(dataSourceUrl);
        const transactions = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data.' });
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Error initializing database.' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { month, search, page = 1, perPage = 10 } = req.query;

        let query = {};
        if (month) {
            const startDate = new Date(`2021-${month}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            query.dateOfSale = { $gte: startDate, $lt: endDate };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $regex: search, $options: 'i' } }
            ];
        }

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Error fetching transactions.' });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        const startDate = new Date(`2021-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
            { $group: { _id: null, total: { $sum: '$price' }, count: { $sum: 1 } } }
        ]);

        const unsoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: false });

        res.status(200).json({
            totalSales: totalSales[0]?.total || 0,
            soldItems: totalSales[0]?.count || 0,
            unsoldItems: unsoldItems || 0
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Error fetching statistics.' });
    }
};

exports.getBarChart = async (req, res) => {
    try {
        const { month } = req.query;
        const startDate = new Date(`2021-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        let result = [];
        for (const { range, min, max } of priceRanges) {
            const count = await Transaction.countDocuments({
                dateOfSale: { $gte: startDate, $lt: endDate },
                price: { $gte: min, $lt: max }
            });

            result.push({ range, count });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ error: 'Error fetching bar chart data.' });
    }
};

exports.getPieChart = async (req, res) => {
    try {
        const { month } = req.query;
        const startDate = new Date(`2021-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const categories = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ error: 'Error fetching pie chart data.' });
    }
};

exports.getCombinedData = async (req, res) => {
    try {
        const statistics = await this.getStatistics(req, res);
        const barChart = await this.getBarChart(req, res);
        const pieChart = await this.getPieChart(req, res);

        res.status(200).json({ statistics, barChart, pieChart });
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).json({ error: 'Error fetching combined data.' });
    }
};
