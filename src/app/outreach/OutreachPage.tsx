"use client";

import { useEffect, useCallback } from "react";
import useSWRInfinite from "swr/infinite";

import { pb, recordToImageUrl } from "@/lib/pbaseClient";
import { useNavbar } from "@/hooks/useNavbar";
import type { t_pb_UserData } from "@/lib/types";
import { formatMinutes, OutreachTable } from "@/app/outreach/OutreachTable";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

const PAGE_SIZE = 20;

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
};

const fetcher = async (url: string): Promise<PaginatedResponse> => {
  const [, page] = url.split("?page=");
  const pageNum = parseInt(page) || 1;

  const response = await pb
    .collection("UserData")
    .getList<t_pb_UserData>(pageNum, PAGE_SIZE, {
      expand: "user",
      sort: "-updated"
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

export default function OutreachPage({ isAdmin = false, userData }: Props) {
  const { setDefaultShown } = useNavbar();

  const { data, error, size, setSize, isValidating, mutate } =
    useSWRInfinite<PaginatedResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    });

  useEffect(() => {
    setDefaultShown(false);
  }, [setDefaultShown]);

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

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        loadMore();
      }
    },
    [loadMore]
  );

  const handleUpdate = useCallback(() => {
    mutate();
  }, [mutate]);

  if (error) {
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
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
              <span className="text-primary-foreground">Outreach Hours: </span>
              {formatMinutes(userData?.outreachMinutes || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
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

      <OutreachTable
        allUsers={allUsers}
        isAdmin={isAdmin}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore || false}
        handleScroll={handleScroll}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
