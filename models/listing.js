const mongoose= require("mongoose");
const reviews = require("./reviews");


const listingSchema= new mongoose.Schema({
    title: {
        type:  String,
        required: true
    },
    description: String,
    image: {
          filename: String, 
          url: String,
            
          },
        
      
    price: Number,
    location: String,
    country: String,
    reviews: [
      {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },

});
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){

    await reviews.deleteMany({_id: {$in: listing.reviews}});
  }
})


const Listing = mongoose.model("Listing",listingSchema);

module.exports= Listing;