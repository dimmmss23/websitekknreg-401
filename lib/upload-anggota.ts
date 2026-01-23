import { supabase } from "@/lib/supabase";

export async function uploadAnggotaImage(file: File, folder: string = "Anggota") {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("anggota")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) return null;

  const { data: urlData } = supabase.storage.from("anggota").getPublicUrl(filePath);
  return urlData?.publicUrl ?? null;
}
