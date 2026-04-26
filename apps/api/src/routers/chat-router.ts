import { Hono } from 'hono';
import { db } from '../db';
import { authMiddleware } from '../middleware/auth';

export const chatRouter = new Hono()
  .use('*', authMiddleware)
  .get('/', async (c) => {
    const user = c.get('user');

    const chats = await db.chat.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({ chats });
  })
  .get('/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const chat = await db.chat.findFirst({
      where: { id, userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    return c.json({ chat });
  });
