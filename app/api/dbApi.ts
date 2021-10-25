import { ref, set, get, child, update } from 'firebase/database';
import { database } from '../config/firebase';
import { GroupApiType, GenericApiFn } from './types';

export function addData({ path }: { path: string }): GenericApiFn<any, any> {
  return async <T>(apiConfig: GroupApiType, params: T): Promise<void> => {
    const { chatId, id } = apiConfig;
    try {
      await set(ref(database, `groups/${chatId}/${path}/${id}`), {
        ...params
      });
    } catch (err) {
      throw new TypeError(
        `Error add ${path} with ${params} to db, err = ${err}`
      );
    }
  };
}

export function removeData({ path }: { path: string }): GenericApiFn<any, any> {
  return async <T>(apiConfig: GroupApiType, params: T): Promise<void> => {
    const { chatId, id } = apiConfig;
    try {
      await set(ref(database, `groups/${chatId}/${path}/${id}`), undefined);
    } catch (err) {
      throw new TypeError(
        `Error remove ${path} with ${params} from db, err = ${err}`
      );
    }
  };
}

export function getData({ path }: { path: string }): GenericApiFn<any, any> {
  return async function <T>(apiConfig: GroupApiType): Promise<T> {
    const { chatId, id = '' } = apiConfig;
    const dbRef = ref(database);
    const createdPath = `groups/${chatId}/${path}/${id}`;
    let data = null;
    try {
      const snapshot = await get(child(dbRef, createdPath));
      if (snapshot.exists()) {
        data = snapshot.val();
      } else {
        console.log('No data available');
      }
    } catch (e) {
      // TODO: add Error
      console.error(e);
    }

    return data;
  };
}

export function updateData({ path }: { path: string }): GenericApiFn<any, any> {
  return function <T>(apiConfig: GroupApiType, params: T): Promise<void> {
    const { id, chatId } = apiConfig;
    if (!params) {
      throw new TypeError(`Error ${path} update, params to update not exists`);
    }
    try {
      const updates = {};
      Object.keys(params).forEach(key => {
        // @ts-ignore
        updates[`groups/${chatId}/${path}/${id}/${key}`] = params[key];
      });
      return update(ref(database), updates);
    } catch (e) {
      throw TypeError(`Error on ${path} update, error msg = ${e}`);
    }
  };
}
