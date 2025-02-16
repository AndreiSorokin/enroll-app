import { useParams } from 'react-router-dom';

export default function Master() {
   const { id } = useParams<{ id: string }>();


   return (
      <div>
         On this page you can set your availabitity time for procedures
      </div>
   )
}
