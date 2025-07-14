import * as crypto from 'crypto';

export const hashPhone = (phone: string) => {
  return crypto.createHash('sha256').update(phone).digest('hex');
};
