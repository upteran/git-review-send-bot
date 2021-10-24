import { ref, set, get, child, update } from 'firebase/database';
import { database } from '../config/firebase';
import { GroupApiType } from './index';

export function addData({ path }: { path: string }): Function {
  return <T>(apiConfig: GroupApiType, params: T): void => {
    const { chatId, id } = apiConfig;
    const createdPath = `groups/${chatId}/${path}/${id}`;
    set(ref(database, createdPath), {
      ...params
    }).catch(err => {
      throw new TypeError(
        `Error update ${path} with ${params} to db, err = ${err}`
      );
    });
  };
}

export function getData({ path }: { path: string }): Function {
  return async function <T>(apiConfig: GroupApiType): Promise<T> {
    const { chatId, id = '' } = apiConfig;
    const dbRef = ref(database);
    const createdPath = `groups/${chatId}/${path}/${id}`;
    let data = null;
    try {
      const snapshot = await get(child(dbRef, createdPath));
      console.log('snapshot', snapshot);
      if (snapshot.exists()) {
        console.log(snapshot.val());
        data = snapshot.val();
      } else {
        console.log('No data available');
      }
    } catch (e) {
      console.error(e);
    }

    return data;
  };
}

export function updateData({ path }: { path: string }): Function {
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
