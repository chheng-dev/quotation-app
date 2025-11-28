import { AnyPgTable } from "drizzle-orm/pg-core";
import { db } from "../db/connection";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export class BaseModel<T extends AnyPgTable> {
  protected table: T;
  protected idColumn: any;

  constructor(table: T, idColumn: keyof InferSelectModel<T> = "id") {
    this.table = table;
    this.idColumn = (table as any).columns?.[idColumn];
  }

  async create(value: InferInsertModel<T>): Promise<InferSelectModel<T>>{
    const [row] = await db.insert(this.table).values(value).returning();
    return row as any;
  }

  async list(): Promise<InferSelectModel<T>> {
    return await db.select().from(this.table as any) as any;
  }
}