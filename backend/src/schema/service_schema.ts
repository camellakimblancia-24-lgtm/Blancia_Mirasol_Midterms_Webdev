import { version } from 'node:os';
import { z } from 'zod';

export const environmentEnum = z.enum(['DEVELOPMENT' , 'STAGING' , 'PRODUCTION']);
export const statusEnum = z.enum(['HEALTHY', 'DEGRADED', 'DOWN']);

export const createServiceSchema = z.object({
    body: z.object ({
        name: z.string().min(3).max(60),
        endpointURL: z.string().url({message: "Endpoint URL must be a valid URL"}),
        environment: environmentEnum,
        status: statusEnum,
        version: z.string(),
    }),
});

export const updateServiceSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(60).optional,
        endpointURL: z.string().url().optional(),
        environmentEnum: environmentEnum.optional(),
        status: statusEnum.optional(),
        version: z.string().optional(),
    }),
});

export const deleteServiceSchema = z.object({
    params: z.object({
        id:z.string().min(1),
    }),
});