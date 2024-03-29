import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/globals.css";
// import nprogress css
import "nprogress/nprogress.css";

import { useEffect } from "react";
import React from "react";
import { GuildSidebar } from "../components/Dashboard/Sidebar/Sidebar";
import { useRouter } from "next/router";
import { NotificationsManager } from "../components/Notifications/NotificationManager";
import { HiddenColorLoader } from "../components/HiddenColorLoader";
import { ProgressBar } from "../components/ProgressBar";
import { useNProgress } from "../utils/nprogress";
import { GlobalSidebar } from "../components/Dashboard/Sidebar/GlobalSidebar";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useNProgress();
  useEffect(() => {
    if (!globalThis.navigator) return;
    // FaceAI.getInstance().init();
  }, []);
  return (
    <>
      <Head>
        <title>Dazai</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* <link rel="icon" href="/volant.svg" /> */}
      </Head>
      <ProgressBar />
      <div className={`w-full min-h-screen flex flex-row bg-gray-850`}>
        <HiddenColorLoader />
        <NotificationsManager />
        {router.query.guild && (
          <GuildSidebar guildID={router.query.guild as string} />
        )}
        {router.pathname.startsWith("/app/@global") && <GlobalSidebar />}
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
