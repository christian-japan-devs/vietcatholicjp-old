import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axiosInstance from '../domain/util/axios'

const Home: NextPage = () => {
  const [notiOpen, setNotiOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  return (
    <Layout auth={false} notification={{open:notiOpen,message:message,setOpen:setNotiOpen}}>
      <div>
        Welcome
      </div>
      </Layout>
  )
}

export default Home
