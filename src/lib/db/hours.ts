import { pb } from "../pbaseClient";
import { BaseStates } from "../states";

let ManualHoursEventID = "";

export async function manualModifyOutreachHours(
  userId: string,
  deltaMinutes: number
) {
  if (!ManualHoursEventID) {
    try {
      const manualHoursEvent = await pb
        .collection("OutreachEvents")
        .getFirstListItem(`name="ManualHours"`);

      if (!manualHoursEvent) {
        return BaseStates.ERROR;
      }

      ManualHoursEventID = manualHoursEvent.id;
    } catch {
      return BaseStates.ERROR;
    }
  }

  try {
    const currentManualAddition = await pb
      .collection("OutreachSessions")
      .getFirstListItem(`event="${ManualHoursEventID}"&&user="${userId}"`);

    await pb.collection("OutreachSessions").update(currentManualAddition.id, {
      minutes: currentManualAddition.minutes + deltaMinutes
    });
  } catch {
    try {
      await pb.collection("OutreachSessions").create({
        event: ManualHoursEventID,
        user: userId,
        minutes: deltaMinutes
      });
    } catch {
      return BaseStates.ERROR;
    }
  }
  return BaseStates.SUCCESS;
}
