import { compare, hash } from 'bcrypt';
class Bcrypt {
  async hashed(password: string) {
    const res = await hash(password, 8);

    return res.toString();
  }

  async compared(password: string, userPassword: string) {
    const res = await compare(password, userPassword);

    return res;
  }
}

export default new Bcrypt();
