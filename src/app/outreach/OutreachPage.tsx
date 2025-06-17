"use client";

import { useEffect, useCallback } from "react";
import useSWRInfinite from "swr/infinite";

import { pb, recordToImageUrl } from "@/lib/pbaseClient";
import { useNavbar } from "@/hooks/useNavbar";
import type { t_pb_UserData } from "@/lib/types";
import { OutreachTable } from "@/app/outreach/OutreachTable";
import { formatMinutes } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

const PAGE_SIZE = 15;

interface PaginatedResponse {
  items: t_pb_UserData[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

type Props = {
  isAdmin?: boolean;
  userData?: t_pb_UserData;
  outreachMinutesCutoff: number;
};

const fetcher = async (url: string): Promise<PaginatedResponse> => {
  const [, page] = url.split("?page=");
  const pageNum = parseInt(page) || 1;

  const response = await pb
    .collection("UserData")
    .getList<t_pb_UserData>(pageNum, PAGE_SIZE, {
      expand: "user"
    });

  return response;
};

const getKey = (
  pageIndex: number,
  previousPageData: PaginatedResponse | null
) => {
  if (previousPageData && !previousPageData.items.length) return null;
  return `?page=${pageIndex + 1}`;
};

export default function OutreachPage({
  isAdmin = false,
  userData,
  outreachMinutesCutoff
}: Props) {
  const { setDefaultShown } = useNavbar();

  const { data, error, size, setSize, isValidating, mutate } =
    useSWRInfinite<PaginatedResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    });

  useEffect(() => {
    setDefaultShown(false);
  }, [setDefaultShown]);

  useEffect(() => {
    loadMore();
  });

  const allUsers = data ? data.flatMap((page) => page.items) : [];
  const totalItems = data?.[0]?.totalItems || 0;
  const hasMore = allUsers.length < totalItems;
  const isLoading = !data && !error;
  const isLoadingMore = isValidating && data && data.length > 0;

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setSize(size + 1);
    }
  }, [hasMore, isLoadingMore, setSize, size]);

  const handleUpdate = useCallback(() => {
    mutate();
  }, [mutate]);

  if (error) {
    console.error("Error loading outreach data:", error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Data
          </h2>
          <p className="text-muted-foreground">
            Failed to load outreach data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen flex flex-col pt-3">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Outreach Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Manage and view user outreach data"
            : "View outreach data"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4 mb-4 flex-shrink-0">
        <Card className="w-max px-2">
          <CardHeader className="pb-0 mb-0">
            <section className="flex gap-5">
              <Avatar className="h-11 w-11">
                <AvatarImage
                  src={recordToImageUrl(userData?.expand?.user)?.toString()}
                  alt={userData?.expand?.user.name}
                  className="rounded-full"
                />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs rounded-full flex items-center justify-center h-full w-full">
                  {userData?.expand?.user.name.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="">
                <p>{userData?.expand?.user.name || "Unknown User"}</p>
                <p className="block text-sm text-muted-foreground">
                  {userData?.expand?.user.email || "No email"}{" "}
                </p>
              </div>
            </section>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-primary">
              <span className="text-foreground">Outreach Hours: </span>
              {formatMinutes(userData?.outreachMinutes || 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Outreach Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                allUsers.reduce((sum, user) => sum + user.outreachMinutes, 0) /
                  60
              )}
              h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Container - Takes remaining space */}
      <div className="flex-1 min-h-0">
        <OutreachTable
          allUsers={allUsers}
          isAdmin={isAdmin}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore || false}
          onUpdate={handleUpdate}
          outreachMinutesCutoff={outreachMinutesCutoff}
        />
      </div>
    </div>
  );
}
