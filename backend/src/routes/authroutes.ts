    import { Router } from 'express';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import { pool } from '../db';
    import { validate } from '../middleware/validate';
    import { loginSchema, registerSchema } from '../schema/auth_schema'


    const router = Router();

    router.post('/register', validate(registerSchema), async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hash]
        );
        res.status(201).json(result.rows[0]);
        } catch (err: any) {
            console.error(err);
            if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
            }
            res.status(500).json({ error: 'Something went wrong' });
        }
    });

    router.post('/login', validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });
    res.json({ token, user: { id: user.id, email: user.email } });
    });

    export default router;