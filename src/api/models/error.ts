import { z } from 'zod';

export const ValidationErrorSchema = z.object({
    errorMessage: z.string(),
    memberNames:  z.array(z.string()),
});

export const ValidationErrorListSchema = z.array(ValidationErrorSchema);

export type ValidationError = z.infer<typeof ValidationErrorSchema>;
export type ValidationErrorList = z.infer<typeof ValidationErrorListSchema>;