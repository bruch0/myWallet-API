import { compareSync, hashSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';

import * as userSchema from '../schemas/userSchema.js';
import * as userRepository from '../repositories/userRepository.js';
import * as sessionRepository from '../repositories/sessionRepository.js';

const signUp = async ({ name, email, password }) => {
  const validation = userSchema.signUp.validate({
    name,
    email,
    password,
  });

  if (validation.error) return -2;

  const emailAlreadyRegistered = await userRepository.findByEmail({
    email,
    boolean: true,
  });

  if (emailAlreadyRegistered) return -1;

  const hashedPassword = hashSync(password, 12);
  await userRepository.signUp({ name, email, hashedPassword });

  return 1;
};

const signIn = async ({ email, password }) => {
  const validation = userSchema.signIn.validate({ email, password });

  if (validation.error) return -2;

  const user = await userRepository.findByEmail({ email });

  if (!user.length) return -1;

  const { name, id } = user[0];

  const isValidPassword = compareSync(password, user[0].password);

  if (!isValidPassword) return 0;

  const { token } = await sessionRepository.checkSessionById({ userId: id });

  if (token) return { name, token };

  const newToken = uuid();

  await sessionRepository.createSession({
    userId: id,
    token: newToken,
  });

  return { name, token: newToken };
};

export { signUp, signIn };
