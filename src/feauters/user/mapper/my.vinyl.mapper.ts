import { UserDBType } from '../../../db/schemes/user.schemes';
import { VinylDBType } from '../../../db/schemes/vinyl.shemes';
import { MyVinylType } from '../model/output/MyVinylViewModel';

export const myVinylMapper = (
  vinyls: VinylDBType,
  user: UserDBType,
): MyVinylType => {
  const purchased = user.purchasedVinyl.find(
    (p) => p.vinylId === vinyls._id.toString(),
  );
  return {
    title: vinyls.title,
    author: vinyls.author,
    description: vinyls.description,
    purchasedDate: purchased.purchasedDate,
  };
};
