import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod/v3';

export const validate = (schema: AnyZodObject) =>
(req: Request, res: Response, next: NextFunction): void => {
    try {
        const parsed = schema.parse({
            body: req.body,
            params: req.params,
            Query: req.query,
        });
        if (parsed.body) req.body = parsed.body;
        if (parsed.params) req.params = parsed.params as any;

        next();
    } catch(err) {
        if(err instanceof ZodError) {
            res.status(400).json({
                message: "Validation failed",
                errors: err.issues.map(( issue ) =>({
                    path: issue.path.join("."),
                    message: issue.message,
                }) ),
            });
            return;
        }
        next(err);
    }
}