import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Environment validation
const requiredEnvVars = ['AUTH0_AUDIENCE', 'AUTH0_ISSUER_BASE_URL', 'DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('Some features may not work correctly.');
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Public routes
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('TreeText API is running');
});

app.get('/health', (req: express.Request, res: express.Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      auth0Configured: !!(process.env.AUTH0_AUDIENCE && process.env.AUTH0_ISSUER_BASE_URL),
      databaseConfigured: !!process.env.DATABASE_URL
    }
  };
  res.json(health);
});

// Auth0 Middleware Configuration
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://treetext-api',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://placeholder.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// Import routes
import apiRoutes from './routes';

// API Routes (Protected)
app.use('/api', checkJwt, apiRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  // Handle Auth0 JWT errors
  if (err.name === 'UnauthorizedError' || err.name === 'InvalidTokenError') {
    return res.status(401).json({ error: 'Invalid or missing authentication token' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  if (missingEnvVars.length > 0) {
    console.warn(`Missing env vars: ${missingEnvVars.join(', ')}`);
  }
});
