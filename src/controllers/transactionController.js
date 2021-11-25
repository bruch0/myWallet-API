import * as transactionService from '../services/transactionService.js';

const getTransactions = async (req, res) => {
  const userId = req.userId;

  const transactions = await transactionService.getTransactions({ userId });

  return res.send(transactions);
};

const registerTransaction = async (req, res) => {
  const { value, description, type } = req.body;
  const userId = req.userId;

  if (!value || !description || !type) return res.sendStatus(400);

  if (!userId) return res.sendStatus(401);

  const createTransaction = await transactionService.registerTransaction({
    value,
    type,
    description,
    userId,
  });

  if (createTransaction === -1) return res.sendStatus(400);

  return res.sendStatus(201);
};

export { getTransactions, registerTransaction };
