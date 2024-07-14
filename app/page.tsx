"use client"
import { getLocationFromPincode } from "@/utils/getLocationFromPincode";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import { useEffect, useState } from "react";
import IPFSUploader from "./components/FileUploader";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [AnonAadhaar] = useAnonAadhaar()
  const [data, setData] = useState<any>({})
  const [walletAddress, setWalletAddress] = useState<string>("")
  
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const setLocation = async(pincode:string) => {
    let location = await getLocationFromPincode(pincode);
    setData((prev:any)=>({...prev, location}));
  }
  
  useEffect(() => {
    if(AnonAadhaar.status === "logged-in"){
      let parsedData = JSON.parse(AnonAadhaar.anonAadhaarProofs[0].pcd).proof;
      setData(parsedData)
      setLocation(parsedData.pincode);
    }
  }, [AnonAadhaar])
  
  return (
    <main className="bg-white text-black flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative">
        <p className="font-pacifico text-9xl text-center text-pink-400">Hello</p>
        <p className="text-center text-xl my-5">Finding your match, Anonymously</p>
        <div className="border p-10">
          <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 w-full rounded">
            Connect Wallet
          </button>
          <p className="mt-4">Wallet Address: {walletAddress ? walletAddress : "Not Connected"}</p>
          {
            walletAddress &&
            <>
              <p className="mt-10 font-medium">Link your Aadhaar to proceed</p>
              <div>
                <LogInWithAnonAadhaar 
                  fieldsToReveal={["revealGender","revealAgeAbove18","revealPinCode","revealState"]}  
                  nullifierSeed={1234}  
                  signal={walletAddress}
                  useTestAadhaar={true}
                />
              </div>
            </>
          }
          <p className="mt-5">Aadhaar Status: {AnonAadhaar.status}</p>
          {
            AnonAadhaar.status === "logged-in" &&
            <ul className="border p-10 mt-10">
              <li>Location: {data.location}</li>
              <li>Above 18: {data.ageAbove18 == 1 ? "Yes" : "No"}</li>
              <li>Gender: {data.gender == 77 ? "Male" : "Female"}</li>
              <li>Pincode: {data.pincode}</li>
            </ul>
          } 
        </div>

        <IPFSUploader />
      </div>
    </main>
  );
}