import type { t_pb_OutreachEvent, t_pb_OutreachSession } from "@/lib/types";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LogHoursDialog from "./LogHoursDialog";
import EventSessionsTable from "./EventSessionsTable";

interface EventDetailsProps {
  selectedEvent: t_pb_OutreachEvent | null;
  sessions: t_pb_OutreachSession[] | undefined;
  onHoursLogged: () => void;
  onSessionDeleted: () => void;
}

export default function EventDetails({
  selectedEvent,
  sessions,
  onHoursLogged,
  onSessionDeleted
}: EventDetailsProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {selectedEvent ? (
          <div className="space-y-6 flex flex-col flex-1">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {selectedEvent.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {sessions
                    ? `${sessions.reduce(
                        (sum, session) => sum + session.minutes,
                        0
                      )} minutes total`
                    : "Loading..."}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <LogHoursDialog
                event={selectedEvent}
                onHoursLogged={onHoursLogged}
              />
            </div>

            {sessions && (
              <EventSessionsTable
                event={selectedEvent}
                sessions={sessions}
                onSessionDeleted={onSessionDeleted}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select an event to view details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
