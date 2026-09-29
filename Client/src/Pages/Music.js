import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from '../Components/Card';
import Categories from '../Components/Categories';
import '../Components/EventDetails.css';
import { eventEndpoints } from '../services/api';
import axios from 'axios';
import { Music } from '../Components/CategoriesList';
import { Pagination } from 'react-bootstrap';

const MusicDetail = () => {
  const [musics, setMusic] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // To track selected music type
  // Inside your component:
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // adjust as needed


  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMusics = musics ? musics.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = musics ? Math.ceil(musics.length / itemsPerPage) : 0;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // optional UX nicety
  };

  // Reset to page 1 whenever the category/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [Music]); // or whatever triggers handleTypeChange

  const getPageNumbers = (currentPage, totalPages, siblingCount = 1) => {
  const totalPageNumbers = siblingCount * 2 + 5; // first, last, current, 2 siblings, 2 ellipses

  // If total pages is small, just show all of them
  if (totalPages <= totalPageNumbers) {
    return [...Array(totalPages)].map((_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const pages = [];

  pages.push(1); // always show first page

  if (shouldShowLeftDots) pages.push('...');

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== totalPages) pages.push(i);
  }

  if (shouldShowRightDots) pages.push('...');

  pages.push(totalPages); // always show last page

  return pages;
};

  useEffect(() => {
    // Function to fetch events based on category
    async function fetchEvents(type) {
      try {
        let response;
        if (type) {
          // Fetch events based on selected category
          response = await axios.get(`${eventEndpoints.GETALLMUSIC_API}?type=${type}`);
        } else {
          // Fetch all events by default
          response = await axios.get(eventEndpoints.GETALLMUSIC_API);
        }
  
        // Get current time
        const currentTime = new Date(); // Current time in milliseconds
  
        // Debug current time
        //console.log("Current Timestamp:", currentTime);
  
        // Filter events with valid date and time
        const validEvents = response.data.getAllEvents.filter(event => {
          //console.log("Event Date and Time :" , event.dateAndTime);
          const eventDateTime = new Date(event.dateAndTime); // Event time in milliseconds
          // Debug event time
          //console.log("Event Timestamp:", eventDateTime);
  
          return eventDateTime > currentTime; // Keep only future events
        });
  
        setMusic(validEvents); // Update state with filtered events
        //console.log("validEvents" , events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  
    fetchEvents(selectedType); // Call fetch with the selected category
  }, [selectedType]); // Re-fetch when category changes

  // Handler to update the selected music type
  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  return (
    <>
      <Categories categories={Music} handleTypeChange={handleTypeChange} />
        <Container className='eventContainer'>
          <Row>
            {currentMusics.map((music, index) => (
              <Col lg={3} md={4} sm={6} key={music._id || index}>
                <Card 
                  id={music._id}
                  title={music.title}
                  Img={music.imageUrl}
                  Location={music.location}
                  generalSeatPrice={music.generalSeatPrice}
                  category="music"
                />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4 custom-pagination">
              <Pagination.Prev 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1} 
              />

              {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                page === '...' ? (
                  <Pagination.Ellipsis key={`dots-${idx}`} disabled />
                ) : (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                )
              )}

              <Pagination.Next 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages} 
              />
            </Pagination>
          )}
        </Container>
    </>
  );
};

export default MusicDetail;
