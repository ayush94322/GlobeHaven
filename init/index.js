if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

const MONGO_URL = "mongodb://127.0.0.1:27017/GlobeHaven";
main()
    .then(()=>{
        console.log("Connected to DataBase");
    }).catch((err)=>{
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    for(let listing of initData.data) {
        const response = await geocodingClient.forwardGeocode({
            query: `${listing.location}, ${listing.country}`,
            limit: 1
        }).send()
        listing.owner = "6977504c4a08ffa79e91efce";
        listing.geometry = response.body.features[0].geometry;
    }
    await Listing.insertMany(initData.data);
    
    console.log("Data was initialised");
}
initDB();