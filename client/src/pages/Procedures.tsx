import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Typography, Button, Grid, Box } from "@mui/material";

import { useGetAllProceduresQuery } from '../redux/index';
import { Procedure } from '../misc/types';

const Procedures = () => {
   const { data, error, isLoading } = useGetAllProceduresQuery();

   if(error) {
      return <p>Error fetching procedures</p>
   }

   if(isLoading) {
      return <p>Loading procedures...</p>
   }

   if(!data) {
      return <p>Loading procedures...</p>
   }
   
   return (
      <Grid container spacing={3} padding={2}>
         {data.map((procedure: Procedure) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={procedure.id}>
               <Card elevation={1}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CardContent>
                     <Typography variant="h4" component="div" gutterBottom>
                        {procedure.name}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                        Duration: {procedure.duration + " hour(s)"}
                     </Typography>
                  </CardContent>
                  <CardActions>
                     <Button
                        size="small"
                        component={Link}
                        to={`/procedures/${procedure.id}`}
                        variant="outlined"
                        sx={{
                           color: 'white', border: '2px solid #000', 
                           fontSize: { xs: '0.8rem', sm: '1rem' }, 
                           padding: { xs: '5px 10px', sm: '8px 15px' },
                           margin: '20px 0 40px 0',
                           backgroundColor: '#230248',
                           '&:hover': {
                              borderColor: '#5F2E2E'
                           }
                        }}
                     >
                        View Details
                     </Button>
                  </CardActions>
                  </Box>
               </Card>
            </Grid>
         ))}
      </Grid>
   )
}

export default Procedures
