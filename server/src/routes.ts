import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Extended Request type to include Auth0 payload
interface AuthRequest extends express.Request {
  auth?: {
    payload: {
      sub: string;
      email?: string;
      name?: string;
      picture?: string;
      [key: string]: unknown;
    };
    header: Record<string, unknown>;
    token: string;
  };
}

// Helper function to get or create user
async function ensureUser(authPayload: AuthRequest['auth']): Promise<string | null> {
  if (!authPayload?.payload.sub) {
    return null;
  }

  const userId = authPayload.payload.sub;
  const email = authPayload.payload.email || `${userId}@auth0.user`;
  const isAdmin = email === 'j.moses0131@gmail.com' || userId === 'google-oauth2|105349993486389830540';

  try {
    await prisma.user.upsert({
      where: { auth0Id: userId },
      update: {
        // Update email if provided
        ...(authPayload.payload.email && { email: authPayload.payload.email }),
        // Set admin role for specified email or ID
        role: isAdmin ? 'admin' : undefined
      },
      create: {
        auth0Id: userId,
        email: email,
        role: isAdmin ? 'admin' : 'user'
      }
    });
    return userId;
  } catch (error) {
    console.error('User upsert error:', error);
    return userId; // Return userId anyway since the user might already exist
  }
}

// User sync endpoint - call this after Auth0 login to ensure user exists
router.post('/user/sync', async (req: express.Request, res: express.Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = await ensureUser(authReq.auth);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id: userId },
      select: {
        id: true,
        auth0Id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Get current user profile
router.get('/user/profile', async (req: express.Request, res: express.Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.auth?.payload.sub;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id: userId },
      select: {
        id: true,
        auth0Id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Add text analysis result
router.post('/analysis/text', async (req: express.Request, res: express.Response) => {
  try {
    const authReq = req as AuthRequest;
    const { text, results, settings, title } = req.body;
    const userId = await ensureUser(authReq.auth);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const saved = await prisma.textAnalysisHistory.create({
      data: {
        userId: userId,
        textContent: text || '',
        title: title || 'Untitled Analysis',
        plagiarismScore: results?.plagiarismScore ?? null,
        grammarScore: results?.grammarScore ?? null,
        readabilityScore: results?.readabilityScore ?? null,
        analysisSettings: settings || {},
        results: results || {}
      }
    });

    res.json(saved);
  } catch (error) {
    console.error('Save text analysis error:', error);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// Add file analysis result
router.post('/analysis/file', async (req: express.Request, res: express.Response) => {
  try {
    const authReq = req as AuthRequest;
    const { fileName, fileType, fileSize, fileContent, fileUrl, results, settings } = req.body;
    const userId = await ensureUser(authReq.auth);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const saved = await prisma.fileUploadHistory.create({
      data: {
        userId: userId,
        fileName: fileName || 'Unknown',
        fileType: fileType || 'unknown',
        fileSize: fileSize || 0,
        fileContent: fileContent || null,
        fileUrl: fileUrl || null,
        plagiarismScore: results?.plagiarismScore ?? null,
        grammarScore: results?.grammarScore ?? null,
        readabilityScore: results?.readabilityScore ?? null,
        analysisSettings: settings || {},
        results: results || {}
      }
    });

    res.json(saved);
  } catch (error) {
    console.error('Save file analysis error:', error);
    res.status(500).json({ error: 'Failed to save file analysis' });
  }
});

// Get history
router.get('/history', async (req: express.Request, res: express.Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.auth?.payload.sub;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const [textHistory, fileHistory] = await Promise.all([
      prisma.textAnalysisHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.fileUploadHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    // Combine and sort
    const combined = [
      ...textHistory.map((t: { createdAt: Date; [key: string]: unknown }) => ({ ...t, type: 'text' as const })),
      ...fileHistory.map((f: { createdAt: Date; [key: string]: unknown }) => ({ ...f, type: 'file' as const }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json(combined);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ error: 'Error fetching history' });
  }
});

// Delete history item
router.delete('/history/:id', async (req: express.Request, res: express.Response) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const userId = authReq.auth?.payload.sub;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { type } = req.query;

    if (type === 'file') {
      await prisma.fileUploadHistory.deleteMany({
        where: {
          id: id as string,
          userId: userId as string
        }
      });
    } else {
      await prisma.textAnalysisHistory.deleteMany({
        where: {
          id: id as string,
          userId: userId as string
        }
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
