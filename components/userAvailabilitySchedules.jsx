import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default () => {
  const location = useLocation().search;
  const user = new URLSearchParams(location).get('user');
  const [schedule, setSchedule] = useState([]);

  const fetchData = async () => {
    const result = await fetch(`/api/user_availability_schedules?user=${user}`).then((res) => res.json())

    setSchedule(result.availabilitySchedules)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='testing2'>
        <p >{schedule?.length && JSON.stringify(schedule)}</p>
    </div>
  )
};
