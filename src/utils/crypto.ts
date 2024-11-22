import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-ctr';

export function encrypt(text: string): string {
    const secretKey = process.env.SECRET_KEY!;
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(encryptedText: string): string {
    const secretKey = process.env.SECRET_KEY!;
    const [iv, content] = encryptedText.split(':');
    const decipher = createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    return decrypted.toString();
}
