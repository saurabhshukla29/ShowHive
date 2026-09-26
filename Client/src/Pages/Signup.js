import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OtpInput from 'react-otp-input';  // Correct import
import "bootstrap-icons/font/bootstrap-icons.css";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import './Signup.css';
import axios from 'axios';
import { endpoints } from '../services/api'; // Adjust this path after moving api files to src
import { apiConnector } from '../services/apiConnector'; // Adjust this path after moving api files to src
import { setLoading, setToken } from '../Slices/authSlice';
import { useDispatch } from "react-redux"
import { setUser } from '../Slices/profileSlice';

function EmailModal(props) {
    const { email, setEmail, onNext } = props;  // Receive email and setter from parent
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (e) => {
        const emailInput = e.target.value;
        setEmail(emailInput);

        // Simple regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(emailInput));
    };

    const sendOtp = async () => {
        if (isEmailValid) {
            setIsLoading(true);
            try {
                const response = await axios.post(`${endpoints.SENDOTP_API}`, { email });
                if (response.data.success) {  // Check if OTP sent successfully
                    setIsLoading(false);
                    onNext();  // Show OTP Modal
                } else {
                    console.error("OTP sending failed", response.data.message);
                }
            } catch (error) {
                setIsLoading(false);
                console.error("Error sending OTP:", error);
            }
        }
    };

    return (
        <Modal {...props} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title>Enter Your Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder="name@example.com"
                            value={email}
                            onChange={validateEmail}
                        />
                    </div>
                    <Button 
                        variant="primary" 
                        onClick={sendOtp} 
                        disabled={!isEmailValid || isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Continue'}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}

function OtpModal({ email, ...props }) {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');  // Error state
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const onhandleSubmit = async (e) => {
        e.preventDefault();
        try {
            //console.log('email ',email);
            //console.log('otp ',otp);
            const response = await axios.post(`${endpoints.SIGNUP_API}`, { email, otp });
            
            if (!response.data.success) {
                throw new Error(response.data.message)
              }
            
              dispatch(setToken(response.data.token))
            //   const userImage = response.data?.user?.image
            //     ? response.data.user.image
            //     : `https://api.dicebear.com/5.x/initials/svg?seed=AB`
            //   dispatch(setUser({ ...response.data.user, image: userImage }))

              const userImage = response.data?.user?.image
                ? response.data.user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=Anonymous&USER`
              dispatch(setUser({ ...response.data.user, image: userImage }))
              //console.log('response ',response.data)
              localStorage.setItem("token", JSON.stringify(response.data.token))
              localStorage.setItem("user", JSON.stringify(response.data.user))
              localStorage.setItem("tokenExpirationTime", JSON.stringify(Date.now()+7 * 24 * 60 * 60 * 1000))
            if (response.data.success) {
                props.setOtpModalShow(false);  // Close OTP modal on success
                navigate("/");  // Navigate to homepage on success
            } else {
                setError("OTP verification failed");  // Set error message
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 403) {
                setError("The OTP doesn't match or the email is incorrect");  // Set error from server
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Error during OTP submission:", error);
        }
    };

    const handleChange = (otp) => {
        setOtp(otp);
    };

    return (
        <Modal {...props} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title>Enter OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <OtpInput
                    value={otp}
                    onChange={handleChange}
                    numInputs={6}
                    separator={<span>-</span>}
                    inputStyle={{
                        width: '2rem',
                        height: '2rem',
                        margin: '0 0.5rem',
                        fontSize: '1.5rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0,0,0,0.3)',
                    }}
                    renderInput={(props) => <input {...props} />}
                />
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}  {/* Display error message */}
                <div className="mt-3">
                    <Button variant="success" onClick={onhandleSubmit}>Submit</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

function MyVerticallyCenteredModal(props) {
    return (
        <Modal {...props} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Get Started</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-grid gap-6">
                    <Button variant="light" size="lg" style={{ position: 'relative' }}>
                        <span className='modal-icon'><FcGoogle /></span>
                        <span style={{ display: 'block', width: '100%', fontSize: '16px' }}>Continue With Google</span>
                    </Button>
                </div>
                <div className="d-grid gap-6">
                    <Button variant="light" size="lg" style={{ position: 'relative' }} onClick={props.onEmailClick}>
                        <span className='modal-icon'><AiOutlineMail /></span>
                        <span className='modal-text'>Continue With Email</span>
                    </Button>
                </div>
                <div className="d-grid gap-6">
                    <Button variant="light" size="lg" style={{ position: 'relative' }}>
                        <span className='modal-icon-facebook'><FaFacebook /></span>
                        <span className='modal-text'>Continue With Facebook</span>
                    </Button>
                </div>
                <div className='modal-para'>
                    <p>I agree to the Terms & Conditions & Privacy Policy</p>
                </div>
            </Modal.Body>
        </Modal>
    );
}

const Signup = () => {
    const [modalShow, setModalShow] = useState(false);
    const [emailModalShow, setEmailModalShow] = useState(false);
    const [otpModalShow, setOtpModalShow] = useState(false);
    const [email, setEmail] = useState('');  // Move email state to Signup component

    const handleEmailClick = () => {
        setModalShow(false);
        setEmailModalShow(true);
    };

    const handleOtpModal = () => {
        setEmailModalShow(false);
        setOtpModalShow(true);
    };

    const handleSubmit = (otp) => {
        setOtpModalShow(false);
        alert(`OTP Submitted: ${otp}`);
    };

    return (
        <>
            <Button className='btn-custom' variant="light" onClick={() => setEmailModalShow(true)}>
                Signup
            </Button>

            {/* <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                onEmailClick={handleEmailClick}
            /> */}

            <EmailModal
                show={emailModalShow}
                onHide={() => setEmailModalShow(false)}
                onNext={handleOtpModal}
                email={email}  // Pass email as prop
                setEmail={setEmail}  // Pass setEmail as prop
            />

<OtpModal
    show={otpModalShow}
    onHide={() => setOtpModalShow(false)}
    email={email}
    setOtpModalShow={setOtpModalShow}  // Pass this as a prop
    onSubmit={handleSubmit}
/>

        </>
    );
}

export default Signup;
