import connection from '../../src/database/database';

const clearDatabase = async () => {
  await connection.query('TRUNCATE sessions CASCADE');
  await connection.query('TRUNCATE users CASCADE');
};

export default clearDatabase;
