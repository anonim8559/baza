import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { useState } from "react"
import PocketBase from 'pocketbase';
import { DialogClose } from "@radix-ui/react-dialog"
import Image from "next/image"

export function EditItem({item}) {
    const pb = new PocketBase('http://172.16.15.163:8080');
    const [dane,setdane] = useState({marka:item.marka,model:item.model,czas_parkowania:item.czas_parkowania})
    const [zdjecie,setzdjecie] = useState(null)
    const handleInputChange = (id,e) =>{
        setdane((prev)=>({
        ...prev,
        [id]: e.target.value
        }))}
        const handleZdjecie = (e)=>{
            console.log(e)
            setzdjecie(e.target.files[0])
          }
        const update = async () =>{
            const formData = new FormData()
  formData.append("marka",dane.marka)
  formData.append("model",dane.model)
  formData.append("czas_parkowania",dane.czas_parkowania)
  formData.append("zdjecie",zdjecie)
            const record = await pb.collection('samochody').update(item.id, FormData);
        }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Pencil/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <div className="mt-5 flex flex-col w-full items-center flex-wrap gap-5">
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="marka">Marka</Label>
      <Input DefultValue={item.marka} onChange= {(e)=>{handleInputChange("marka",e)}} type="text" id="marka" placeholder="Marka" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="model">Model</Label>
      <Input DefultValue={item.model} onChange= {(e)=>{handleInputChange("model",e)}} type="text" id="model" placeholder="Model" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="czas_parkowania">Czas parkowania</Label>
      <Input DefultValue={item.czas_parkowania} onChange= {(e)=>{handleInputChange("czas_parkowania",e)}} type="number" id="czas_parkowania" placeholder="Czas parkowania" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="zdjecie">Zdjecie</Label>
      <Input onChange= {(e)=>{handleZdjecie(e)}} type="file" id="zdjecie" placeholder="Zdjecie" />
      </div>
      </div>
        </div>
        <div>
            <Image 
            src={pb.files.getUrl(item,item.zdjecie)}
            alt={item.zdjecie}
            width={500}
            height={500}
            className="rounded-md"/>
        </div>
        <DialogFooter>
            <DialogClose asChild>          
                <Button onClick={update}>Save changes</Button>
                </DialogClose>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
