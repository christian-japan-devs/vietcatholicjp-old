import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'

const Verify: NextPage = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSendVerifying, setIsSendVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('is verifying');
  const [notiOpen, setNotiOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(!isSendVerifying){
      (
        async () => {
            try {
                let headers = {
                  'Content-Type': 'application/json',
                };
                let url_string = window.location.href;
                let url = new URL(url_string);
                let secretCode = url.searchParams.get('code');
                const response = await fetch('http://localhost:8000/api/auth/signup/verify/?code='+secretCode, {
                  method: 'get',
                    headers: headers,
                    credentials: 'include',
                });
                if(response.ok){
                  const content = await response.json();
                  console.log(content);
                  setIsVerifying(true);
                  setMessage('Your account is verified');
                  await router.push('/auth/login');
                }else{
                  setMessage('Your account cannot be verified');
                }
            } catch (e) {
                setIsVerifying(false);
                setMessage('System error!');
            }
            setIsSendVerifying(true);
        }
    )();
    }else{
      setMessage('Your account is verified');
    }
  });
  
  return (
    <Layout auth={false} notification={{open:notiOpen, message:message,setOpen:setNotiOpen}}/>
  )
}

export default Verify