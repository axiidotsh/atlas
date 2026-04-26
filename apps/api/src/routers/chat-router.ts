import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { authMiddleware } from '../middleware/auth';

const renameChatSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

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
  .post('/', async (c) => {
    const user = c.get('user');

    const chat = await db.chat.create({
      data: {
        userId: user.id,
        title: 'New Chat',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({ chat }, 201);
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
  })
  .patch('/:id', zValidator('json', renameChatSchema), async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const { title } = c.req.valid('json');

    const existing = await db.chat.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    const chat = await db.chat.update({
      where: { id },
      data: { title },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({ chat });
  })
  .delete('/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    const existing = await db.chat.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    await db.chat.delete({ where: { id } });

    return c.json({ success: true });
  });
