export interface ILoginOTP {
  id: string;
  userId: string;
  otpCode: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

// Table name: 'login_otps'

// Create a new OTP record
export async function createLoginOtp(supabase: any, otp: Omit<ILoginOTP, 'id' | 'createdAt'>): Promise<ILoginOTP> {
  const { data, error } = await supabase
    .from('login_otps')
    .insert([otp])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return {
    id: data.id,
    userId: data.userId,
    otpCode: data.otpCode,
    expiresAt: data.expiresAt,
    used: data.used,
    createdAt: data.createdAt,
  };
}

// Find OTP record for user by otpCode, only unused and not expired
export async function findLoginOtp(supabase: any, userId: string, otpCode: string): Promise<ILoginOTP | null> {
  const { data, error } = await supabase
    .from('login_otps')
    .select('*')
    .eq('userId', userId)
    .eq('otpCode', otpCode)
    .eq('used', false)
    .gt('expiresAt', new Date().toISOString())
    .order('createdAt', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    userId: data.userId,
    otpCode: data.otpCode,
    expiresAt: data.expiresAt,
    used: data.used,
    createdAt: data.createdAt,
  };
}

// Mark OTP as used by id
export async function markLoginOtpUsed(supabase: any, otpId: string): Promise<void> {
  const { error } = await supabase
    .from('login_otps')
    .update({ used: true })
    .eq('id', otpId);

  if (error) {
    throw error;
  }
}
