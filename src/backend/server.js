import express from 'express';
import pg from 'pg';
import cors from 'cors';


const { Pool } = pg;
const app = express();
const port = 3000;
const passcode = 'Your passcode'

// Connect to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'weatherapp',
  password: passcode,
  port: 5433,
  search_path: ['savedlocations', 'public'],
});

app.use(cors());
app.use(express.json());

// API endpoint for adding a city
app.post('/addCity', async (req, res) => {
  const { territory, city, lat, long } = req.body;
  try {
    const newCity = await pool.query(
      'INSERT INTO savedlocations.cities(territory, city, latitude, longitude) VALUES($1, $2, $3, $4) RETURNING *',
      [territory, city, lat, long]
    );

    // Statement for no duplicates; needs fixing
    if (newCity.rowCount === 0) {
      return res.status(409).json({ message: 'City already exists' });
    }

    res.json(newCity.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

// API endpoints for retrieving all cities
app.get('/cities', async (req, res) => {
  try {
    const allCities = await pool.query('SELECT * FROM savedlocations.cities');
    res.json(allCities.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Extract id from URL parameter
  try {
    await pool.query('DELETE FROM savedlocations.cities WHERE id = $1', [id]);
    res.json({ message: 'City deleted successfully', id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
