const express = require("express")
const router = express.Router()
const schemas = require("../models/schemas.js")


router.get("/cricket/tournaments", (req, res) => {
  schemas.Tournament.find()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).send(err.message);
      console.log(err);
    })
})

router.get("/cricket/image", (req, res) => {
  schemas.CountryImage.find()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).send(err.message);
      console.log(err);
    })
})

async function filterPlayersByCountry(country_1, country_2) {
  try {
    const filteredPlayers = await schemas.CountryPlayers.find({
      country: { $in: [country_1, country_2] }
    });
    return filteredPlayers;
  } catch (error) {
    console.error('Error filtering players:', error);
    throw error;
  }
}

router.get("/cricket/teams/:country_1/vs/:country_2", async (req, res) => {
  const { country_1, country_2 } = req.params
  try {
    const filteredPlayers = await filterPlayersByCountry(country_1, country_2);
    res.json(filteredPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter players' });
  }
})


const filterSelectedPlayers = async (country_1, country_2) => {
  try {
    const filteredData = await schemas.SelectedPlayers.find({
      country_1: country_1,
      country_2: country_2
    });
    return filteredData
  } catch (error) {
    console.error('Error filtering players:', error);
    throw error;
  }
};



router.get("/cricket/teams/:country_1/:country_2/selected_players", async (req, res) => {
  const { country_1, country_2 } = req.params;
  try {
    const filteredPlayers = await filterSelectedPlayers(country_1, country_2);
    console.log('Filtered players:', filteredPlayers); // Add for debugging
    res.json(filteredPlayers);
  } catch (error) {
    console.error('Error in route:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router