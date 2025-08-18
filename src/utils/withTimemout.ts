// src/utils/withTimeout.ts
export async function withTimeout<T>(p: Promise<T>, ms: number, tag='op'): Promise<T> {
  let t: any;
  try {
    const killer = new Promise<never>((_, rej) =>
      t = setTimeout(() => rej(new Error(`Timeout ${tag} em ${ms}ms`)), ms)
    );
    return await Promise.race([p, killer]) as T;
  } finally {
    clearTimeout(t);
  }
}
