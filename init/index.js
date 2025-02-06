const mongoose = require('mongoose');
const initdata= require("./data.js");
const Listing = require("../models/listing.js");
main()
.then(()=>{
    console.log("connection successfull");
})
.catch((err)=>{
    console.log(err);
    
});

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const initDb= async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner: "67a2074f0eeb01a06dca4ca5"}));
    await Listing.insertMany(initdata.data)

    console.log("data base initialized");
};
initDb();
// console.log(initdata);