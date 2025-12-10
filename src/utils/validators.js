import { z } from 'zod'

export const phoneSchema = z.string()
  .regex(/^\d{10}$/, 'Phone number must be 10 digits')

export const priceSchema = z.string()
  .regex(/^\d+$/, 'Price must be a valid number')
  .refine(val => parseInt(val) > 0, 'Price must be greater than 0')

export const latLngSchema = z.string()
  .regex(/^-?\d+\.?\d*$/, 'Must be a valid decimal number')

export const commissionSchema = z.string()
  .regex(/^\d+$/, 'Commission must be a number')
  .refine(val => {
    const num = parseInt(val)
    return num >= 0 && num <= 100
  }, 'Commission must be between 0 and 100')

export const turfNameSchema = z.string()
  .min(3, 'Turf name must be at least 3 characters')

export const addressSchema = z.string()
  .min(6, 'Address must be at least 6 characters')

export const emailSchema = z.string()
  .email('Invalid email address')

export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
