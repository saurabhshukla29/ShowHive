import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './BookedTicket.css';
import photo from '../assets/ANI-20240121194141.jpg';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConnector } from '../services/apiConnector';
import { eventEndpoints } from '../services/api';
import { formatDate } from '../services/formatDate';
const BookedTicket = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [openModalIndex, setOpenModalIndex] = useState(null); // Track which event modal is open
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        // console.log('id ',id);
        const id=user._id;
        //console.log('id ',id);
        const response = await apiConnector("POST", eventEndpoints.GETUSERBOOKEDTICKETS_API, { id }, { Authorization: `Bearer ${token}` }, null, false);
        //console.log("userbooked ",response.data.userBookedTickets.purchasedTickets);
        setEvents(response.data.userBookedTickets.purchasedTickets);
      } catch (error) { 
        console.log("Error while fetching booked-ticket details", error);
      }
    }
    fetchEventDetails();
  }, [user,token]);

  const handleShow = (index) => setOpenModalIndex(index);
  const handleClose = () => setOpenModalIndex(null);
  // if(events.length===0){
  //   return(
  //     <>
  //       You have not Booked Any Tickets yet;
  //     </>
  //   );
  // }
  return (
    <div className="booked-ticket-container">
      {events && events.map((event, index) => (
        <div>
          <div className="booked-ticket-card" key={event.eventId._id}>
            <div className="img">
              <img src={event.eventId.imageUrl} alt="Event" />
            </div>
            <div className="details">
              <span>{event.eventId.title}</span>
              <span>
                <Button  onClick={() => handleShow(index)}>
                  View Details
                </Button>
              </span>
            </div>
          </div>

          {/* Modal for displaying detailed information */}
          <Modal show={openModalIndex === index} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{event.eventId.title} Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>No. of General Tickets Booked: {event.generalTicketsPurchased}</p>
              <p>No. of VIP Tickets Booked: {event.vipTicketsPurchased}</p>
              <p>Total Price: Rs.{(event.eventId.generalSeatPrice)*(event.generalTicketsPurchased)+(event.eventId.vipSeatPrice)*(event.vipTicketsPurchased)}</p>
              <p>Location: {event.eventId.location}</p>
              <p>Artists: {event.eventId.artist}</p>
              <p>Date: {formatDate(event.eventId.dateAndTime)}</p>
              <p>Category: {event.eventId.category}</p>
              <p>Duration: {event.eventId.duration} hours</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ))}
    </div>
  );
}

export default BookedTicket;
