import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary não configurado corretamente (.env)');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // 🔍 Debug útil
    console.log('Cloudinary conectado:', cloudName);
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'cars',
        },
      );

      return result;
    } catch (error) {
      console.error('Cloudinary error real:', error);
      throw new BadRequestException('Erro ao enviar imagem');
    }
  }
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Erro ao deletar no Cloudinary:', error);
      throw new BadRequestException('Erro ao deletar imagem');
    }
  }
}
