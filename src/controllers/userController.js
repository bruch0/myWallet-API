import * as userService from '../services/userService.js';

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.sendStatus(400);

    const createUser = await userService.signUp({ name, email, password });

    if (createUser === -2) return res.sendStatus(400);
    if (createUser === -1) return res.sendStatus(409);

    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  const signInUser = await userService.signIn({ email, password });

  if (signInUser === -2) return res.sendStatus(400);
  if (signInUser === -1) return res.sendStatus(404);
  if (signInUser === 0) return res.sendStatus(401);

  return res.send(signInUser);
};

export { signUp, signIn };
