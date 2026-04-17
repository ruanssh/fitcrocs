import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  photoBase64: true,
  createdAt: true,
  updatedAt: true,
} as const;

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) throw new BadRequestException('Email ja cadastrado');

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      select: USER_SAFE_SELECT,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async me(id: bigint) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SAFE_SELECT,
    });

    if (!user) throw new NotFoundException('Usuario nao encontrado');
    return user;
  }

  async updateMyPhoto(id: bigint, photoBase64: string | null) {
    const normalizedPhoto = photoBase64?.trim() || null;

    if (normalizedPhoto) {
      this.validatePhotoBase64(normalizedPhoto);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        photoBase64: normalizedPhoto,
      },
      select: USER_SAFE_SELECT,
    });
  }

  private validatePhotoBase64(photoBase64: string) {
    const match = photoBase64.match(
      /^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/i,
    );

    if (!match) {
      throw new BadRequestException(
        'Formato invalido. Use PNG, JPG, JPEG ou WEBP em Base64',
      );
    }

    const base64Data = match[2];
    const padding = base64Data.endsWith('==')
      ? 2
      : base64Data.endsWith('=')
        ? 1
        : 0;
    const bytes = Math.floor((base64Data.length * 3) / 4) - padding;

    if (bytes <= 0) {
      throw new BadRequestException('A imagem enviada esta vazia');
    }

    if (bytes > MAX_PHOTO_BYTES) {
      throw new BadRequestException(
        'Imagem muito grande. Tamanho maximo permitido: 10MB',
      );
    }
  }
}
