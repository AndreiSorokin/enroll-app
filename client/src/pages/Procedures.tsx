import { Link } from 'react-router-dom';
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
      <div>
         <ul>
            {data.map((procedure:Procedure )=> (
               <li key={procedure.id}>
                  <Link to={`/procedures/${procedure.id}`}>{procedure.name}</Link>
               </li>
            ))}
         </ul>
      </div>
)
}

export default Procedures
