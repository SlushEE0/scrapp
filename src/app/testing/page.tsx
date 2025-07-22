import { execPocketbase } from "@/lib/pbaseServer";
import ActivityGraph from "../outreach/ActivityGraph";

export default async function Testing({}) {
  const res = await execPocketbase((pb) => {
    return pb.collection("users").getOne("wo294dln2thb20j");
  });

  return <p className="pt-30">{JSON.stringify(res)}</p>;
}
