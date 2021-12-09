import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/dist/client/router";

const Register: NextPage = () => {
  const [message, setMessage] = useState("");
  const [auth, setAuth] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/auth/users/me",
          {
            credentials: "same-origin"
          }
        );

        const content = await response.json();
        if(response.ok){
          setMessage(`Hi ${content.first_name} ${content.profile_address}`);
          setAuth(true);
        }else{
          router.push("/auth/login");
          setAuth(false);
        }
      } catch (e) {
        router.push("/auth/login");
        setAuth(false);
      }
    })();
  });

  return (
    <Layout auth={auth} notification={{open:notiOpen, message:message,setOpen:setNotiOpen}}>
      <div>{message}</div>
    </Layout>
  );
};

export default Register;
