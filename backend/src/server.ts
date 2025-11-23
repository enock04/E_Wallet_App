import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient';
import authRoutes from './routes/auth';
import cardsRoutes from './routes/cards';


const app = express();

// Enable CORS for frontend origin
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Test Supabase connection
async function testSupabaseConnection() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected, sample user data:', data);
  }
}

testSupabaseConnection();

app.use('/api/auth', authRoutes);
app.use('/api/cards', cardsRoutes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
