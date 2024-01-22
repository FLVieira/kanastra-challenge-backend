export class Charge {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly governmentId: string,
    public readonly email: string,
    public readonly debtAmount: number,
    public readonly debtDueDate: Date,
    public readonly debtId: string,
  ) {}
}
