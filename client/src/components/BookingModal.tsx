import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material";
import React, { useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { skipToken } from "@reduxjs/toolkit/query";

import { useAddUserProcedureMutation, useCreateBookingMutation, useGetAllAvailableTimeSlotsQuery } from "../redux";

const BookingModal = ({ data, userData, open, setOpen, selectedMaster, token }) => {
   const [createBooking] = useCreateBookingMutation();
   const [addUserProcedure] = useAddUserProcedureMutation();
   const [selectedDate, setSelectedDate] = useState(null);
   const [selectedSlot, setSelectedSlot] = useState("");


   const { data: timeSlotData, isLoading } = useGetAllAvailableTimeSlotsQuery(
      selectedMaster && selectedDate
         ? { 
               masterId: selectedMaster.id, 
               procedureId: data?.[0]?.id, 
               date: dayjs(selectedDate).format("YYYY-MM-DD") 
            }   
         : skipToken
   );

   console.log("selectedMaster: ", selectedMaster)
   console.log("Fetched timeSlotData:", timeSlotData);
   console.log("API Query Params:", {
      masterId: selectedMaster?.id,
      procedureId: data?.[0]?.id,
      date: dayjs(selectedDate).format("YYYY-MM-DD"),
   });
   const formattedDate = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null;
   console.log("Formatted Date:", formattedDate);



   const handleClose = () => {
      setOpen(false);
   };

   const handleBooking = async () => {
      if (!selectedSlot) return alert("Please select a time slot!");

      try {
         await createBooking({
            userId: userData?.id,
            timeSlotId: selectedSlot,
            token: token,
         });

         await addUserProcedure({
            userId: userData?.id,
            procedureId: data[0].id,
            masterId: selectedMaster.id,
            token: token,
         });

         alert("Booking successful!");
         handleClose();
      } catch (error) {
         console.error("Error booking procedure:", error);
         alert("Booking failed!");
      }
   };

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

            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
               <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  sx={{ width: "100%", mt: 2 }}
               />
            </LocalizationProvider>

            
            <FormControl fullWidth sx={{ mt: 2 }}>
               <InputLabel>Select Time Slot</InputLabel>
               <Select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                  {isLoading ? (
                     <MenuItem disabled>Loading...</MenuItem>
                  ) : timeSlotData?.length > 0 ? (
                     timeSlotData.map((slot) => (
                        <MenuItem key={slot.id} value={slot.id}>
                           {dayjs(slot.startTime).format("hh:mm A")}
                        </MenuItem>
                     ))
                  ) : (
                     <MenuItem disabled>No available slots</MenuItem>
                  )}
               </Select>
            </FormControl>

            <Button
               fullWidth
               variant="contained"
               sx={{ mt: 3, bgcolor: "#230248" }}
               onClick={handleBooking}
               disabled={!selectedSlot}
            >
               Confirm Booking
            </Button>
         </Box>
      </Modal>
   );
};

export default BookingModal;
