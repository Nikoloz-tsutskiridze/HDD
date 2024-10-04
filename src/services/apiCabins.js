import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error("Error loading cabins from Supabase:", error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //https://wannxungntczlafglvyu.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  //https://wannxungntczlafglvyu.supabase.co

  // 1. CREATE/EDIT CABIN
  let query = supabase.from("cabins");

  // A) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B)EDIT
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created");
  }
  // UPLOAD IMAGE
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // DELETE CABIN IF THERE IS AN ERROR ABOUT IMAGE
  if (storageError) {
    await supabase.from("Cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Cabin image counld not be uploaded");
  }

  return data;
}

export async function deleteCabin(id) {
  // First delete related bookings
  const { error: bookingError } = await supabase
    .from("bookings")
    .delete()
    .eq("cabinId", id);

  if (bookingError) {
    console.error("Error deleting bookings:", bookingError.message);
    throw new Error(`Bookings could not be deleted: ${bookingError.message}`);
  }

  // Now delete the cabin
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error("Error deleting cabin:", error.message);
    throw new Error(`Cabin could not be deleted: ${error.message}`);
  }

  return data;
}
