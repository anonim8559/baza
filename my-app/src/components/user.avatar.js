import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import PocketBase from 'pocketbase';
  import { useEffect, useState } from "react";
import { Login_form_dialog } from "./login_form_dialog";


  const pb = new PocketBase('http://172.16.15.163:8080');


  export function User_avatar() {
    const [user, setUser] = useState(null)

    useEffect(()=>{
        setUser(pb.authStore.model)
    },[])

    const login = async ()=>{
        setUser(pb.authStore.model)
    }

    const logout = ()=>{
        pb.authStore.clear();
        setUser(pb.authStore)
        setUser(null)

    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="w-20 h-20">
                    <AvatarImage src={user && pb.files.getUrl(user, user.avatar)} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>

                <DropdownMenuLabel>{user ? user.username : "Niezalogowany"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? 
                <DropdownMenuItem onClick={logout}>Wyloguj</DropdownMenuItem>
                :
                <DropdownMenuItem onClick={login} asChild>
                    <Login_form_dialog onLogin={login}/>
                </DropdownMenuItem>
                }
            </DropdownMenuContent>
        </DropdownMenu>


    )
  }