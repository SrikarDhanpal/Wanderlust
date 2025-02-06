const mongoose=require("mongoose");
const reviewschema= mongoose.Schema({
    Comment: String,
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type:mongoose.Schema.ObjectId,
        ref: "User"
    }
});


module.exports= mongoose.model("Review", reviewschema);


