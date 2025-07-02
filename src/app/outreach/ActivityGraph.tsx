"use client";

import React, { useState, useEffect, use, act } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

const MONTHS = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12
} as Record<string, number>;

const DATES = [
  // August 2024 - 3 dates (fewer)
  "2024-08-05T14:20:00Z",
  "2024-08-18T09:15:00Z",
  "2024-08-29T16:45:00Z",

  // September 2024 - 6 dates (more)
  "2024-09-03T11:30:00Z",
  "2024-09-08T08:00:00Z",
  "2024-09-14T13:45:00Z",
  "2024-09-20T17:20:00Z",
  "2024-09-25T10:10:00Z",
  "2024-09-30T15:35:00Z",

  // October 2024 - 2 dates (fewer)
  "2024-10-12T12:00:00Z",
  "2024-10-27T18:30:00Z",

  // November 2024 - 7 dates (more)
  "2024-11-02T07:45:00Z",
  "2024-11-06T14:15:00Z",
  "2024-11-11T09:30:00Z",
  "2024-11-16T16:00:00Z",
  "2024-11-21T11:45:00Z",
  "2024-11-26T13:20:00Z",
  "2024-11-30T19:10:00Z",

  // December 2024 - 4 dates (moderate)
  "2024-12-07T10:25:00Z",
  "2024-12-15T15:40:00Z",
  "2024-12-22T08:55:00Z",
  "2024-12-31T23:59:00Z",

  // January 2025 - 8 dates (most)
  "2025-01-03T06:30:00Z",
  "2025-01-07T12:15:00Z",
  "2025-01-12T09:45:00Z",
  "2025-01-16T14:30:00Z",
  "2025-01-20T11:20:00Z",
  "2025-01-24T16:45:00Z",
  "2025-01-28T13:10:00Z",
  "2025-01-31T17:55:00Z",

  // February 2025 - 3 dates (fewer)
  "2025-02-08T10:00:00Z",
  "2025-02-18T14:25:00Z",
  "2025-02-26T16:40:00Z",

  // March 2025 - 5 dates (moderate)
  "2025-03-05T09:20:00Z",
  "2025-03-12T12:35:00Z",
  "2025-03-18T15:50:00Z",
  "2025-03-25T11:15:00Z",
  "2025-03-30T18:05:00Z"
];

interface ActivityDataPoint {
  month: string;
  year: number;
  events: number;
}

interface OutreachActivityGraphProps {
  id: string;
}

export default function ActivityGraph({ id }: OutreachActivityGraphProps) {
  const [timestamps, setTimestamps] = useState<string[]>();
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setTimestamps(DATES);
    }, 50);
  }, [id, setTimestamps]);

  useEffect(() => {
    if (!timestamps || timestamps.length === 0) return;
    let tempActivityData: { [key: string]: number } = {};

    timestamps.forEach((timestamp) => {
      const date = new Date(timestamp);

      const year = date.getFullYear();
      const month = date.toLocaleString("en-US", {
        month: "short"
      });

      const key = `${year} ${month}`;

      tempActivityData[key] = tempActivityData[key]
        ? tempActivityData[key] + 1
        : 1;
    });

    let formattedData = Object.entries(tempActivityData).map(
      ([key, events]) => {
        const [year, month] = key.split(" ");
        return {
          month,
          year: parseInt(year),
          events
        };
      }
    );

    //sort by year and month
    formattedData.sort((a, b) => {
      if (a.year === b.year) {
        return MONTHS[a.month] - MONTHS[b.month];
      }
      return a.year - b.year;
    });

    setActivityData(formattedData);
  }, [timestamps, setActivityData]);

  const totalSessions = timestamps?.length || 0;
  const avgSessionsPerMonth = activityData.length
    ? (
        activityData.reduce((acc, curr) => acc + curr.events, 0) /
        activityData.length
      ).toFixed(1)
    : 0;
  const peakMonth = activityData.length
    ? activityData.toSorted((a, b) => b.events - a.events)[0].month
    : "?";
  const GraphDot = function () {
    return <div></div>;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
          <div className="space-y-1">
            <p className="text-sm font-medium text-card-foreground">
              {data.month} {data.year}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">{data.events}</span>
              {data.events === 1 ? "event" : "events"}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="size-full flex flex-col bg-transparent">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-1">Activity Timeline</h3>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={activityData}>
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="events"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="transparent"
            activeDot={{ r: 2, stroke: "var(--primary)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-200 pt-4 mt-4">
        <div>
          <div className="text-lg font-bol">{totalSessions}</div>
          <div className="text-xs">Total Sessions</div>
        </div>
        <div>
          <div className="text-lg font-bol">{avgSessionsPerMonth}</div>
          <div className="text-xs">Avg/Month</div>
        </div>
        <div>
          <div className="text-lg font-bol">{peakMonth}</div>
          <div className="text-xs">Peak Month</div>
        </div>
      </div>
    </div>
  );
}
