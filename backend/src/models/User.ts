export interface IUser {
  id: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: string;
}

// Supabase table name: 'users'
// Note: Passwords must be hashed before saving.

export async function createUser(supabase: any, user: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email: user.email, password: user.password, phone: user.phone }])
    .select('*')
    .single();

  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    email: data.email,
    password: data.password,
    phone: data.phone,
    createdAt: data.created_at,
  };
}

export async function findUserByEmail(supabase: any, email: string): Promise<IUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // no rows found
      return null;
    }
    throw error;
  }
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    email: data.email,
    password: data.password,
    phone: data.phone,
    createdAt: data.created_at,
  };
}

