
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const dbURI = 'mongodb://localhost:27017/mernCodingChallenge';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(5000, () => console.log('Server started on port 5000')))
    .catch(err => console.log(err));

// Import routes
const transactionRoutes = require('./routes/transactions');
app.use('/api', transactionRoutes);


