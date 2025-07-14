import { useState, useEffect } from "react";
import { toast } from "sonner";
import { pb } from "@/lib/pbaseClient";
import { formatMinutes } from "@/lib/utils";
import type { t_pb_OutreachEvent, t_pb_User } from "@/lib/types";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

interface LogHoursDialogProps {
  event: t_pb_OutreachEvent;
  onHoursLogged: () => void;
}

export default function LogHoursDialog({
  event,
  onHoursLogged
}: LogHoursDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<t_pb_User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [minutes, setMinutes] = useState<number>(0);

  // Fetch users when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const response = await pb.collection("users").getFullList<t_pb_User>({
        sort: "name"
      });
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || minutes <= 0) {
      toast.error("Please select a user and enter valid minutes");
      return;
    }

    setLoading(true);
    try {
      await pb.collection("OutreachSessions").create({
        user: selectedUser,
        event: event.id,
        minutes: minutes
      });

      toast.success("Hours logged successfully");
      setSelectedUser("");
      setMinutes(0);
      setOpen(false);
      onHoursLogged();
    } catch (error) {
      console.error("Error logging hours:", error);
      toast.error("Failed to log hours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Clock className="h-4 w-4 mr-2" />
          Log Hours
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Hours for {event.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={loading}>
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minutes">Minutes</Label>
            <Input
              id="minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              placeholder="Enter minutes"
              min="1"
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              {minutes > 0
                ? `${formatMinutes(minutes)}`
                : "Enter minutes above"}
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Logging..." : "Log Hours"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
