import { Box, Button, TextField } from '@mui/material'
import { useParams } from 'react-router-dom';
import { useCreateTimeSlotsMutation, useGetAllMasterProceduresQuery } from '../redux';
import { useState } from 'react';

import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const MasterProcedures = () => {
   const { id } = useParams<{ id: string }>();
   const { data, isLoading, error } = useGetAllMasterProceduresQuery(id!);
   const [createTimeSlots] = useCreateTimeSlotsMutation();

   const [procedureId, setProcedureId] = useState("");
   const [date, setDate] = useState<Dayjs | null>(null);
   const [startTime, setStartTime] = useState<Dayjs | null>(null);
   const [endTime, setEndTime] = useState<Dayjs | null>(null);
   const [slotDuration, setSlotDuration] = useState<number>(30);
   
   if(isLoading) {
      return <p>Loading procedures...</p>
   }
   if(error) {
      return <p>Error fetching procedures</p>
   }
   if(!data) {
      return <p>No procedures found for this master</p>
   }
   
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

   return (
      <Box>
         <p>Set time when you are available</p>
         <p>Your procedures:</p>
         {data.map(procedure => (
            <ul key={procedure.id}>
               <li>Name: {procedure.procedure.name}</li>
               <li>Price: {procedure.price}$</li>
               <Button onClick={() => setProcedureId(procedure.procedure.id)}>Set time</Button>
               <Button>Change price</Button>
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
      </Box>
   )
}

export default MasterProcedures
