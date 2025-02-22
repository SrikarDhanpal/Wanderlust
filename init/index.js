if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
    const mongoose = require('mongoose');
    const initdata= require("./data.js");
    const Listing = require("../models/listing.js");
    const dbUrl = process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connection successfull");
})
.catch((err)=>{
    console.log(err);
    
});

main().catch(err => console.log(err));
async function main() {
    console.log(dbUrl);
    await mongoose.connect(dbUrl);
    
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const initDb= async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner: "67b9a7b664b9ca7b34f25be4",geometry:{type: "Point", coordinates: [78.312,15.324]}}));
    await Listing.insertMany(initdata.data)

    console.log("data base initialized");
};
initDb();
// console.log(initdata);