import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateMyPhotoDto } from './dto/update-my-photo.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Perfil do usuario autenticado' })
  @ApiOkResponse({ description: 'Dados do usuario autenticado' })
  me(@Req() req: AuthenticatedRequest) {
    return this.users.me(BigInt(req.user.sub));
  }

  @Patch('me/photo')
  @ApiOperation({ summary: 'Atualizar foto do usuario autenticado' })
  @ApiOkResponse({ description: 'Foto atualizada com sucesso' })
  updateMyPhoto(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateMyPhotoDto,
  ) {
    return this.users.updateMyPhoto(
      BigInt(req.user.sub),
      dto.photoBase64 ?? null,
    );
  }
}
