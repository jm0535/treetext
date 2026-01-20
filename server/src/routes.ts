import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
// Cast to any to bypass Prisma 7 type strictness on datasources
const prisma = new PrismaClient();

// Extended Request type to include Auth0 payload
interface AuthRequest extends express.Request {
  auth?: {
    payload: {
      sub: string;
      email?: string;
      [key: string]: any;
    };
    header: any;
    token: string;
  };
}

// Add text analysis result
router.post('/analysis/text', async (req: express.Request, res: express.Response) => {
  try {
    const authReq = req as AuthRequest;
    const { text, results, settings, title } = req.body;
    const userId = authReq.auth?.payload.sub;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Ensure user exists locally
    try {
        await prisma.user.upsert({
            where: { auth0Id: userId },
            update: {},
            create: {
                auth0Id: userId,
                email: authReq.auth?.payload.email || `${userId}@no-email.com` // Fallback
            }
        });
    } catch (e) {
        console.log("User upsert error (ignoring for now):", e);
    }

    const saved = await prisma.textAnalysisHistory.create({
      data: {
        userId: userId,
        textContent: text,
        title: title || 'Untitled Analysis',
        plagiarismScore: results.plagiarismScore,
        grammarScore: results.grammarScore,
        readabilityScore: results.readabilityScore,
        analysisSettings: settings || {},
        results: results || {}
      }
    });

    res.json(saved);
  } catch (error) {
    console.error("Save text analysis error:", error);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// Add file analysis result
router.post('/analysis/file', async (req: express.Request, res: express.Response) => {
    try {
      const authReq = req as AuthRequest;
      const { fileName, fileType, fileSize, fileContent, fileUrl, results, settings } = req.body;
      const userId = authReq.auth?.payload.sub;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await prisma.user.upsert({
          where: { auth0Id: userId },
          update: {},
          create: {
              auth0Id: userId,
              email: authReq.auth?.payload.email || `${userId}@no-email.com`
          }
      });

      const saved = await prisma.fileUploadHistory.create({
        data: {
          userId: userId,
          fileName,
          fileType,
          fileSize,
          fileContent,
          fileUrl,
          plagiarismScore: results.plagiarismScore,
          grammarScore: results.grammarScore,
          readabilityScore: results.readabilityScore,
          analysisSettings: settings || {},
          results: results || {}
        }
      });

      res.json(saved);
    } catch (error) {
      console.error("Save file analysis error:", error);
      res.status(500).json({ error: 'Failed to save file analysis' });
    }
});

// Get history
router.get('/history', async (req: express.Request, res: express.Response) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.auth?.payload.sub;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const textHistory = await prisma.textAnalysisHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        const fileHistory = await prisma.fileUploadHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        // Combine and sort
        const combined = [
            ...textHistory.map(t => ({ ...t, type: 'text' })),
            ...fileHistory.map(f => ({ ...f, type: 'file' }))
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        res.json(combined);
    } catch (error) {
        console.error("Fetch history error:", error);
        res.status(500).json({ error: "Error fetching history" });
    }
});

// Delete history item
router.delete('/history/:id', async (req: express.Request, res: express.Response) => {
    try {
        const authReq = req as AuthRequest;
        const { id } = req.params;
        const userId = authReq.auth?.payload.sub;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        // Try deleting from both (inefficient but simple given UUIDs should be unique)
        // Or we should pass type. Let's assume ID is enough or user passes type in query
        const { type } = req.query;

        // Force cast to string for Prisma compatibility
        const idStr = id as string;
        const userIdStr = userId as string;

        if (type === 'file') {
            await prisma.fileUploadHistory.deleteMany({ where: { id: idStr, userId: userIdStr } });
        } else {
             await prisma.textAnalysisHistory.deleteMany({ where: { id: idStr, userId: userIdStr } });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});

export default router;
