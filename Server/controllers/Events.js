const eventDetails=require('../models/EventDetails');
const User = require('../models/User');
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require('mongoose');


exports.getAllEvents= async (req,res)=>{

    try {
        const fetchedType=req.query.type;
        if(fetchedType){
            const getAllEvents=await eventDetails.find({category:"Events",type:fetchedType});
            return res.status(200).json({
                success:true,
                getAllEvents,
                message:'Successfully fetched all the events'
            });
        }
        const getAllEvents=await eventDetails.find({category:"Events"});

        return res.status(200).json({
            success:true,
            getAllEvents,
            message:'Successfully fetched all the events'
        })

    } catch (error) {
        return res.status(500).json({
			success: false,
			message: "Something went wrong while signing up the user",
		});
    }
}

exports.createEvent= async(req,res)=>{

    try {
        const {dateAndTime,location,title,generalSeatPrice,vipSeatPrice,
            duration,language,artist,type,category,generalSeats,vipSeats,organiserId}=req.body;
            const image = req.files.image;
            // const organiserId=req.user.id;
            // console.log('Request body: ', req.body);

        // console.log('imageUrl ',image);
       // Convert the dateAndTime string from "dd-mm-yyyy hh:mm" to a valid Date object
        const [datePart, timePart,zone] = dateAndTime.split(" ");
        const [day, month, year] = datePart.split("/");
        let [hours, minutes] = timePart.split(":");
        // const formattedDateAndTime = new Date(year, month - 1, day, hours, minutes);
        // console.log('date ',date);
        // console.log('image ', image);
        // Convert to 24-hour format
if (zone === "PM" && hours !== "12") {
    hours = parseInt(hours) + 12;
  } else if (zone === "AM" && hours === "12") {
    hours = "0";
  }
  
  // Create date in local timezone
  const localDate = new Date(year, month - 1, day, hours, minutes);
  
  // Convert to UTC
  const formattedDateAndTime = new Date(localDate.toISOString());
  //console.log(formattedDateAndTime); // "2024-11-20T14:00:00.000Z"
        if( !image || !formattedDateAndTime || !location || !title || !generalSeatPrice || !vipSeatPrice || 
           !duration || !language || !artist || !type || !category || !generalSeats || !vipSeats
        ){
            return res.status(403).json({
                success:false,
                message:'All feilds are required.'
            });
        }
        const imageUrl=await uploadImageToCloudinary(
            image,
            process.env.FOLDER_NAME
          );
        //   const generalTicketsSold=0,vipTicketsSold=0;
        const response= await eventDetails.create({organiser:organiserId,imageUrl:imageUrl.secure_url,dateAndTime:formattedDateAndTime,location,title,
            generalSeatPrice,vipSeatPrice,duration,language,artist,type,category,vipSeats,generalSeats});
        
        return res.status(200).json({
            success:true,
            data:response,
            message:'Event Created successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'something went wrong while creating Event'
        });
    }
}

exports.getEventDetails= async (req,res)=>{
   try {
        const { id } = req.body;
        const reqEventDetails = await eventDetails.findById(id);

        return res.status(200).json({
            success:true,
            reqEventDetails,
            message:'Succesfully fetched event details'
        })
   } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching the event details",
    });
   }
}


exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Event id is required.",
            });
        }

        const deletedEvent = await eventDetails.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }

        return res.status(200).json({
            success: true,
            deletedEvent,
            message: "Successfully deleted the event.",
        });
    } catch (error) {
        console.error("deleteEvent error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the event.",
        });
    }
};

exports.cancelEventByUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, eventId } = req.body;

        if (!userId || !eventId) {
            throw new Error("User not found");
            // return res.status(400).json({
            //     success: false,
            //     message: "userId and eventId are required.",
            // });
        }
        
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: userId,
                "purchasedTickets.eventId": eventId,
                "purchasedTickets.status" : "Purchased"
            },
            {
                $set: { "purchasedTickets.$.status": "Cancelled" },
            },
            { new: true , session}
        );

        if (!updatedUser) {
            throw new Error("User not found");
            // return res.status(404).json({
            //     success: false,
            //     message: "User or ticket for this event not found.",
            // });
        }
        const ticket = updatedUser.purchasedTickets.find(
            (t) => t.eventId.toString() === eventId.toString()
        );

        if (!ticket) {
            throw new Error("Ticket not found");
            // return res.status(404).json({
            //     success: false,
            //     message: "Ticket for this event not found.",
            // });
        }

        const generalSeatsPur = ticket.generalTicketsPurchased;
        const vipSeatsPur = ticket.vipTicketsPurchased;

        const updatedEvent = await eventDetails.findOneAndUpdate(
            {
                _id: eventId,
            },
            {
                $inc: { 
                    generalTicketsSold : -generalSeatsPur,
                    vipTicketsSold : -vipSeatsPur
                },
                $pull: {
                    userEnrolled: userId, // adjust field name to match your actual schema
                },
            },
            { new: true , session}
        );

         if (!updatedEvent) {
            throw new Error("Event not found");
            // return res.status(404).json({
            //     success: false,
            //     message: "Event does not found for this User but event cancelled successfully.",
            // });
        }

        // If we reach here, both succeeded — commit
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            updatedUser,
            message: "Successfully cancelled the event for the user.",
        });
    } catch (error) {
         // Something failed — roll back both changes
        await session.abortTransaction();
        session.endSession();
        console.error("cancelEventByUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while cancelling the event.",
        });
    }
};