
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/dbDefinelab', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use(cors()); 

const matchSchema = new mongoose.Schema({
  id: String,
  name: String,
  venue: String,
  starred: Boolean,
});

const Match = mongoose.model('Match', matchSchema);



app.get('/api/matches', async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/matches', async (req, res) => {
  try {
    const newMatchData = req.body;
    const matchId = newMatchData.id;

    const existingMatch = await Match.findOne({ id: matchId });

    if (existingMatch) {
      await Match.deleteOne({ id: matchId });

      console.log(`Deleted existing match with ID: ${matchId}`);
      res.json({ message: `Deleted existing match with ID: ${matchId}` });
    } else {
      const newMatch = new Match(newMatchData);

      await newMatch.save();

      console.log(`Added new match with ID: ${matchId}`);
      res.json(newMatch);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
