export enum Actions {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
}

export enum Entity {
  User = 'User',
  Vinyl = 'Vinyl',
  Review = 'Review',
}

export type AddLogsDto = {
  actions: Actions;
  entity: Entity;
  userId: string;
};
