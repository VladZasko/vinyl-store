import { Injectable, NotFoundException } from '@nestjs/common';
import { VinylRepository } from '../repository/vinyl.repository';
import { CreateVinylModel } from '../model/input/CreateVinylModel';
import { CreateReviewDto } from '../model/dto/CreateReviewDto';
import { UserRepository } from '../../user/repository/user.repository';
import { StripeAdapter } from '../../stripe/stripe.adapter';
import { EmailAdapter } from '../../../adapter/email-adapter';
import { TelegramAdapter } from '../../../adapter/telegram.adapter';
import { VinylsType } from '../model/output/VinylsViewModel';
import { CreateVinylDto } from '../model/dto/CreateVinylDto';
import { TelegramNotificationType } from '../model/dto/TelegramNotificationDto';
import { UserViewModel } from '../../auth/model/output/UserViewModel';
import { CreateReviewRepositoryDto } from '../model/dto/CreateReviewRepositoryDto';
import { VinylDBType } from '../../../db/schemes/vinyl.shemes';
import { CreateOrderDto } from '../model/dto/CreateOrderDto';
import { BuyVinylDto } from '../model/dto/BuyVinylDto';
import { BuyVinylViewModel } from '../model/output/BuyVinylViewModel';
import { OrderDBType } from '../../../db/schemes/order.schemes';

@Injectable()
export class VinylService {
  constructor(
    protected vinylRepository: VinylRepository,
    protected userRepository: UserRepository,
    private stripeAdapter: StripeAdapter,
    private emailAdapter: EmailAdapter,
    private telegramAdapter: TelegramAdapter,
  ) {}

  async createVinyl(createVinylData: CreateVinylModel): Promise<VinylsType> {
    const newVinyl: CreateVinylDto = {
      title: createVinylData.title,
      author: createVinylData.author,
      description: createVinylData.description,
      price: createVinylData.price,
      quantity: createVinylData.quantity,
      createdAt: new Date().toISOString(),
    };

    const createVinyl: VinylsType =
      await this.vinylRepository.createVinyl(newVinyl);

    const telegramNotificationDate: TelegramNotificationType = {
      title: createVinylData.title,
      description: createVinylData.description,
      price: createVinylData.price,
      vinylId: createVinyl.id,
    };

    await this.telegramAdapter.sendMessage(telegramNotificationDate);

    return createVinyl;
  }

  async buyVinyl(
    userId: string,
    vinylData: VinylDBType,
  ): Promise<BuyVinylViewModel> {
    const orderData: CreateOrderDto = {
      userId,
      vinylId: vinylData._id.toString(),
      price: vinylData.price,
      createdAt: new Date().toISOString(),
    };

    const createOrder: OrderDBType =
      await this.vinylRepository.createOrder(orderData);

    const buyData: BuyVinylDto = {
      client_reference_id: createOrder._id.toString(),
      title: vinylData.title,
      price: vinylData.price,
    };

    return await this.stripeAdapter.buy(buyData);
  }

  async finishBuyVinyl(client_reference_id: string) {
    const findOrder = await this.vinylRepository.findOrder(client_reference_id);
    if (!findOrder) {
      throw new NotFoundException('Order not found');
    }
    const buyData = {
      vinylId: findOrder.vinylId,
      userId: findOrder.userId,
      purchasedDate: new Date().toISOString(),
    };

    await this.vinylRepository.finishBuyVinyl(buyData);
    await this.vinylRepository.updateQuantity(findOrder.vinylId);

    const findUser = await this.userRepository.findUserById(findOrder.userId);

    const emailAdapterDto = {
      email: findUser.email,
    };
    await this.emailAdapter.sendNotificationByVinyl(emailAdapterDto);

    return true;
  }

  async updateVinyl(vinylId: string, updateVinylDto: CreateVinylModel) {
    return this.vinylRepository.updateVinyl(vinylId, updateVinylDto);
  }

  async createReviewByVinyl(userId: string, createReviewDto: CreateReviewDto) {
    const findUser: UserViewModel =
      await this.userRepository.findUserById(userId);
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const newReview: CreateReviewRepositoryDto = {
      author: `${findUser.firstName!} ${findUser.lastName!}`,
      content: createReviewDto.content,
      score: createReviewDto.score,
      vinylId: createReviewDto.vinylId,
      userId: userId,
      createdAt: new Date().toISOString(),
    };

    const createReview: boolean =
      await this.vinylRepository.createReview(newReview);

    return createReview;
  }

  async deleteVinyl(vinylId: string) {
    return this.vinylRepository.deleteVinyl(vinylId);
  }
}
