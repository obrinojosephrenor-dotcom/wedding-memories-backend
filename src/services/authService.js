const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");

async function findGuestByMobile(mobile) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("mobile", mobile)
    .single();

  if (error) return null;

  return data;
}

async function createGuest(guest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([guest])
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function updateLastLogin(id) {
  await supabase
    .from("guests")
    .update({
      last_login: new Date(),
    })
    .eq("id", id);
}

module.exports = {
  findGuestByMobile,
  createGuest,
  updateLastLogin,
};