const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes/routes');
const authenticateToken = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const apiLimiter = require('./middleware/rateLimiter');
const cors = require('cors');
const { requestLogger } = require('./middleware/logger');


dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
    origin: 'http://your-frontend-domain.com', // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// Apply request logging
app.use(requestLogger);

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Apply rate limiting to all requests
app.use(apiLimiter);

app.use('/api', routes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
