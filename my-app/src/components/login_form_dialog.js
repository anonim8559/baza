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
import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const pb = new PocketBase('http://172.16.15.163:8080');

export function Login_form_dialog({onLogin}) {
    const [user, setUser] = useState(null)
    const [pass, setPass] = useState(null)
    const [error, setError] = useState(false)
    const [open, setOpen] = useState(false)


    useEffect(()=>{
        setError(false)
    },[open])

    const handleUser = (e)=>{
        setUser(e.target.value)
    }

    const handlePass = (e)=>{
        setPass(e.target.value)
    }

    const handleButton = async (e)=>{

        try{
            const authData = await pb.collection('users').authWithPassword(
                user,
                pass,
            )
        }catch(err){
            setError(true)
        }

        onLogin()
    }

  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        Zaloguj
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">


        <DialogHeader>
          <DialogTitle>Zaloguj się</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>




        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nazwa użytkownika
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={(e)=>{
                handleUser(e)
              }}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Hasło
            </Label>
            <Input
              id="username"
              type="password"
              className="col-span-3"
              onChange={(e)=>{
                handlePass(e)
              }}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col">
          <div className="flex flex-col w-full justify-center">
        {error && <p className="mt-2">Nie udało się zalogować</p>}
          <Button onClick={handleButton}>Zaloguj</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}