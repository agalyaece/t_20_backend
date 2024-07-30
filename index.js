const express = require("express")
const cors =  require("cors")
const bodyParser = require("body-parser")
const router = require("./routes/routes.js")
const mongoose = require("mongoose")
require("dotenv/config")


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const corsOption = {
    origin: "*",
    credentials: true,
    optionSuccessStatus:200
}

app.use(cors(corsOption))
app.use("/", router )


mongoose.connect(process.env.DB_URI)
.then(() => console.log("DB connected"))
.catch(err => console.log(err))


const port = process.env.PORT || 4000

app.listen(port, () => console.log(`server is running on port ${port}`))