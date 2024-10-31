import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  import { Trash2 } from "lucide-react"
  import PocketBase from 'pocketbase';
  const pb = new PocketBase('http://172.16.15.163:8080');
  
  export function DeleteItem({id,ondeleted}) {

    const del = async () => {
        console.log(id)
        try{
            await pb.collection('samochody').delete(id);
            ondeleted(id)
        }catch(err){

        }
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline"> <Trash2/></Button>
         
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={del}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  