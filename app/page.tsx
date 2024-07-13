"use client"
import { getLocationFromPincode } from "@/utils/getLocationFromPincode";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";

import { useEffect, useState } from "react";

export default function Home() {
  const [AnonAadhaar] = useAnonAadhaar()
  const [data, setData] = useState<any>({})
  
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
       
          <LogInWithAnonAadhaar fieldsToReveal={["revealGender","revealAgeAbove18","revealPinCode","revealState"]}  nullifierSeed={1234} />

            <p>{AnonAadhaar.status}</p>
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
    </main>
  );
}
