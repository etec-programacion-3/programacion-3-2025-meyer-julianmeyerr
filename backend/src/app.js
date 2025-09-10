const express =require( 'express');
const dotenv =require('dotenv');
const connectDB =require ('./database.js');

dotenv.config();

connectDB();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});