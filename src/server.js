const app = require('./app');
require('dotenv').config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`Server OpenJob API sukses mengudara di http://${host}:${port}`);
});