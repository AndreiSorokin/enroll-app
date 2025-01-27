import { useParams } from "react-router-dom";
import { useGetMastersByProcedureQuery } from '../redux';

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
      <div>
         <ul>
            {data.map((master) => (
               <div key={master.id}>
                  <li>{master.name}</li>
                  <img src={master.image!}></img>
               </div>
            ))}
         </ul>
      </div>
   )
}

export default SingleProcedure
