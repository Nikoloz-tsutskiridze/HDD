import supabase, { supabaseUrl } from "./supabase";

export async function signUp({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatars: "",
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatars }) {
  let updateDate;
  if (password) updateDate = { password };
  if (fullName) updateDate = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateDate);

  if (error) throw new Error(error.message);
  if (!avatars) return data;

  const fileName = `avatars-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatars);

  if (storageError) {
    console.error("Storage Error:", storageError);
    throw new Error(storageError.message);
  }

  const { data: updatedUser, error: errorUpdateAvatars } =
    await supabase.auth.updateUser({
      data: {
        avatars: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
        fullName,
      },
    });

  if (errorUpdateAvatars) throw new Error(errorUpdateAvatars.message);

  return updatedUser;
}
