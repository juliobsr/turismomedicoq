import pg from 'pg';
import dotenv from 'dotenv';

// Cargamos tus variables de entorno locales
dotenv.config();

const connectionString = process.env.DATABASE_URI;

const pool = new pg.Pool({
  connectionString,
  // Si usas Neon localmente, requiere SSL
  ssl: connectionString.includes('neon') ? { rejectUnauthorized: false } : false
});

async function resetDatabase() {
  try {
    console.log('🧨 Iniciando borrado total del esquema local...');
    
    // Esto borra todas las tablas y recrea el entorno vacío
    await pool.query('DROP SCHEMA public CASCADE;');
    await pool.query('CREATE SCHEMA public;');
    
    console.log('✅ Base de datos local completamente limpia.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    process.exit(1);
  }
}

resetDatabase();