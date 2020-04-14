import {Authorization, AuthorizationOnlyMaster }from './authorization';

export const User = Authorization(['user', 'manager', 'admin'])

export const Master = Authorization('master')
export const Caregiver = Authorization('caregiver')
export const OnlyMaster = AuthorizationOnlyMaster(['master'])