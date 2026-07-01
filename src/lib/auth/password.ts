import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// PIN is a 4-digit string e.g. "1234"
export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, SALT_ROUNDS)
}

export async function comparePin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}
