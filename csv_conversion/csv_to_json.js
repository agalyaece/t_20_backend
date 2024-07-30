const csvtojson = require("csvtojson")
const csvFilePath = "PlayerData.csv"

const fs = require("fs")

csvtojson()
.fromFile(csvFilePath)
.then((jsonfile) => {
    console.log(jsonfile)

    fs.writeFileSync("PlayerData.json", JSON.stringify(jsonfile), "utf-8", (err) => {
        if(err) console.log(err)
    })
})