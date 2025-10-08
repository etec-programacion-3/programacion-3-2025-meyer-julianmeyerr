import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import routes from './routes/index.js';

const app = express();
connectDB();

dotenv.config();

app.use(express.json());

routes.forEach(r => {app.use(r.path, r.router)});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;