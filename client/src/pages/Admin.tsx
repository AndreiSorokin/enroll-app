import { Box, Button } from "@mui/material";
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from "../redux";

const Admin = () => {
   const { data, refetch } = useGetAllUsersQuery();
   const [toggleUserStatus] = useUpdateUserStatusMutation();

   const handleToggleUserStatus = async (id: string, active: boolean) => {
      await toggleUserStatus({ id, active: !active });
      refetch();
   }
   
   return (
      <Box>
         {data?.map(user=> (
            <ul key={user.id}>
               <li>
                  <Box>Name: {user.name}</Box>
                  <Box>Email: {user.email}</Box>
                  <Box>Role: {user.role}</Box>
                  {
                     user.active
                     ? <Button onClick={() => {handleToggleUserStatus(user.id, user.active)}}>Ban user</Button>
                     : <Button onClick={() => {handleToggleUserStatus(user.id, user.active)}}>Unban user</Button>
                  }
               </li>
            </ul>
         ))}
      </Box>
   )
}

export default Admin
