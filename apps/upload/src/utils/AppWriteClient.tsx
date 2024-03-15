import { Account, Client, Databases, ID, Query, Storage } from 'appwrite';
import { ENV_VARIABLES } from '../env';

const awUserClient = (jwt?: string) =>
  new Client()
    .setEndpoint(String(ENV_VARIABLES.VITE_APPWRITE_URL))
    .setProject(String(ENV_VARIABLES.VITE_ENDPOINT))
    .setJWT(jwt || '');

const account = new Account(awUserClient());
const database = new Databases(awUserClient());
const storage = new Storage(awUserClient());

export { ID, Query, account, awUserClient as client, database, storage };
