"use client"
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { init, prove, InitArgs, artifactUrls, ArtifactsOrigin, generateArgs } from "@anon-aadhaar/core";
import { certificate } from '../utils/certificate';

const anonAadhaarInitArgs: InitArgs = {
  wasmURL: artifactUrls.v2.wasm,
  zkeyURL: artifactUrls.v2.zkey,
  vkeyURL: artifactUrls.v2.vk,
  artifactsOrigin:ArtifactsOrigin.local
};

export default function Home() {
  const [AnonAadhaar] = useAnonAadhaar()
  const [data, setData] = useState<any>({})

  
  
  useEffect(() => {
    console.log('Country Identity status: ', AnonAadhaar.status)
    if(AnonAadhaar.status === "logged-in"){
      setData(JSON.parse(AnonAadhaar.anonAadhaarProofs[0].pcd).proof)
      console.log(JSON.parse(AnonAadhaar.anonAadhaarProofs[0].pcd))
    }
  }, [AnonAadhaar])
  
  return (
    <main className="bg-white text-black flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative">
       
          <LogInWithAnonAadhaar fieldsToReveal={["revealGender","revealAgeAbove18","revealPinCode","revealState"]}  nullifierSeed={1234} />

            <p>{AnonAadhaar.status}</p>
            {
              AnonAadhaar.status === "logged-in" &&
              <ul className="border p-10 mt-10">
                <li>State: {data.state}</li>
                <li>Above 18: {data.ageAbove18 == 1 ? "Yes" : "No"}</li>
                <li>Gender: {data.gender == 77 ? "Male" : "Female"}</li>
                <li>Pincode: {data.pincode}</li>
              </ul>
            } 
      </div>
    </main>
  );
}
