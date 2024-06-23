
const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions');

router.get('/initialize', transactionsController.initializeDatabase);
router.get('/transactions', transactionsController.getTransactions);
router.get('/statistics', transactionsController.getStatistics);
router.get('/barchart', transactionsController.getBarChart);
router.get('/piechart', transactionsController.getPieChart);
router.get('/combined', transactionsController.getCombinedData);

module.exports = router;
