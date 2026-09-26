import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import './Card.css';
const CardComp = ({id,title,Img,Location,generalSeatPrice,category}) => {
  const navigate = useNavigate();  // React Router hook for navigation
  //console.log('gen seat price ',generalSeatPrice);
  const handleCardClick = () => {
    // Navigate to the detailed event page
    navigate(`/${category}/${id}`);
  };
  return (
    <div>
        <Card className='cards' onClick={handleCardClick}>
        <Card.Img variant="top" src={Img} />
        </Card>
        <div className='card-text'>
            <div className="card-title">{title}</div>
            <div className="card-location">{Location}</div>
            <div className="card-price">Rs {generalSeatPrice}</div>
        </div>
    </div>
  )
}

export default CardComp;