"use client"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import PocketBase from 'pocketbase'
import { Timer } from "lucide-react";
const pb = new PocketBase('http://172.16.15.163:8080')

export default function Page() {
  const [samochody,setsamochody] =useState(null)
  const [dane,setdane] = useState({marka:null,model:null,czas_parkowania:null})
  const [zdjecie,setzdjecie] =useState(null)

  useEffect(()=>{
    const getData = async()=>{
      try{
        const records = await pb.collection('samochody').getFullList({
          sort: '-created'
        })
        console.log(records)
        setsamochody(records)
      }catch(err){
        console.log(err)
      }
      finally{

      }
    }
    getData()
  },[])

const handleInputChange = (id,e) =>{
setdane((prev)=>({
...prev,
[id]: e.target.value
}))

}
const handleSubmit = async ()=>{
  const formData = new FormData()
  formData.append("marka",dane.marka)
  formData.append("model",dane.model)
  formData.append("czas_parkowania",dane.czas_parkowania)
  formData.append("zdjecie",dane.zdjecie)
 try{
  const record = await pb.collection('samochody').create(FormData)
  setsamochody((prev)=>([
    ...prev,
    record
  ]))
 }catch(err){

 }
}

const handleZdjecie = (e)=>{
  console.log(e)
  setzdjecie(e.target.files[0])
}

  return (
    <div>
      <div className="flex w-full justify-center flex-wrap gap-5">
      {
        samochody &&
        
        samochody.map((samochod)=>(
          

          
            <Card className="w-[400px]">
        <CardTitle>{samochod.marka}</CardTitle>
        <CardDescription>{samochod.model}</CardDescription>
        <CardContent className="m-0 p-0">
          <Image
          src={pb.files.getUrl(samochod,samochod.zdjecie)}
          alt={samochod.zdjecie}
          width={500}
          height={500}
          className="rounded-md"/>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end w-full mt-5">
            <Timer/> <p>czas parkowania:</p>
            {samochod.czas_parkowania}
          </div>
        </CardFooter>
      </Card>
          )
        )
      }
      </div>

      <div className="mt-5 flex flex-col w-full items-center flex-wrap gap-5">
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="marka">Marka</Label>
      <Input onChange= {(e)=>{handleInputChange("marka",e)}} type="text" id="marka" placeholder="Marka" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="model">Model</Label>
      <Input onChange= {(e)=>{handleInputChange("model",e)}} type="text" id="model" placeholder="Model" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="czas_parkowania">Czas parkowania</Label>
      <Input onChange= {(e)=>{handleInputChange("czas_parkowania",e)}} type="number" id="czas_parkowania" placeholder="Czas parkowania" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="zdjecie">Zdjecie</Label>
      <Input  onChange= {(e)=>{handleZdjecie(e)}} type="file" id="zdjecie" placeholder="Zdjecie" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Button onClick={handleSubmit} className="w-full">Dodaj</Button>
      </div>
    </div>
      {/* {
        samochody &&
      <Card className="w-[400px]">
        <CardTitle>{samochody[0].marka}</CardTitle>
        <CardDescription>{samochody[0].model}</CardDescription>
        <CardContent className="m-0 p-0">
          <Image
          src={pb.files.getUrl(samochody[0],samochody[0].zdjecie)}
          alt={samochody[0].zdjecie}
          width={500}
          height={500}
          className="rounded-md"/>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end w-full mt-5">
            <Timer/> <p>czas parkowania:</p>
            {samochody[0].czas_parkowania}
          </div>
        </CardFooter>
      </Card>
} */}
    </div>
  );
}