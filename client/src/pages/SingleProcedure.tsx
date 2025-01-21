import { useParams } from "react-router-dom";
import { useGetSingleProcedureQuery } from '../redux';

const SingleProcedure = () => {
   const { id } = useParams<{ id:string }>();
   const { data, error, isLoading } = useGetSingleProcedureQuery(id!);

   if(error) {
      return <p>Error fetching procedure</p>;
   }
   
   if (isLoading) {
      return <p>Loading...</p>;
   }

   if(!data) {
      return <p>No procedure found</p>;
   }



   return (
      <div>
         Name: {data.name}
      </div>
   )
}

export default SingleProcedure
