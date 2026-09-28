const router=require("express").Router();
const {auth}=require('../middleware/auth');
const {getAllEvents,createEvent,getEventDetails, 
    deleteEvent, cancelEventByUser}=require('../controllers/Events');

router.post("/events",createEvent);

router.post("/cancelEventByUser",cancelEventByUser);

router.delete("/deleteEvent/:id", deleteEvent);

router.get("/getEvents",getAllEvents);

router.post("/getEventDetails",getEventDetails);
module.exports=router;

