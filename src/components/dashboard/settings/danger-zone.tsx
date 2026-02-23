"use client";

import { UserSettingsDTO } from "@/lib/dtos/user";
import InfoContainer from "./info-container";
import { Button } from "@/components/ui/button";
import { useTransition, useState } from "react";
import { cleanUserDataAction, deleteUserAccountAction } from "@/lib/actions/users";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Eraser } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";

interface Props {
  user: UserSettingsDTO;
}

export default function DangerZone({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  // Clean Data State
  const [cleanExpenses, setCleanExpenses] = useState(false);
  const [cleanSubscriptions, setCleanSubscriptions] = useState(false);
  const [cleanCategories, setCleanCategories] = useState(false);

  // Delete Account State
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleCleanData = () => {
    if (!cleanExpenses && !cleanSubscriptions && !cleanCategories) {
      toast.error("Please select at least one data type to clean.");
      return;
    }

    startTransition(async () => {
      const result = await cleanUserDataAction({
        expenses: cleanExpenses,
        subscriptions: cleanSubscriptions,
        categories: cleanCategories,
      });

      if (result.success) {
        toast.success(result.message);
        setCleanExpenses(false);
        setCleanSubscriptions(false);
        setCleanCategories(false);
      } else {
        toast.error(result.message || "Failed to clean data.");
      }
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }

    startTransition(async () => {
      const result = await deleteUserAccountAction();
      if (result.success) {
        toast.success(result.message);
        await signOut({ callbackUrl: "/" });
      } else {
        toast.error(result.message || "Failed to delete account.");
      }
    });
  };

  return (
    <InfoContainer title="Danger Zone" variant="destructive">
      <div className="space-y-6">
        
        {/* Clean Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-md font-medium flex items-center gap-2">
              <Eraser className="h-4 w-4 text-amber-500" /> Clean Data
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Selectively delete your expenses, subscriptions, or categories.
            </p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600 sm:w-auto w-full">
                Clean Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clean Your Data</AlertDialogTitle>
                <AlertDialogDescription>
                  Select the types of data you want to permanently delete. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clean-expenses" 
                    checked={cleanExpenses} 
                    onCheckedChange={(checked) => setCleanExpenses(checked === true)} 
                  />
                  <Label htmlFor="clean-expenses" className="cursor-pointer">Delete all expenses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clean-subscriptions" 
                    checked={cleanSubscriptions} 
                    onCheckedChange={(checked) => setCleanSubscriptions(checked === true)} 
                  />
                  <Label htmlFor="clean-subscriptions" className="cursor-pointer">Delete all subscriptions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clean-categories" 
                    checked={cleanCategories} 
                    onCheckedChange={(checked) => setCleanCategories(checked === true)} 
                  />
                  <Label htmlFor="clean-categories" className="cursor-pointer text-destructive">
                    Delete all categories (expenses and subscriptions will lose their category)
                  </Label>
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  variant="destructive"
                  onClick={(e) => {
                    if (!cleanExpenses && !cleanSubscriptions && !cleanCategories) {
                      e.preventDefault();
                      toast.error("Please select at least one item to clean.");
                    } else {
                      handleCleanData();
                    }
                  }} 
                  disabled={isPending || (!cleanExpenses && !cleanSubscriptions && !cleanCategories)}
                >
                  {isPending ? "Cleaning..." : "Clean Selected Data"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="h-px bg-border w-full" />

        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-md font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Delete Account
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="sm:w-auto w-full">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account ({user.email}) and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="py-4 space-y-2">
                <Label htmlFor="delete-confirmation" className="text-sm font-medium">
                  Please type <span className="font-bold select-none text-foreground">DELETE</span> to confirm.
                </Label>
                <Input 
                  id="delete-confirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="border-destructive/30 focus-visible:ring-destructive"
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  variant="destructive"
                  onClick={(e) => {
                    if (deleteConfirmation !== "DELETE") {
                      e.preventDefault();
                      toast.error("Please type DELETE exactly to confirm.");
                    } else {
                      handleDeleteAccount();
                    }
                  }} 
                  disabled={isPending || deleteConfirmation !== "DELETE"}
                >
                  {isPending ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

      </div>
    </InfoContainer>
  );
}
