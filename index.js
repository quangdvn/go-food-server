const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const databaseConnection = require('./configs/dbConnect').databaseConnection;

//* Routes import
const businessApi = require('./routes/services/business');
const userRouter = require('./routes/auth/user')

const app = express();
const PORT = process.env.PORT || 3000;

//* Default config
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(userRouter)

//* Routes use
app.use('/api/business', businessApi);

app.get('/', (req, res) => {
  res.status(200).send('Welcome to go food server ...');
});

databaseConnection();

app.listen(PORT, () => {
  console.log(`App run on port ${PORT}`);
});
