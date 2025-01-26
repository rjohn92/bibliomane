import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

// Standalone mode: Bind directly to the host machine
app.listen(PORT, () => {
  console.log(`Bibliomane is running at http://localhost:${PORT}`);
});
