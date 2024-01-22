import {
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateChargeFileUseCase } from 'src/domain/useCases/charges/create-charge-file-use-case/CreateChargeFileUseCase';
import { GetChargesFilesUseCase } from 'src/domain/useCases/charges/get-charges-files-use-case/GetChargesFilesUseCase';

@Controller('charges')
export class ChargesController {
  constructor(
    private readonly getChargesFilesUseCase: GetChargesFilesUseCase,
    private readonly createChargeFileUseCase: CreateChargeFileUseCase,
  ) {}

  @Get('/files')
  @HttpCode(HttpStatus.OK)
  async getChargesFiles() {
    try {
      return await this.getChargesFilesUseCase.execute();
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async createCharges(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'text/csv' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      return await this.createChargeFileUseCase.execute(file);
    } catch (error) {
      throw error;
    }
  }
}
