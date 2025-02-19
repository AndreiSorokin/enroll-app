import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CssBaseline } from '@mui/material'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast, ToastContainer } from 'react-toastify';

import { useAddMasterProcedureMutation, useCreateTimeSlotsMutation, useDeleteMasterProcedureMutation, useGetAllMasterProceduresQuery, useUpdateMasterProcedureMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { createMasterProcedureSchema, updateMasterProcedureSchema } from "../schemas/schemas";

const MasterProcedures = () => {
   const { id } = useParams<{ id: string }>();
   const { data, refetch } = useGetAllMasterProceduresQuery(id!);
   const [createTimeSlots] = useCreateTimeSlotsMutation();
   const [updateMasterProcedure] = useUpdateMasterProcedureMutation();
   const [createMasterProcedure] = useAddMasterProcedureMutation();
   const [deleteMasterProcedure] = useDeleteMasterProcedureMutation();

   const [procedureId, setProcedureId] = useState("");
   const [date, setDate] = useState<Dayjs | null>(null);
   const [startTime, setStartTime] = useState<Dayjs | null>(null);
   const [endTime, setEndTime] = useState<Dayjs | null>(null);
   const [slotDuration, setSlotDuration] = useState<number>(30);
   const [priceDialogOpen, setPriceDialogOpen] = useState(false);
   const [createProcedureDialogOpen, setCreateProcedureDialogOpen] = useState(false);
   
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
         toast.success("Time slots created successfully");
      } catch (error) {
         console.error("Error creating time slots:", error);
      }
   };

   const handleUpdateMasterProcedure = async () => {
      if (!updateValues.price || updateValues.price <= 0) {
         alert("Please enter a valid price.");
         return;
      }

      try {
         await updateMasterProcedure({
            masterId: id!,
            procedureId,
            price: Number(updateValues.price),
         }).unwrap();
         refetch();
         toast.success("Price has been updated successfully");
         setPriceDialogOpen(false);
      } catch (error) {
         console.error("Error updating price:", error);
      }
   };

   const {
      values: updateValues,
      errors: updateErrors,
      touched: updateTouched,
      handleChange: updateHandleChange,
      handleBlur: updateHandleBlur,
      handleSubmit: updateHandleSubmit
   } = useInput(
      updateMasterProcedureSchema,
      { price: "" },
      handleUpdateMasterProcedure
   );

   const handleCreateMasterProcedure = async () => {
      try {
         await createMasterProcedure({
            masterId: id!,
            procedureName: createValues.procedureName,
            price: Number(createValues.price),
            duration: Number(createValues.duration),
         }).unwrap();
         toast.success("New procedure has been created successfully");
         refetch();
         setCreateProcedureDialogOpen(false);
      } catch {
         toast.error("Error creating procedure");
      }
   };
   
   const {
      values: createValues,
      errors: createErrors,
      touched: createTouched,
      handleChange: createHandleChange,
      handleBlur: createHandleBlur,
      handleSubmit: createHandleSubmit
   } = useInput(
      createMasterProcedureSchema,
      { procedureName: "", price: 0, duration: 0 },
      handleCreateMasterProcedure
   );

   const handleDeleteMasterProcedure = async(procedureId: string) => {
      console.log({
         masterId: id!,
         procedureId,
      })
      try {
         await deleteMasterProcedure({
            masterId: id!,
            procedureId,
         }).unwrap();
         toast.success("Procedure has been deleted successfully");
         refetch();
      } catch {
         toast.error("Error deleting procedure");
      }
   }

   return (
      <Box>
         <ToastContainer/>
         <CssBaseline />
         <p>Set time when you are available</p>
         <p>Your procedures:</p>
         {data?.map(procedure => (
            <ul key={procedure.id}>
               <li>Name: {procedure.procedure.name}</li>
               <li>Price: {procedure.price}$</li>
               <Button onClick={() => setProcedureId(procedure.procedure.id)}>Set time</Button>
               <Button onClick={() => { 
                  setProcedureId(procedure.procedure.id);
                  setPriceDialogOpen(true); 
               }}>Change price</Button>
               <Button onClick={() => handleDeleteMasterProcedure(procedure.procedure.id)}>Delete procedure</Button>
            </ul>
         ))}
         <Button onClick={() => setCreateProcedureDialogOpen(true)}>Add new procedure</Button>

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
                  value={updateValues.price}
                  onChange={updateHandleChange}
                  onBlur={updateHandleBlur}
                  error={updateTouched.procedurePrice && Boolean(updateErrors.procedurePrice)}
                  helperText={updateTouched.procedurePrice ? updateErrors.procedurePrice : ""}
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setPriceDialogOpen(false)}>Cancel</Button>
               <Button onClick={updateHandleSubmit} color="primary">Update</Button>
            </DialogActions>
         </Dialog>
         <Dialog open={createProcedureDialogOpen} onClose={() => setCreateProcedureDialogOpen(false)}>
            <DialogTitle>Create Procedure</DialogTitle>
            <DialogContent>
               <TextField
                  label="Procedure Name"
                  name="procedureName"
                  value={createValues.procedureName}
                  onChange={createHandleChange}
                  onBlur={createHandleBlur}
                  error={createTouched.procedureName && Boolean(createErrors.procedureName)}
                  helperText={createTouched.procedureName ? createErrors.procedureName : ""}
                  fullWidth
                  margin="dense"
               />
               <TextField
                  label="Price ($)"
                  name="price"
                  type="number"
                  value={createValues.price}
                  onChange={createHandleChange}
                  onBlur={createHandleBlur}
                  error={createTouched.price && Boolean(createErrors.price)}
                  helperText={createTouched.price ? createErrors.price : ""}
                  fullWidth
                  margin="dense"
               />
               <TextField
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={createValues.duration}
                  onChange={createHandleChange}
                  onBlur={createHandleBlur}
                  error={createTouched.duration && Boolean(createErrors.duration)}
                  helperText={createTouched.duration ? createErrors.duration : ""}
                  fullWidth
                  margin="dense"
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setCreateProcedureDialogOpen(false)}>Cancel</Button>
               <Button onClick={createHandleSubmit} color="primary" variant="contained">
                  Create
               </Button>
            </DialogActions>
         </Dialog>

      </Box>
   )
}

export default MasterProcedures
