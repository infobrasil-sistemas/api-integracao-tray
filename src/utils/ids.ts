import dotenv from 'dotenv';
import { decrypt } from './crypto';
dotenv.config();

export function ids(id: number) {
    if (id === 99) {
        return decrypt(process.env.P99!)
    }
    if (id === 131) {
        return decrypt(process.env.P131!)
    }
    if (id === 104) {
        return process.env.P104!
    }
}