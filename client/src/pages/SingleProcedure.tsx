import { useParams, Link } from "react-router-dom";
import { useGetMastersByProcedureQuery } from '../redux';
import { Box, Button } from "@mui/material";

const SingleProcedure = () => {
   const { id } = useParams<{ id:string }>();
   const { data, error, isLoading } = useGetMastersByProcedureQuery(id!);

   if(error) {
      return <p>Error fetching procedure</p>;
   }
   
   if (isLoading) {
      return <p>Loading...</p>;
   }

   if(!data) {
      return <p>No procedure found</p>;
   }

console.log(data.map(d => d))

   return (
      <Box>
         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Masters for the procedure:</Box>
         <ul>
            {data.map((master) => (
               <div key={master.id}>
                  <li>{master.name}</li>
                  <li>{master.masterProcedures[0].price}$</li>
                  <img style={{width:50, height:50}} src={master.image!}></img>
                  <Button
                        size="small"
                        component={Link}
                        to={`/bookings`}
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
                     >
                        Book
                     </Button>
               </div>
            ))}
         </ul>
      </Box>
   )
}

export default SingleProcedure
