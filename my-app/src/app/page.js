"use client";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PocketBase from 'pocketbase';
import { DeleteItem } from "@/components/deleteitem";
import { EditItem } from "@/components/edititem";
import { Plus } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"; 
import { Switch } from "@/components/ui/switch";



const pb = new PocketBase('http://172.16.15.163:8080');

export default function Page() {
  const [gry, setGry] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dane, setDane] = useState({
    nazwa: '',
    opis: '',
    cena: '',
    dostepnosc: false,
  });
  const [zdjecie, setZdjecie] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const records = await pb.collection('gry').getFullList({ sort: '-created' });
        setGry(records);
        
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    getData();
  }, []);

  const handleInputChange = (id, e) => {
    const value = id === "dostepnosc" ? e.target.checked : e.target.value;
    setDane((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("nazwa", dane.nazwa);
    formData.append("opis", dane.opis);
    formData.append("cena", dane.cena);
    formData.append("dostepnosc", dane.dostepnosc);
    if (zdjecie) formData.append("zdjecie", zdjecie);

    try {
      const record = await pb.collection('gry').create(formData);
      setGry((prev) => [...prev, record]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleZdjecie = (e) => {
    setZdjecie(e.target.files[0]);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const deleted = (id) => {
    setGry((prev) => prev.filter((el) => el.id !== id));
  };

  const updated = (item) => {
    const index = gry.findIndex((g) => g.id === item.id);
    const updatedGry = [...gry];
    updatedGry[index] = item;
    setGry(updatedGry);
  };

  return (
    
    <div className="flex flex-wrap justify-center gap-10 py-10 bg-gray-100 min-h-screen">
     
      {gry && gry.length > 0 ? (
        gry.map((gra) => (
          <Card key={gra.id} className="w-[400px] h-[500px] flex flex-col bg-white ">
            <Image
              src={pb.files.getUrl(gra, gra.zdjecie)}
              alt={gra.zdjecie}
              width={500}
              height={500}
              className="rounded-t-lg mx-auto object-cover"
            />
            <CardTitle className="text-center text-xl font-semibold mt-4">{gra.nazwa}</CardTitle>
            <CardDescription className="text-center text-gray-600 mt-2">{gra.opis}</CardDescription>
            <CardContent className="flex-1 p-0">
            
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
              <div className="flex flex-col items-start">
                <DeleteItem id={gra.id} ondeleted={deleted} />
                <EditItem item={gra} onupdated={updated} />
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-800 font-semibold">Cena: {gra.cena} PLN</p>
                <Switch
                      id="dostepnosc"
                      checked={gra.dostepnosc}
                      onCheckedChange={(checked) => handleInputChange("dostepnosc", { target: { checked } })}
                      className="rounded-full"
                    />
              </div>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p className="text-xl text-gray-500">Brak danych do wyświetlenia.</p>
      )}

   
      

    
     
      <div className="flex justify-center w-[400px] h-[500px]">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full h-full text-6xl" onClick={() => setIsFormVisible(true)}>
              <Plus />
            </Button>
          </SheetTrigger>
        
          {isFormVisible && (
            <SheetContent className="flex flex-col gap-4">
              <SheetTitle className="text-center">Dodaj nową grę</SheetTitle>
              <SheetDescription className="text-center">Wypełnij formularz, aby dodać grę</SheetDescription>
              <div className="flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="nazwa">Nazwa</Label>
                  <Input onChange={(e) => handleInputChange("nazwa", e)} type="text" id="nazwa" placeholder="Nazwa gry" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="opis">Opis</Label>
                  <Input onChange={(e) => handleInputChange("opis", e)} type="text" id="opis" placeholder="Opis gry" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="cena">Cena</Label>
                  <Input onChange={(e) => handleInputChange("cena", e)} type="number" id="cena" placeholder="Cena gry" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="dostepnosc">Dostępność</Label>
                  <Switch
                    checked={dane.dostepnosc}
                    onCheckedChange={(checked) => handleInputChange("dostepnosc", { target: { checked } })}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="zdjecie">Zdjęcie</Label>
                  <Input onChange={handleZdjecie} type="file" id="zdjecie" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Button onClick={handleSubmit}>Dodaj</Button>
                </div>
              </div>
            </SheetContent>
          )}
        </Sheet>
      </div>
    </div>
  );
}