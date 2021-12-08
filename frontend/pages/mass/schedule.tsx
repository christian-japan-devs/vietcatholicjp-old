import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axiosInstance from '../../domain/util/axios'

const Schedule: NextPage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    (
      async () => {
        try {
          axiosInstance.get('api/users/me').then((res)=>{
            const allRegister = res.data;
            console.log(allRegister);
          });
          
        } catch (e){
          console.log(e);
        }
      }
    )();
  });

  return (
    <Layout>{message}</Layout>
  )
}

export default Schedule
