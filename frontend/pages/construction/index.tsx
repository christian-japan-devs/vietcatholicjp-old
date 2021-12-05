import React, { useState } from "react";
import type { NextPage } from 'next'
import { LatestPastoralLetterCard } from "../../components/LatestPastoralLetterCard";
import { container } from "tsyringe";
import { Locale } from "../../domain/models/Locale";
import Layout from "../../components/Layout";


const Construction: NextPage = () => {
  const [notiOpen, setNotiOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <Layout auth={false} notification={{ open: notiOpen, message: message, setOpen: setNotiOpen }}>
      <div>
        <LatestPastoralLetterCard
          repository={container.resolve("PastoralLetterRepository")}
          locale={Locale.VIETNAMESE}
        />
        <LatestPastoralLetterCard
          repository={container.resolve("PastoralLetterRepository")}
          locale={Locale.VIETNAMESE}
        />
      </div>
  </Layout>
  )
}

export default Construction