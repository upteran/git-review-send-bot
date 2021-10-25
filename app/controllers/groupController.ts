import { groupService } from '../services/groupService';
import { groupApi } from '../api';

const group = groupService(groupApi);

export const groupCommands = [
  {
    name: 'reg',
    cb: group.registrationUser
  },
  {
    name: 'in',
    cb: group.enableUser
  },
  {
    name: 'out',
    cb: group.disableUser
  }
];
