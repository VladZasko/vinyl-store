import { UserType } from '../UserType';

export type ProfileViewModel = Pick<
  UserType,
  'firstName' | 'lastName' | 'email'
>;
