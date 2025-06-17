"use client";

import { useState } from "react";
import { pb, recordToImageUrl } from "@/lib/pbaseClient";
import type { t_pb_UserData } from "@/lib/types";
import { formatPbDate } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type OutreachTableProps = {
  allUsers: t_pb_UserData[];
  isAdmin: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onUpdate: () => void;
};

// Helper functions
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function EditUserDialog({ userData }: { userData: t_pb_UserData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    outreachMinutes: userData.outreachMinutes,
    lastOutreachEvent: userData.lastOutreachEvent
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pb.collection("userData").update(userData.id, formData);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outreachMinutes">Outreach Minutes</Label>
            <Input
              id="outreachMinutes"
              type="number"
              value={formData.outreachMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  outreachMinutes: parseInt(e.target.value) || 0
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastOutreachEvent">Last Outreach Event</Label>
            <Input
              id="lastOutreachEvent"
              value={formData.lastOutreachEvent}
              onChange={(e) =>
                setFormData({ ...formData, lastOutreachEvent: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Main OutreachTable component
export function OutreachTable({
  allUsers,
  isAdmin,
  isLoading,
  isLoadingMore
}: OutreachTableProps) {
  return (
    <ScrollArea className="h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Outreach Hours</TableHead>
            <TableHead>Last Outreach Event</TableHead>
            {isAdmin && <TableHead>Manage</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading...
                </div>
              </TableCell>
            </TableRow>
          ) : allUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-8">
                No user data found
              </TableCell>
            </TableRow>
          ) : (
            allUsers.map((userData) => (
              <TableRow key={userData.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={recordToImageUrl(
                          userData.expand?.user
                        )?.toString()}
                        alt={userData.expand?.user.name}
                        className="rounded-full"
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs rounded-full flex items-center justify-center h-full w-full">
                        {userData.expand?.user.name.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {userData.expand?.user?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userData.expand?.user?.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatMinutes(userData.outreachMinutes)}</TableCell>
                <TableCell>
                  {formatPbDate(userData.lastOutreachEvent) || "N/A"}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <EditUserDialog userData={userData} />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
          {isLoadingMore && (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading more...
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
