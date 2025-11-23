-- PostgreSQL schema for E_Wallet_App Supabase backend

-- Users table
DROP TABLE IF EXISTS public.users;
CREATE TABLE public.users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE UNIQUE INDEX idx_users_email ON public.users(email);

-- Login OTP table
DROP TABLE IF EXISTS public.login_otp;
CREATE TABLE public.login_otp (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  otp_code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_login_otp_user_id ON public.login_otp(user_id);

-- Cards table
DROP TABLE IF EXISTS public.cards;
CREATE TABLE public.cards (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  card_number text NOT NULL,
  card_holder text NOT NULL,
  expiry_date text NOT NULL,
  cvv text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transactions table
DROP TABLE IF EXISTS public.transactions;
CREATE TABLE public.transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  card_id uuid REFERENCES public.cards(id) ON DELETE SET NULL,
  amount numeric(12, 2) NOT NULL,
  transaction_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text NOT NULL,
  description text
);

-- Payments table
DROP TABLE IF EXISTS public.payments;
CREATE TABLE public.payments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  amount numeric(12, 2) NOT NULL,
  payment_method text NOT NULL,
  payment_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text NOT NULL
);

-- Verification Records table
DROP TABLE IF EXISTS public.verification_records;
CREATE TABLE public.verification_records (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  verification_type text NOT NULL,
  verification_code text NOT NULL,
  is_verified boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes and constraints as needed for performance
