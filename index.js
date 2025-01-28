const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const artBankRoutes=require('./routes/artBankRoutes'); // Import user routes
const spermraiseRequesition=require('./routes/spermraiseRequesition');
const oocyteraiseRequesition=require('./routes/oocyteraiseRequesition');
const surrogacyraiseRequesition=require('./routes/surrogacyraiseRequesition');
const addspermdetails=require('./routes/addspermRoutes');
const recievespermdetails=require('./routes/recievespermRoutes');
const issuespermdetails=require('./routes/issuespermRoutes');
const addoocytedetails=require('./routes/addoocyteRoutes');
const recieveoocytedetails=require('./routes/recieveoocyteRoutes');
const issueoocytedetails=require('./routes/issueoocyteRoutes');
const addsurrogateedetails=require('./routes/addsurrogateRoutes');
const recievesurrogatedetails=require('./routes/recievesurrogateRoutes');
const issuesurrogate=require('./routes/issuesurrogate');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow credentials (cookies)
}));

// API Routes
app.use('/api', userRoutes);
app.use('/api', artBankRoutes);
app.use('/api',spermraiseRequesition);
app.use('/api',oocyteraiseRequesition);
app.use('/api',surrogacyraiseRequesition);
app.use('/api',addspermdetails);
app.use('/api',recievespermdetails);
app.use('/api',issuespermdetails);
app.use('/api',addoocytedetails);
app.use('/api',recieveoocytedetails);
app.use('/api',issueoocytedetails);
app.use('/api',addsurrogateedetails);
app.use('/api',recievesurrogatedetails);
app.use('/api',issuesurrogate);
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });
