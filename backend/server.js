import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

// const PORT = process.env.PORT || 3000;
const PORT = 3001;

// Standalone mode: Bind directly to the host machine
app.listen(PORT, "0.0.0.0",() => {
  console.log(`Bibliomane is running at http://0.0.0.0:${PORT}`);
});
