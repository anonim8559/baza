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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://172.16.15.163:8080');

export function DeleteItem({ id, ondeleted }) {
  const del = async () => {
    console.log("Attempting to delete item with ID:", id);
    try {
      await pb.collection('gry').delete(id);
      console.log("Deletion successful");
      if (ondeleted) ondeleted(id);  
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Deleting this car record will remove it permanently from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={del}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
