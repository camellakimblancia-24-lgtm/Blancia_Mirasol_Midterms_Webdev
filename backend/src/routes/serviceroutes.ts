import { Router, Response } from 'express';
import { pool } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createServiceSchema, updateServiceSchema,  } from '../schema/service_schema';

const router = Router();

router.use(authenticate);

// CREATE
router.post('/', validate(createServiceSchema), async (req: AuthRequest, res: Response) => {
  const { title, description, severity } = req.body;
  const result = await pool.query(
    `INSERT INTO incidents (title, description, severity, created_by)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description || null, severity || 'low', req.user!.id]
  );
  res.status(201).json(result.rows[0]);
});

// READ ALL
router.get('/', async (_req: AuthRequest, res: Response) => {
  const result = await pool.query('SELECT * FROM incidents ORDER BY created_at DESC');
  res.json(result.rows);
});

// UPDATE
router.patch('/:id', validate(updateServiceSchema), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, severity } = req.body;

  const existing = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);
  if (existing.rows.length === 0) return res.status(404).json({ error: 'Incident not found' });

  const updated = await pool.query(
    `UPDATE incidents SET
       status = COALESCE($1, status),
       severity = COALESCE($2, severity)
     WHERE id = $3 RETURNING *`,
    [status, severity, id]
  );
  res.json(updated.rows[0]);
});

// DELETE
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM incidents WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Incident not found' });
  res.status(204).send();
});

export default router;