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

export type addLogsDtoType = {
  actions: Actions;
  entity: Entity;
  userId: string;
};
