import * as sessionRepository from '../repositories/sessionRepository.js';

const authToken = async (req, res, next) => {
  const aux = req.headers.authorization;
  if (!/Bearer /gm.test(aux)) {
    return res.sendStatus(401);
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  if (!token) return res.sendStatus(401);

  const { userId } = await sessionRepository.checkSessionByToken({ token });
  if (!userId) return res.sendStatus(401);

  req.userId = userId;

  next();
};

export default authToken;
