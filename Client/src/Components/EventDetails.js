import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from './Card';
import './EventDetails.css'
const EventDetails = () => {
  return (
    
    <div className='eventContainer'>
      <Row class ='eventContainer-row'>
        <Col lg={3} md={4} sm={6}><Card/></Col>
        <Col lg={3} md={4} sm={6}><Card/></Col>
        <Col lg={3} md={4} sm={6}><Card/></Col>
        <Col lg={3} md={4} sm={6}><Card/></Col>
        <Col lg={3} md={4} sm={6}><Card/></Col>
      </Row>
    </div>
    
  )
}

export default EventDetails