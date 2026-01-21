import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Public routes
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('TreeText API is running');
});

app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Auth0 Middleware Configuration
// We'll configure this properly once we have the Auth0 credentials
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://treetext-api',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://YOUR_DOMAIN.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// Import routes
import apiRoutes from './routes';

// API Routes (Protected)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use('/api', checkJwt, apiRoutes);

// Protected route example (keep for testing)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/api/test-protected', checkJwt, (req: any, res: express.Response) => {
  res.json({ message: 'You are authenticated', user: req.auth });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
