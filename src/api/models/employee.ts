import { z } from 'zod';

const ReadOnlyFields = z.object({
    partitionKey:  z.string().nullable().optional(),
    sortKey:       z.uuid().optional(),
    gross:         z.number().optional(),
    benefitsCost:  z.number().optional(),
    net:           z.number().optional(),
});

const WriteableFields = z.object({
    id:          z.uuid().optional(),
    username:    z.string().min(0).max(50),
    firstName:   z.string().min(0).max(50),
    lastName:    z.string().min(0).max(50),
    dependants:  z.number().int().min(0).max(32).optional(),
    salary:      z.number().optional(),
    expiration:  z.iso.datetime({ offset: true }).nullable().optional(),
});

export const EmployeeSchema = WriteableFields.extend(ReadOnlyFields.shape);
export const EmployeeListSchema = z.array(EmployeeSchema);
export const EmployeeRequestSchema = WriteableFields;

export type EmployeeRequest = z.infer<typeof EmployeeRequestSchema>;
export type EmployeeResponse = z.infer<typeof EmployeeSchema>;
