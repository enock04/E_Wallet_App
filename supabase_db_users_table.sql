-- Updated SQL script to fix missing 'password' column issue for 'users' table


DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    phone text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX idx_users_email ON public.users(email);
