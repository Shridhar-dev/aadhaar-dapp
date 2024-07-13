export const getLocationFromPincode = async(pincode:string) =>{
    const rawData = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data:any = await rawData.json()

    return data[0].PostOffice[0].Region
}