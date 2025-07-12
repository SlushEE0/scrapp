"use client";

import { useEffect, useState } from "react";

import { pb, recordToImageUrl } from "@/lib/pbaseClient";
import type { t_pb_UserData } from "@/lib/types";
import { formatMinutes, formatPbDate, getBadgeStatusStyles } from "@/lib/utils";

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
import { Card, CardContent } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type OutreachTableProps = {
  allUsers: t_pb_UserData[];
  isAdmin: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  onUpdate: () => void;
  outreachMinutesCutoff: number;
  isMobile?: boolean;
};

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

const SortedTableHeads = [
  {
    key: "user",
    name: "User",
    info: "`(${allUsers.length})`",
    descending: "Z > A",
    ascending: "A > Z",
    noSort: "",
    isSortable: true
  },
  {
    key: "outreachMinutes",
    name: "Outreach Time",
    ascending: "Low > High",
    descending: "High > Low",
    noSort: "",
    isSortable: true
  },
  {
    key: "lastOutreachEvent",
    name: "Last Outreach Event",
    ascending: "Old > New",
    descending: "New > Old",
    noSort: "",
    isSortable: true
  }
];

// Main OutreachTable component
export function OutreachTable({
  allUsers,
  isAdmin,
  isLoading,
  isLoadingMore,
  outreachMinutesCutoff,
  isMobile = false
}: OutreachTableProps) {
  const [sortedUsers, setSortedUsers] = useState(allUsers);

  const [sortConfig, setSortConfig] = useState({
    key: "user",
    direction: "ascending"
  });

  useEffect(() => {
    const sortUsers = (users: t_pb_UserData[], config: typeof sortConfig) => {
      return [...users].sort((a, b) => {
        let aValue, bValue;

        switch (config.key) {
          case "user":
            aValue = a.expand?.user?.name || "";
            bValue = b.expand?.user?.name || "";
            break;
          case "outreachMinutes":
            aValue = a.outreachMinutes || 0;
            bValue = b.outreachMinutes || 0;
            break;
          case "lastOutreachEvent":
            aValue = new Date(a.lastOutreachEvent).getTime();
            bValue = new Date(b.lastOutreachEvent).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return config.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return config.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    };
    setSortedUsers(sortUsers(allUsers, sortConfig));
  }, [allUsers, sortConfig]);

  // Mobile Card Layout
  if (isMobile) {
    return (
      <ScrollArea className="h-full">
        <div className="space-y-3">
          {/* Sort Controls for Mobile */}
          <div className="flex gap-2 p-2 bg-muted/50 rounded-lg">
            <Button
              variant={sortConfig.key === "user" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => {
                setSortConfig((prev) => ({
                  key: "user",
                  direction:
                    prev.key === "user" && prev.direction === "ascending"
                      ? "descending"
                      : "ascending"
                }));
              }}>
              Name{" "}
              {sortConfig.key === "user" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </Button>
            <Button
              variant={
                sortConfig.key === "outreachMinutes" ? "default" : "outline"
              }
              size="sm"
              className="flex-1 text-xs"
              onClick={() => {
                setSortConfig((prev) => ({
                  key: "outreachMinutes",
                  direction:
                    prev.key === "outreachMinutes" &&
                    prev.direction === "ascending"
                      ? "descending"
                      : "ascending"
                }));
              }}>
              Time{" "}
              {sortConfig.key === "outreachMinutes" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </Button>
            <Button
              variant={
                sortConfig.key === "lastOutreachEvent" ? "default" : "outline"
              }
              size="sm"
              className="flex-1 text-xs"
              onClick={() => {
                setSortConfig((prev) => ({
                  key: "lastOutreachEvent",
                  direction:
                    prev.key === "lastOutreachEvent" &&
                    prev.direction === "ascending"
                      ? "descending"
                      : "ascending"
                }));
              }}>
              Date{" "}
              {sortConfig.key === "lastOutreachEvent" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Loading...
              </div>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="text-center py-8">No user data found</div>
          ) : (
            sortedUsers.map((userData) => (
              <Card key={userData.id} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="h-10 w-10 flex-shrink-0">
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
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {userData.expand?.user?.name || "Unknown"}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {userData.expand?.user?.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatPbDate(userData.lastOutreachEvent) || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge
                        className={`${getBadgeStatusStyles(
                          userData.outreachMinutes,
                          outreachMinutesCutoff,
                          outreachMinutesCutoff - 60 * 3
                        )} text-sm`}>
                        {formatMinutes(userData.outreachMinutes)}
                      </Badge>
                      {isAdmin && <EditUserDialog userData={userData} />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {isLoadingMore && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Loading more...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }

  // Desktop Table Layout
  return (
    <ScrollArea className="h-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {SortedTableHeads.map((head) => (
              <TableHead
                key={head.key}
                className="cursor-pointer relative"
                style={{
                  minWidth:
                    head.key === "user"
                      ? "300px"
                      : head.key === "outreachMinutes"
                      ? "150px"
                      : "200px"
                }}
                onClick={() => {
                  setSortConfig((prev) => {
                    const newDirection =
                      prev.key === head.key && prev.direction === "ascending"
                        ? "descending"
                        : "ascending";
                    return { key: head.key, direction: newDirection };
                  });
                }}>
                <div className="flex items-center justify-baseline gap-5">
                  <span>
                    {head.name}{" "}
                    <span className="text-muted-foreground">
                      {eval(head.info || "")}
                    </span>
                  </span>
                  <div className="w-20">
                    {sortConfig.key === head.key && (
                      <Badge className="text-xs">
                        {sortConfig.direction === "ascending"
                          ? head.ascending
                          : head.descending}
                      </Badge>
                    )}
                  </div>
                </div>
              </TableHead>
            ))}
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
            sortedUsers.map((userData) => (
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
                <TableCell>
                  <Badge
                    className={`${getBadgeStatusStyles(
                      userData.outreachMinutes,
                      outreachMinutesCutoff,
                      outreachMinutesCutoff - 60 * 3
                    )} text-md`}>
                    {formatMinutes(userData.outreachMinutes)}
                  </Badge>
                </TableCell>
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
