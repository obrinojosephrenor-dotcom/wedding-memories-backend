const supabase = require("../config/supabase");

async function getGuestById(id) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

async function savePhoto(photo) {
  const { data, error } = await supabase
    .from("photos")
    .insert([photo])
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function incrementUploadCount(guestId) {
  const guest = await getGuestById(guestId);

  if (!guest) {
    throw new Error("Guest not found");
  }

  const { data, error } = await supabase
    .from("guests")
    .update({
      upload_count: (guest.upload_count || 0) + 1,
    })
    .eq("id", guestId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  getGuestById,
  savePhoto,
  incrementUploadCount,
};