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


router.get("/cricket/selectedteams", async (req, res) => {
  schemas.SelectedTeams.find()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).send(err.message);
      console.log(err);
    })
});


router.get("/cricket/players", async (req, res) => {
  schemas.SelectedTeams.find()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).send(err.message);
      console.log(err);
    })
});



const filterSelectedTeamPlayers = async (country) => {
  try {
    const filteredData = await schemas.CountryPlayers.find({
      country: { $in: country }
    });
    return filteredData
  } catch (error) {
    console.error('Error filtering players:', error);
    throw error;
  }
};

router.get("/cricket/players/:country", async (req, res) => {
  const { country } = req.params
  try {
    const filteredPlayers = await filterSelectedTeamPlayers(country);
    res.json(filteredPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter players' });
  }
})

router.post('/cricket/players/addplayer', async (req, res) => {
  const playerDetail = req.body;
  const { team } = playerDetail;

  try {
    const existingPlayers = await schemas.AddPlayers.find({ team });
    if (existingPlayers.length >= 11) {
      return res.status(400).json({ error: 'Maximum 11 players allowed per team!' });
    }

    const newPlayer = await schemas.AddPlayers.create(playerDetail);
    res.status(201).send({ data: newPlayer, msg: 'Added successfully' });
  } catch (err) {
    res.status(500).send({ data: err, msg: 'Exceeded the Limit' });
    console.log(err);
  }
});

router.get("/cricket/icc_world_cup", (req, res) => {
  schemas.Tournament.find()
    .then((data) => {
      res.status(201).json(data);

    })
    .catch((err) => {
      res.status(500).send(err.message);
      console.log(err);
    })
})

const filterAddingPlayerData = async (country_1, country_2) => {
  try {
    const filteredData = await schemas.AddPlayers.find({
      team: { $in: [country_1, country_2] }
    });
    return filteredData
  } catch (error) {
    console.error('Error filtering players:', error);
    throw error;
  }
};


router.get("/cricket/icc_world_cup/:country_1/vs/:country_2/add_player_data", async (req, res) => {
  const { country_1, country_2 } = req.params;
  try {
    const filteredPlayers = await filterAddingPlayerData(country_1, country_2);
    // console.log('Filtered players:', filteredPlayers); // Add for debugging
    res.json(filteredPlayers);
  } catch (error) {
    console.error('Error in route:', error);
    res.status(500).json({ error: error.message });
  }
})


// Get one player for post request
router.get("/cricket/icc_world_cup/:country_1/vs/:country_2/getOneplayer/:id", async (req, res) => {
  const { country_1, country_2, id } = req.params;
  try {
    const filteredPlayers = await filterAddingPlayerData(country_1, country_2);
    const playerToUpdate = filteredPlayers.find(
      (player) => player._id.toString() === id
    );

    if (!playerToUpdate) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(playerToUpdate);
  } catch (error) {
    console.error('Error in route:', error);
    res.status(500).json({ error: error.message });
  }
});




// Add player details
router.post("/cricket/icc_world_cup/:country_1/vs/:country_2/add_player_detail/:id", async (req, res) => {
  const playerDetail = req.body;

  try {
    const newPlayer = await schemas.AddPlayerDetails.create(playerDetail);
    res.status(201).send({ data: newPlayer, msg: "added successfully" });
  } catch (error) {
    console.error("Error adding player:", error);
    if (error.name === 'ValidationError') {
      // Handle validation errors
      if (error.errors.name && error.errors.name.kind === 'unique') {
        return res.status(409).json({ error: 'Player already exists' });
      }
      return res.status(400).json({ error: error.message });
    } else if (error.name === 'MongoError') {
      // Handle MongoDB-specific errors
      if (error.code === 11000) { // Duplicate key error
        return res.status(409).json({ error: 'Player already exists' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    } else {
      // Handle other errors
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

const checkPlayerDataDetails = async (country_1, country_2) => {
  try {
    const filteredData = await schemas.AddPlayerDetails.find({
      country_1,
      country_2,
     
    });
    return filteredData;
  } catch (error) {
    console.error('Error filtering players:', error);
    throw error; // Re-throw the error for handling in the route
  }
};
// get player data from AddPlayerDetails Schema
router.get("/cricket/icc_world_cup/:country_1/vs/:country_2/add_player_detail", async (req, res) => {
  const { country_1, country_2 } = req.params;
  try {
    const filteredPlayers = await checkPlayerDataDetails(country_1, country_2);
    res.json(filteredPlayers);
  } catch (error) {
    console.error('Error in route:', error);
    res.status(500).json({ error: error.message });
  }
})


const filterUpdatingPlayerData = async (country_1, country_2) => {
  try {
    const filteredData = await schemas.AddPlayerDetails.find({
      country_1,
      country_2,
      
    });
    return filteredData
  } catch (error) {
    console.error('Error filtering players:', error);
    throw error;
  }
};


// get one player for updating player details
router.get("/cricket/icc_world_cup/:country_1/vs/:country_2/addPlayerDetails/getOneplayer/:id", async (req, res) => {
  const { country_1, country_2, id, } = req.params;
  try {
    const filteredPlayers = await filterUpdatingPlayerData(country_1, country_2, id);
    const playerToUpdate = filteredPlayers.find(
      (player) => player._id.toString() === id
    );

    if (!playerToUpdate) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(playerToUpdate);
  } catch (error) {
    console.error('Error in route:', error);
    res.status(500).json({ error: error.message });
  }
});

//update player details
router.put("/cricket/icc_world_cup/:country_1/vs/:country_2/updateplayer/:id", (req, res) => {
  const id = req.params.id;
  schemas.AddPlayerDetails.findByIdAndUpdate(id, req.body, { new: true })
      .then(() => res.status(200).json({ msg: "player Updated successfully" }))
      .catch(err => {
          res.status(500).send(err.message);
          console.log(err);
      })
})

module.exports = router