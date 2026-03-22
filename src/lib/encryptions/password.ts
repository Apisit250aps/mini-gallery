import * as argon2 from 'argon2'

export async function hash(password: string): Promise<string> {
  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 4,
    hashLength: 32,
  })
  return hash
}

export async function verify(hash: string, plain: string): Promise<boolean> {
  const isValid = await argon2.verify(hash, plain)
  return isValid
}
