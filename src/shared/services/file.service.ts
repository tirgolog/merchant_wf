import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  constructor(
  ) { }

  async writeFile(file: File) {
    console.log(file)
  }

}