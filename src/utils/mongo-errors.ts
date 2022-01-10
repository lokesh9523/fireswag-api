import { MongoError } from 'mongodb';
import { IUsers } from '../models/users';

// let errorRegex = /index: (.+) dup key: /;
let errorRegex = /dup key: (.*)/;

export function postSaveHook(error: MongoError, doc: IUsers, next: (err?) => void) {
  if (error.name === 'MongoError' && error.code === 11000) {
    try {
      // JSON.parse(errorRegex.exec(error.message)[1].replace(/([^\s]+): ([^\s]+)/g, "\"$1\": $2"));
      next(new Error(`${errorRegex.exec(error.message)[1]} that you have entered is already exists.`));
    } catch (e) {
      next(error);
    }
  } else {
    next(error);
  }
};