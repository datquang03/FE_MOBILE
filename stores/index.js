import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Authentication/authSlice";
import customerReducer from "../features/Customer/customerSlice";
import uploadReducer from "../features/Upload/uploadSlice";
import studioReducer from "../features/Studio/studioSlice";
import equipmentReducer from "../features/Equipment/equipmentSlice";
import serviceReducer from "../features/Service/serviceSlice";
import commentReducer from "../features/Comment/commentSlice";
import promotionReducer from "../features/Promotion/promotionSlice";
import bookingReducer from "../features/Booking/bookingSlice";
import setDesignReducer from "../features/SetDesign/setDesignSlice";
import notificationReducer from "../features/Notification/notificationSlice";
import searchReducer from "../features/Search/searchSlice";
import transactionReducer from "../features/Transaction/transactionSlice";
import messageReducer from "../features/Message/messageSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    upload: uploadReducer,
    studio: studioReducer,
    equipment: equipmentReducer,
    service: serviceReducer,
    comment: commentReducer,
    promotion: promotionReducer,
    booking: bookingReducer,
    setDesign: setDesignReducer,
    notification: notificationReducer,
    search: searchReducer,
    transaction: transactionReducer,
    message: messageReducer,
  },
});

export { createBooking } from "../features/Booking/bookingSlice";
export default store;

