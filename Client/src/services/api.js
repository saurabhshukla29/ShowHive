const BASE_URL=process.env.REACT_APP_BASE_URL;


export const endpoints = {
  SENDOTP_API: BASE_URL + "/sendotp",
  SIGNUP_API: BASE_URL + "/signup",
}

export const eventEndpoints = {
    GETALLEVENTS_API: BASE_URL + "/getEvents",
    CREATEEVENT_API: BASE_URL + "/events",
    GETALLMUSIC_API:BASE_URL+"/getMusic",
    GETALLPLAYS_API:BASE_URL+"/getPlays",
    GETALLSPORTS_API:BASE_URL+"/getSports",
    GETEVENTDETAILS_API:BASE_URL+"/getEventDetails",
    GETUSERALLSALES_API:BASE_URL+"/mySales",
    GETUSERBOOKEDTICKETS_API:BASE_URL+"/bookedTickets",
    CANCELEVENTBYUSER_API : BASE_URL + "/cancelEventByUser"
}

export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile"
}

export const userEndpoints = {
  EVENT_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  EVENT_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}





