import { VinylDBType } from '../../../db/schemes/vinyl.shemes';
import { VinylsType } from '../model/output/VinylsViewModel';

export const vinylMapper = (vinyls: VinylDBType): VinylsType => {
  return {
    id: vinyls._id.toString(),
    title: vinyls.title,
    author: vinyls.author,
    description: vinyls.description,
    price: vinyls.price,
    createdAt: vinyls.createdAt,
  };
};
