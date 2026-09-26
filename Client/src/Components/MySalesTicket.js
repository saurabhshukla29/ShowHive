import React, { useEffect, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { apiConnector } from '../services/apiConnector';
import { useSelector } from "react-redux";
import { eventEndpoints } from '../services/api';
import { formatDate } from '../services/formatDate';
import './MySalesTicket.css';

const MySalesTicket = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [openIndex, setOpenIndex] = useState(null); // Track which card is open
  const [events, setEvents] = useState([]);


  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const id=user._id;
        //console.log(' sales id ',id);
        const response = await apiConnector("POST", eventEndpoints.GETUSERALLSALES_API, { id }, {Authorization: `Bearer ${token}`,}, null, false);
        //console.log("Organiser response: ", response.data.organiserEvents);
        setEvents(response.data.organiserEvents); // Assuming the response returns an array called organiserEvents
      } catch (error) {
        console.error('Error while fetching event details:', error);
      }
    }
    fetchEventDetails();
  }, [user,token]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {events.map((event, index) => (
        <div className="mySalesContainer">
          <div key={event.id} className="my-sales-card">
          <h2>{event.title}</h2>
          <p>Amount Generated: Rs.{(event.generalSeatPrice)*(event.generalTicketsSold)+(event.vipSeatPrice)*(event.vipTicketsSold)}</p>
          <div
            onClick={() => handleToggle(index)}
            aria-controls={`collapse-text-${index}`}
            aria-expanded={openIndex === index}
            className='view-detail'
          >
            {openIndex === index ? "Hide Details" : "View Details"}
          </div>
        </div>
        <Collapse in={openIndex === index}>
        <div id={`collapse-text-${index}`} className="collapse-content">
          <div className='collapseDetail'>Total Sales of General Tickets: {event.generalTicketsSold}</div>
          <div className='collapseDetail'>General Ticket Price: Rs.{event.generalSeatPrice}</div>
          <div className='collapseDetail'>Total Sales of VIP Tickets: {event.vipTicketsSold}</div>
          <div className='collapseDetail'>VIP Ticket Price: Rs.{event.vipSeatPrice}</div>
          <div className='collapseDetail'>Location: {event.location}</div>
          <div className='collapseDetail'>Artists: {event.artist}</div>
          <div className='collapseDetail'>Date: {formatDate(event.dateAndTime)}</div>
          <div className='collapseDetail'>Category: {event.category}</div>
          <div className='collapseDetail'>Duration: {event.duration}</div>
        </div>
      </Collapse>
        </div>
      ))}
    </>
  );
};

export default MySalesTicket;
