import dotenv from 'dotenv';
import { decrypt } from './crypto';
dotenv.config();

export function ids(id: number) {
    if (id === 99) {
        return decrypt(process.env.P99!)
    }
}