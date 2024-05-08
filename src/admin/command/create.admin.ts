import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import { InjectModel } from '@nestjs/mongoose';
import { UserDBType, UserDocument } from '../../db/schemes/user.schemes';
import { Model } from 'mongoose';
import { RoleForUser } from '../../feauters/auth/model/dto/CreateUserDto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateAdmin {
  constructor(
    private configService: ConfigService,
    @InjectModel(UserDBType.name) private userModel: Model<UserDocument>,
  ) {}

  @Command({
    command: 'create:admin <email> <password>',
    describe: 'create a user',
  })
  async create(
    @Positional({
      name: 'email',
      describe: 'the username',
      type: 'string',
    })
    email: string,
    @Positional({
      name: 'password',
      describe: 'the admin password',
      type: 'string',
    })
    password: string,
  ) {
    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await bcrypt.hash(password, passwordSalt);

    const newUser = {
      accountData: {
        lastName: 'admin',
        firstName: 'admin',
        email: email,
        dateOfBirth: '1996/02/01',
        createdAt: new Date().toISOString(),
        avatar: this.configService.get('aws.DEFAULT_AVATAR'),
        role: RoleForUser.Admin,
        passwordSalt,
        passwordHash,
      },
    };
    const findUser = await this.userModel.findOne({
      'accountData.email': email,
    });

    if (findUser) {
      console.log('User with this email already exists');
      return;
    }

    await this.userModel.create({ ...newUser });
    console.log('Admin created');
    return;
  }
}
