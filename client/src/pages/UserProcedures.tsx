import { Box } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetUserProcedureQuery } from '../redux';

const UserProcedures = () => {
   const { id } = useParams<{ id:string }>();
   const { data } = useGetUserProcedureQuery(id!);

   if(!data) {
      return <Box>You don't have enrollments yet</Box>
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
               </li>
            ))}
         </ul>
      </Box>
   )
}

export default UserProcedures
