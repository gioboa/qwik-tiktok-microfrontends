import { Account, Client, Databases, ID, Query, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(String(import.meta.env.VITE_APPWRITE_URL))
  .setProject(String(import.meta.env.VITE_ENDPOINT));

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { ID, Query, account, client, database, storage };
