import * as dotenv from 'dotenv';

dotenv.config();

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const phoneRegex = process.env.CLIENT === 'prod007' ? /^[0-9]*$/ : /^\d{10}$/;
export const zipCodeRegex = /^\d{5}[-\s]?(?:\d{4})?$/;
export const testKitIdRegex = /^[A-Z0-9]{6}-[A-Z0-9]{5}-[A-Z0-9]{4}$/;