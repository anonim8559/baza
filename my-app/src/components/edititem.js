import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useState } from "react";
import PocketBase from 'pocketbase';
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

export function EditItem({ item, onupdated }) {
  const pb = new PocketBase('http://172.16.15.163:8080');
  const [dane, setDane] = useState({
    nazwa: item.nazwa,
    opis: item.opis,
    cena: item.cena,
    dostepnosc: item.dostepnosc
  });
  const [zdjecie, setZdjecie] = useState(null);

  const handleInputChange = (id, e) => {
    const value = id === "dostepnosc" ? e.target.checked : e.target.value;
    setDane((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleZdjecie = (e) => {
    setZdjecie(e.target.files[0]);
  };

  const update = async () => {
    const formData = new FormData();
    formData.append("nazwa", dane.nazwa);
    formData.append("opis", dane.opis);
    formData.append("cena", dane.cena);
    formData.append("dostepnosc", dane.dostepnosc);

    if (zdjecie) formData.append("zdjecie", zdjecie);

    try {
      const updatedRecord = await pb.collection('gry').update(item.id, formData);
      if (onupdated) onupdated(updatedRecord);
    } catch (err) {
      console.log("Error updating record:", err);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><Pencil /></Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetTitle>Edit Game</SheetTitle>
        <SheetDescription>Update game details and click save.</SheetDescription>
        
        <div className="grid gap-4 py-4">
          <div className="mt-5 flex flex-col w-full items-center flex-wrap gap-5">
            <Label htmlFor="nazwa">Nazwa</Label>
            <Input value={dane.nazwa} onChange={(e) => handleInputChange("nazwa", e)} type="text" id="nazwa" placeholder="Nazwa gry" />
            
            <Label htmlFor="opis">Opis</Label>
            <Input value={dane.opis} onChange={(e) => handleInputChange("opis", e)} type="text" id="opis" placeholder="Opis gry" />
            
            <Label htmlFor="cena">Cena</Label>
            <Input value={dane.cena} onChange={(e) => handleInputChange("cena", e)} type="number" id="cena" placeholder="Cena gry" />
            
            <Label htmlFor="dostepnosc">Dostępność</Label>
            <Switch
                    checked={dane.dostepnosc}
                    onCheckedChange={(checked) => handleInputChange("dostepnosc", { target: { checked } })}
                  />
            
            <Label htmlFor="zdjecie">Zdjęcie</Label>
            <Input onChange={handleZdjecie} type="file" id="zdjecie" placeholder="Zdjęcie gry" />
          </div>
        </div>
        
       
        <div>
          <Image src={pb.files.getUrl(item, item.zdjecie)} alt={item.zdjecie} width={500} height={500} className="rounded-md" />
        </div>

        <SheetFooter>
          <Button onClick={update}>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
