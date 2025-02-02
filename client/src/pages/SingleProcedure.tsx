import { useParams } from "react-router-dom";
import { RootState, useGetMastersByProcedureQuery } from '../redux';
import { Box, Button } from "@mui/material";
import { useSelector } from "react-redux";
import BookingModal from "../components/BookingModal";
import { useState } from "react";

const SingleProcedure = () => {
   const { id } = useParams<{ id:string }>();
   const userData = useSelector((state: RootState) => state.user.userData);
   const { data } = useGetMastersByProcedureQuery(id!);
   const [open, setOpen] = useState(false);
   const [selectedMaster, setSelectedMaster] = useState(null);

   console.log('data: ',data)
   console.log('userData: ', userData)

   const handleOpen = (master) => {
      setSelectedMaster(master);
      setOpen(true);
   };

   return (
      <Box>
         <BookingModal 
            open={open} 
            setOpen={setOpen} 
            selectedMaster={selectedMaster} 
            userData={userData} 
         />
         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Masters for the procedure:</Box>
         <ul>
            {data?.map((master) => (
               <div key={master.id}>
                  <li>Master: {master.name}</li>
                  <li>Price: {master.masterProcedures[0].price}$</li>
                  <img style={{width:50, height:50}} src={master.image!}></img>
                  {userData?.role === "user" && 
                  (
                     <Button
                        size="small"
                        variant="outlined"
                        sx={{
                           color: 'white', border: '2px solid #000', 
                           padding: { xs: '5px 10px', sm: '8px 15px' },
                           margin: '20px 0 40px 0',
                           backgroundColor: '#230248',
                           '&:hover': {
                              borderColor: '#5F2E2E'
                           }
                        }}
                        onClick={() => handleOpen(master)}
                     >
                        Book
                     </Button>
                  )}
               </div>
            ))}
         </ul>
      </Box>
   )
}

export default SingleProcedure
