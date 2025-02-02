import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useState } from 'react'
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useAddUserProcedureMutation, useCreateBookingMutation, useGetAllAvailableTimeSlotsQuery } from "../redux";

const BookingModal = ({ data, userData, getAvailableTimeSlots, open, setOpen }) => {
   const { data: timeSlotData } = useGetAllAvailableTimeSlotsQuery();
   const [createBooking] = useCreateBookingMutation();
   const [selectedDate, setSelectedDate] = useState(null);
   const [availableSlots, setAvailableSlots] = useState([]);
   const [selectedSlot, setSelectedSlot] = useState("");
   const [selectedMaster, setSelectedMaster] = useState(null);

   const handleClose = () => {
      setOpen(false);
   };

   const handleDateChange = async (date) => {
      setSelectedDate(date);
      const formattedDate = dayjs(date).format("YYYY-MM-DD");

      try {
         const slots = await getAvailableTimeSlots(selectedMaster.id, formattedDate);
         setAvailableSlots(slots);
      } catch (error) {
         console.error("Error fetching time slots:", error);
      }
   };

   const handleBooking = async() => {
      if (!selectedSlot) return alert("Please select a time slot!");
      try {
         await createBooking({
            masterId: data[0].id,
            userId: userData?.id
         });
      } catch (error) {
         console.error('Error booking procedure:', error);
      }
   }

   return (
      <Modal open={open} onClose={handleClose}>
         <Box
            sx={{
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               width: 400,
               bgcolor: "background.paper",
               boxShadow: 24,
               p: 4,
               borderRadius: 2,
            }}
         >
            <Typography variant="h6">Book an Appointment</Typography>
            <Typography sx={{ mt: 2 }}>Master: {selectedMaster?.name}</Typography>

            {/* Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
               <DatePicker label="Select Date" value={selectedDate} onChange={handleDateChange} sx={{ width: "100%", mt: 2 }} />
            </LocalizationProvider>

            {/* Time Slot Selection */}
            <FormControl fullWidth sx={{ mt: 2 }}>
               <InputLabel>Select Time Slot</InputLabel>
               <Select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                  {availableSlots.length > 0 ? (
                     availableSlots.map((slot) => (
                        <MenuItem key={slot.id} value={slot.id}>
                           {dayjs(slot.startTime).format("hh:mm A")}
                        </MenuItem>
                     ))
                  ) : (
                     <MenuItem disabled>No available slots</MenuItem>
                  )}
               </Select>
            </FormControl>

            <Button fullWidth variant="contained" sx={{ mt: 3, bgcolor: "#230248" }} onClick={handleBooking} disabled={!selectedSlot}>
               Confirm Booking
            </Button>
         </Box>
      </Modal>
   );
}

export default BookingModal
