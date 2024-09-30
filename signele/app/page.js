"use client";
import LandingPage from "./landingpage";
import Dashboard from "./dashboard/page";
import { useAccount } from "wagmi";


export default function Home() {
  const account = useAccount();
  return <>{account.isConnected ? <Dashboard /> : <LandingPage />}</>;
}
