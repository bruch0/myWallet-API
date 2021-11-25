# MyWallet API

## Documentation 🧾

### Sign up

```
POST /sign-up
```

#### Expected body

```jsx
{
  name: String, at least 3 characters,
  email: String, at least 5 characters, must be a valid email,
  password: String, at least 8 characters, does not differentiate upper and lower cases,
}
```

#### Expected headers

```bash
None, this is a public route
```

#### Possible response status

```bash
- 400: You have sent a invalid body or your body does not match the criteria,
- 409: This email is already registered
- 201: Account created
```

</br>

### Sign in

```
POST /sign-in
```

#### Expected body

```jsx
{
  email: String, at least 5 characters, must be a valid email,
  password: String, at least 8 characters, does not differentiate upper and lower cases,
}
```

#### Expected headers

```bash
None, this is a public route
```

#### Possible response status

```bash
- 400: You have sent a invalid body or your body does not match the criteria,
- 404: This email is not registered
- 401: Invalid password
- 200: Logged successfully
```

</br>

### Get transactions

```
GET /transactions
```

#### Expected headers

```jsx
{
  headers: {
    authorization: Bearer token
  }
}
```

#### Possible response status

```bash
- 401: You are not logged or your token is invalid
- 200: Success
```

#### What you will receive from this route

```jsx
{
  transactions: Array;
}
```

</br>

### Register transaction

```
POST /transactions
```

#### Expected body

```jsx
{
  value: String, at least 1 character,
  description: String, at least 5 characters,
  type: String, must be either 'input' or 'output',
```

#### Expected headers

```jsx
{
  headers: {
    authorization: Bearer token
  }
}
```

#### Possible response status

```bash
- 400: You have sent a invalid body or your body does not match the criteria,
- 401: You are not logged or your token is invalid
- 200: Success
```

</br>

## How to run in your machine 🖥️

```
git clone https://github.com/bruch0/myWallet-API.git
```

```
cd myWallet-API
```

```
npm i --force
```

Create a .env.dev file and fill it using your environment variables following <a href="https://github.com/bruch0/myWallet-API/blob/main/.env.example">this example</a>

### In your terminal

```
sudo su postgres
```

```
psql
```

```
CREATE DATABASE mywallet
```

```
\c mywallet
```

Copy everything in the <a href="https://github.com/bruch0/myWallet-API/blob/main/dump.sql">dump.sql</a> file and paste on the terminal</br>
You can not exit the postgres admin, and run

```
npm run dev
```

</br>

## How to run the tests in your machine 🖥️

Create a .env.test file and fill it using your environment variables following <a href="https://github.com/bruch0/myWallet-API/blob/main/.env.example">this example</a>

### In your terminal

```
sudo su postgres
```

```
psql
```

```
CREATE mywallet_test;
```

```
\c mywallet_test
```

Copy everything in the <a href="https://github.com/bruch0/myWallet-API/blob/main/dump.sql">dump.sql</a> file and paste on the terminal</br>

You can not exit the postgres admin, and run

```
npm run tests
```

</br>
  
  
## Deployment 🚀

<p align="center"><a  href="https://my-wallet-api-bruch0.herokuapp.com/">You can check the server running on heroku here!</a></p>

</br>

### Contact

<div align="center">
  
  [![Gmail Badge](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lucas.bruch0@gmail.com)
  [![Linkedin Badge](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucas-bruch/)
  
</div>
