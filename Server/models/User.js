const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({

    email:{
        type:String,
        required:true,
        max:50
    },
    profileDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },
    image:{
        type:String,
    },
    purchasedTickets: [
        {
            eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "eventDetails",
                required: true
            },
            generalTicketsPurchased: {
                type: Number,
                default: 0
            },
            vipTicketsPurchased: {
                type: Number,
                default: 0
            },
            status:{
                type : String,
                default : "Purchased"
            }
        }
    ]
    // eventDetails:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"eventDetails",
    // }]
})

module.exports = mongoose.model("User", userSchema);