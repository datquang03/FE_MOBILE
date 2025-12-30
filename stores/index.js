import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Authentication/authSlice";
import customerReducer from "../features/Customer/customerSlice";
import uploadReducer from "../features/Upload/uploadSlice";
import studioReducer from "../features/Studio/studioSlice";
import equipmentReducer from "../features/Equipment/equipmentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    upload: uploadReducer,
    studio: studioReducer,
    equipment: equipmentReducer,
  },
  // middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export { createBooking } from "../features/Booking/bookingSlice";
export default store;

