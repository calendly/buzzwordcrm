import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default () => {
    const location = useLocation().search;
    const user = new URLSearchParams(location).get('user');
    const [busyTimes, setBusyTimes] = useState([]);

    const fetchData = async () => {
        const result = await fetch(`/api/user_busy_times?user=${user}&start_time=2022-05-02T20:30:00.000000Z&end_time=2022-05-09T20:30:00.000000Z`).then((res) => res.json());

        setBusyTimes(result.busyTimes)
    }

   useEffect(() => {
    fetchData();
   }, []);

   return (
    <div className='testing'>
        <p>{busyTimes?.length && JSON.stringify(busyTimes)}</p>
    </div>
//     <div className='container'>
//         <div className='user-availability'>
//             {busyTimes && busyTimes.length? (
//                 <div className='row'>
//                     <table className='striped centered'>
//                         <thead>
//                             <tr>

//                             </tr>
//                         </thead>
//                     </table>
//                 </div>
//             )}
//         </div>
//     </div>
    )
}
