import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { useCreateTimeSlotsMutation, useGetAllMasterProceduresQuery, useUpdateMasterProcedureMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { updateMasterProcedureSchema } from "../schemas/schemas";

const MasterProcedures = () => {
   const { id } = useParams<{ id: string }>();
   const { data, refetch } = useGetAllMasterProceduresQuery(id!);
   const [createTimeSlots] = useCreateTimeSlotsMutation();
   const [updateMasterProcedure] = useUpdateMasterProcedureMutation();

   const [procedureId, setProcedureId] = useState("");
   const [date, setDate] = useState<Dayjs | null>(null);
   const [startTime, setStartTime] = useState<Dayjs | null>(null);
   const [endTime, setEndTime] = useState<Dayjs | null>(null);
   const [slotDuration, setSlotDuration] = useState<number>(30);
   const [priceDialogOpen, setPriceDialogOpen] = useState(false);
   const [newPrice, setNewPrice] = useState<number | "">("");
   
   const handleCreateTimeSlot = async () => {
      if (!procedureId || !date || !startTime || !endTime || slotDuration <= 0) {
         alert("Please provide all required details.");
         return;
      }

      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const formattedStartTime = dayjs(startTime).format("HH:mm:ss");
      const formattedEndTime = dayjs(endTime).format("HH:mm:ss");
      

      
      try {
         await createTimeSlots({
            masterId: id!,
            procedureId,
            date: formattedDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            slotDuration,
         });
         console.log("Time slots created successfully");
      } catch (error) {
         console.error("Error creating time slots:", error);
      }
   };

   const handleUpdateMasterProcedure = async () => {
      if (!values.price || values.price <= 0) {
         alert("Please enter a valid price.");
         return;
      }

      console.log(values.price)

      try {
         await updateMasterProcedure({
            masterId: id!,
            procedureId,
            price: Number(values.price),
         }).unwrap();
         refetch();
         setPriceDialogOpen(false);
      } catch (error) {
         console.error("Error updating price:", error);
      }
   };

   const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useInput(
      updateMasterProcedureSchema,
      { price: "" },
      handleUpdateMasterProcedure
   );

   return (
      <Box>
         <p>Set time when you are available</p>
         <p>Your procedures:</p>
         {data?.map(procedure => (
            <ul key={procedure.id}>
               <li>Name: {procedure.procedure.name}</li>
               <li>Price: {procedure.price}$</li>
               <Button onClick={() => setProcedureId(procedure.procedure.id)}>Set time</Button>
               <Button onClick={() => { setProcedureId(procedure.procedure.id); setPriceDialogOpen(true); }}>Change price</Button>
               <Button>Delete procedure</Button>
            </ul>
         ))}
         <Button>Add new procedure</Button>

         {procedureId && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
               <Box>
                  <h3>Create Time Slot</h3>
                  <DatePicker
                     label="Select Date"
                     value={date}
                     onChange={(newValue) => setDate(newValue)}
                     renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                  <TimePicker
                     label="Start Time"
                     value={startTime}
                     onChange={(newValue) => setStartTime(newValue)}
                     renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                  <TimePicker
                     label="End Time"
                     value={endTime}
                     onChange={(newValue) => setEndTime(newValue)}
                     renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                  <TextField
                     label="Slot Duration (minutes)"
                     type="number"
                     value={slotDuration}
                     onChange={(e) => setSlotDuration(Number(e.target.value))}
                     fullWidth
                  />
                  <Button onClick={handleCreateTimeSlot}>Submit</Button>
               </Box>
            </LocalizationProvider>
         )}
         <Dialog open={priceDialogOpen} onClose={() => setPriceDialogOpen(false)}>
            <DialogTitle>Update Price</DialogTitle>
            <DialogContent>
            <TextField
               label="New Price"
               type="number"
               fullWidth
               name="price"
               value={values.price}
               onChange={handleChange}
               onBlur={handleBlur}
               error={touched.procedurePrice && Boolean(errors.procedurePrice)}
               helperText={touched.procedurePrice ? errors.procedurePrice : ""}
            />



            </DialogContent>
            <DialogActions>
               <Button onClick={() => setPriceDialogOpen(false)}>Cancel</Button>
               <Button onClick={handleSubmit} color="primary">Update</Button>
            </DialogActions>
         </Dialog>
      </Box>
   )
}

export default MasterProcedures
