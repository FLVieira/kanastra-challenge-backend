export interface IChargesService {
  createCharges(file: Express.Multer.File): Promise<void>;
  getChargesFiles(): Promise<{
    data: {
      id: number;
      name: string;
      uploadDate: Date;
    }[];
  }>;
}
