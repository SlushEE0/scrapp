import PocketBase, { type RecordModel } from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "";
export const pb = new PocketBase(PB_URL);

export function recordToImageUrl(record: RecordModel) {
  // http://localhost:8090/api/files/_pb_users_auth_/wo294dln2thb20j/acg8oc_iftxu_ws7gd_vnoflsg_r9_cqe_yn_ki2u_bae_zzweq_el_szf_xu_wzs_ae_s96_c_k0quuutwh8_s3s7sus0rh.png

  if (!record || !record.id) return null;

  const fileUrl = new URL(
    `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.avatar}`
  );

  return fileUrl;
}
