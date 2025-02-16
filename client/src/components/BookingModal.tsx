import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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

   const procedureId = selectedMaster?.masterProcedures?.find(
      (p) => p.masterId === selectedMaster?.id
   )?.procedureId;

   const { data: timeSlotData, isLoading, error, refetch: refetchTimeSlots } = useGetAllAvailableTimeSlotsQuery(
      selectedMaster && selectedDate
         ? { 
               masterId: selectedMaster.id, 
               procedureId: procedureId,
               date: dayjs(selectedDate).format("YYYY-MM-DD")
            }   
         : skipToken,
         { refetchOnMountOrArgChange: true }
   );

   const handleClose = () => {
      setOpen(false);
   };

   const handleBooking = async () => {
      if (!selectedSlot) return alert("Please select a time slot!");
      console.log("Selected slot before booking:", selectedSlot);

      const today = dayjs().startOf("day");
      const chosenDate = dayjs(selectedDate).startOf("day");

      if (chosenDate.isBefore(today)) {
         alert("Cannot book a past date!");
         return;
      }

      try {
         await addUserProcedure({
            userId: userData?.id,
            procedureId: procedureId,
            masterId: selectedMaster.id,
            token: token,
         });
         
         await createBooking({
            userId: userData?.id,
            timeSlotId: selectedSlot,
            token: token,
         });

         alert("Booking successful!");
         refetchTimeSlots();
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
                  onChange={(date) => {
                     console.log("Date selected:", date);
                     setSelectedDate(date)}
                  }
                  disablePast
                  sx={{ width: "100%", mt: 2 }}
               />
            </LocalizationProvider>

            
            <FormControl fullWidth sx={{ mt: 2 }}>
               <InputLabel>Select Time Slot</InputLabel>
               <Select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                  {isLoading ? (
                     <MenuItem disabled>Loading...</MenuItem>
                  ) : timeSlotData?.length > 0 ? (
                     timeSlotData
                        .filter((slot) => {
                           const now = dayjs();
                           const slotDate = dayjs(selectedDate).startOf("day");
                           const slotTime = dayjs(slot.startTime, "HH:mm:ss");
                        
                           if (slotDate.isSame(now, "day")) {
                              return slotTime.isAfter(now);
                           }
                        
                           return true;
                        })
                        .map((slot) => (
                           <MenuItem key={slot.id} value={slot.id}>
                              {dayjs(slot.startTime, "HH:mm:ss").format("hh:mm A")}
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
