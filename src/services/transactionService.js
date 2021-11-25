import dayjs from 'dayjs';

import * as transactionSchema from '../schemas/transactionSchema.js';
import * as transactionRepository from '../repositories/transactionRepository.js';

const getTransactions = async ({ userId }) => {
  const transactions = await transactionRepository.getTransactions({ userId });

  transactions.forEach((transaction) => {
    delete transaction.id;
    delete transaction.user_id;
  });

  return transactions;
};

const registerTransaction = async ({ description, value, type, userId }) => {
  const validation = transactionSchema.registerTransaction.validate({
    description,
    value,
    type,
  });

  if (validation.error) return -1;

  const date = dayjs().format('DD/MM');

  await transactionRepository.registerTransaction({
    date,
    description,
    value,
    type,
    userId,
  });

  return 1;
};

export { getTransactions, registerTransaction };
