import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  async register(name: string, email: string, password: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new BadRequestException('Email ja cadastrado');

    const user = await this.users.create({ name, email, password });
    const access_token = await this.signToken(user.id, user.email, user.name);

    return {
      user,
      access_token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais invalidas');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais invalidas');

    const access_token = await this.signToken(user.id, user.email, user.name);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoBase64: user.photoBase64,
      },
      access_token,
    };
  }

  private signToken(id: bigint, email: string, name: string) {
    return this.jwt.signAsync({
      sub: id.toString(),
      email,
      name,
    });
  }
}
