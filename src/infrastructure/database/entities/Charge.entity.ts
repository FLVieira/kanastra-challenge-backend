import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('charges')
export class Charge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  governmentId: string;

  @Column()
  email: string;

  @Column('decimal', { precision: 12, scale: 2 })
  debtAmount: number;

  @Column()
  debtId: string;

  @Column({ type: 'timestamptz' })
  debtDueDate: Date;
}
