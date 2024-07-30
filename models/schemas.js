const mongoose = require("mongoose")
const schema = mongoose.Schema


const tournamentsListSchema = new schema({
    country1: {type:String},
    country2: {type:String},
}) 
const tournaments = mongoose.model("Tournament", tournamentsListSchema, "tournaments")


const CountryImageSchema = new schema({
    image:String,
    title:String,  
}) 
const countryImage = mongoose.model("CountryImage", CountryImageSchema, "countryImage")


const CountryPlayersSchema = new schema({
    country: String,
    player_name: String,
    role: String,
}) 
const countryPlayers = mongoose.model("CountryPlayers", CountryPlayersSchema, "countryPlayers")


const SelectedPlayersSchema = new schema({
    country_1: String,
    country_2: String,
    teams: {
        players: [{
            country: String,
            player_name_x: String,
            role: String,
            fan_ratings: Number
        }]
    },
  
}) 
const selectedPlayers = mongoose.model("SelectedPlayers", SelectedPlayersSchema, "selectedPlayers")

const mySchema = {"Tournament": tournaments, "CountryImage":countryImage, "CountryPlayers":countryPlayers, "SelectedPlayers":selectedPlayers}

module.exports = mySchema