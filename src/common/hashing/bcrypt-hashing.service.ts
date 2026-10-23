import bcrypt from 'bcryptjs';
import { HashingService } from './hashing.service.js';

export class BcryptHashingService extends HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const isValidHash = await bcrypt.compare(password, hash);
    return isValidHash;
  }
}
