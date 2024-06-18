import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const sighupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
})

export const blogPostSchema = z.object({
    title: z.string(),
    content: z.string()
})

export const blogUpdateSchema = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string()
})

export type SighinInput = z.infer<typeof loginSchema>
export type SighupInput = z.infer<typeof sighupSchema>
export type BlogPostType = z.infer<typeof blogPostSchema>
export type BlogUpdateType = z.infer<typeof blogUpdateSchema>
