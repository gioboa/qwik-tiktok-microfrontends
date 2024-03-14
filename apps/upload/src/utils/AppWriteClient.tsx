import { Account, Client, Databases, ID, Query, Storage } from 'appwrite';

const awUserClient = (jwt?: string) =>
  new Client()
    .setEndpoint(String(import.meta.env.VITE_APPWRITE_URL))
    .setProject(String(import.meta.env.VITE_ENDPOINT))
    .setJWT(jwt || '');

const account = new Account(awUserClient());
const database = new Databases(awUserClient());
const storage = new Storage(awUserClient());

export { ID, Query, account, awUserClient as client, database, storage };
