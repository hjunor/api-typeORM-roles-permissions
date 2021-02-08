import { getCustomRepository, Repository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';

class UserValidator {
  async username(username: string) {
    const userRepository = getCustomRepository(UserRepository);
    const existUser = await userRepository.findOne({ username });

    return existUser;
  }

  async id(id: string | number) {
    const userRepository = getCustomRepository(UserRepository);
    const existUser = await userRepository.findOne(id);

    return existUser;
  }
}

export default new UserValidator();
