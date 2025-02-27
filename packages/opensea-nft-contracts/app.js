const express = require('express')
const axios = require('axios')
const https = require("https")
const app = express()
const exec = require("child_process").exec
const port = 3000

/*
*
* Author : DRC
* Aim : APIfication
*/ 

app.use(express.json())

app.post('/initiate-minting', async (req, res) => {

    // Getting Player ID
    let  playerId  = req.body.playerId

    // Creating a new agent
    const agent = new https.Agent({  
        rejectUnauthorized: false,
    });

    // Checking if player exist
    let playerData = await axios.get(`https://127.0.0.1:3030/inventory-item?name=Player${playerId}`,{
            httpsAgent: agent
    })
    
    let PLAYER_DATA = playerData.data.data[0]
    // If player doesn't exist, hit RINKBY
    if(PLAYER_DATA === undefined){
        console.log("in insert")
        child = exec('npm run populate:rinkeby '+ playerId,(error, stdout, stderr)=>{
            console.log(stdout)
        })
        

            // From inventory item type, fetch by type=player
        let resp = await axios.get("https://127.0.0.1:3030/inventory-item-type?inventoryItemType=player",
        {
            httpsAgent: agent
        })

        // Get id of the item type
        let id = resp.data.data[0].inventoryItemTypeId
        try{
            // Get data from AWS S3 bucket, parse and insert
            let meta = await axios.get(`https://arkh-frontend.s3.us-west-1.amazonaws.com/basket/${playerId}`)
            const metadata = meta.data
            let obj ={
                "name" : metadata.name,
                "url" : metadata.image,
                "description" : metadata.description,
                "metadata" : metadata.attributes,
                "inventoryItemTypeId" : id
            }
            axios.post("https://127.0.0.1:3030/inventory-item", obj, {
                httpsAgent: agent
            }).then((response)=>{
                    res.end(JSON.stringify(response.data))
                    })
            }catch(e){ console.log("ERROR!")}
    }
    else
    {
        try{
            console.log("in update")
            // Get data from AWS S3 bucket, parse and insert
            let meta = await axios.get(`https://arkh-frontend.s3.us-west-1.amazonaws.com/basket/${playerId}`)
            const metadata = meta.data
            let obj ={
                "name" : metadata.name,
                "url" : metadata.image,
                "description" : metadata.description,
                "metadata" : metadata.attributes
            }
            axios.patch(`https://127.0.0.1:3030/inventory-item?inventoryItemId=${PLAYER_DATA.inventoryItemId}`, obj, {
                httpsAgent: agent
            }).then((response)=>{
                    res.end(JSON.stringify(response.data))
                    })
            }catch(e){ console.log("ERROR!")}
    }
    res.end(JSON.stringify({"Status":200, "Message": "NFT deployed with updated data."}))

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})