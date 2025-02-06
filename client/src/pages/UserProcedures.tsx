import { Box, Button } from '@mui/material'
import { useParams } from 'react-router-dom';
import { useDeleteUserProcedureMutation, useGetUserProcedureQuery } from '../redux';
import { toast } from 'react-toastify';

const UserProcedures = () => {
   const { id } = useParams<{ id:string }>();
   const { data, refetch } = useGetUserProcedureQuery(id!);
   const [deleteUserProcedure] = useDeleteUserProcedureMutation();
   const token = localStorage.getItem("token");

   if(!data) {
      return <Box>You don't have enrollments yet</Box>
   }

   //TODO: set isAvailable true

   const handleDelete = async(userId: string, procedureId: string, masterId: string) => {
      try {
         await deleteUserProcedure({ userId, procedureId, masterId, token }).unwrap();
         await refetch();
         toast.success("Enrollment cancelled successfully");
      } catch (error) {
         toast.error("Error removing procedure", error);
      }
   }

   console.log(data)


   return (
      <Box>
         <h1>Your enrollments:</h1>
         <ul>
            {data.map((procedure) => (
               <li key={procedure.id}>
                  <p>Procedure: {procedure.Procedure.name}</p>
                  <p>Duration: {procedure.Procedure.duration}</p>
                  <p>Master: {procedure.Master.name}</p>
                  <Button onClick={() => handleDelete(procedure.userId, procedure.procedureId, procedure.Master.id)}>Cancel</Button>
               </li>
            ))}
         </ul>
      </Box>
   )
}

export default UserProcedures
