import { and, eq, SQL, sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { db } from '../lib/db';

export type WhereCondition<T> = Partial<T> | SQL;
export type OrderBy = { column: string; direction: 'asc' | 'desc' };

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export class BaseModel<T extends Record<string, unknown>> {
  protected table: any;
  protected tableName: string;

  constructor(table: PgTable) {
    this.table = table;
    this.tableName = String((table as any)[Symbol.for('drizzle:Name')] || 'table');
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>): Promise<T> {
    const processedData = await this.beforeCreate(data);
    const result: any = await db.insert(this.table).values(processedData).returning();
    return result[0] as T;
  }

  /**
   * Create multiple records
   */
  async createMany(data: Partial<T>[]): Promise<T[]> {
    const results: any = await db.insert(this.table).values(data).returning();
    return results as T[];
  }

  /**
   * Find a single record by ID
   */
  async findById(id: number | string): Promise<T | null> {
    const result: any = await db.select().from(this.table).where(eq(this.table.id, id)).limit(1);
    return (result[0] as T) || null;
  }

  /**
   * Find a single record by conditions
   */
  async findOne(where: Partial<T>): Promise<T | null> {
    const conditions = this.buildWhereConditions(where);
    const result: any = await db.select().from(this.table).where(conditions).limit(1);
    return (result[0] as T) || null;
  }

  /**
   * Find all records matching conditions
   */
  async findMany(
    where?: Partial<T>,
    options?: {
      orderBy?: OrderBy;
      limit?: number;
      offset?: number;
    },
  ): Promise<T[]> {
    let query: any = db.select().from(this.table);

    if (where) {
      const conditions = this.buildWhereConditions(where);
      query = query.where(conditions);
    }

    if (options?.orderBy) {
      const column = this.table[options.orderBy.column];
      query = query.orderBy(options.orderBy.direction === 'desc' ? sql`${column} DESC` : column);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const results = await query;
    return results as T[];
  }

  /**
   * Find all records
   */
  async findAll(query?: any, limit: number = 10, page: number = 1): Promise<
  { items: T[], pagination: { page: number, limit: number, total: number, totalPages: number } }> {
    let queryBuilder: any = db.select().from(this.table);

    if (query) {
      queryBuilder = queryBuilder.where(this.buildWhereConditions(query));
    }

    const results = await queryBuilder.limit(limit || 10).offset((page - 1) * (limit || 10));

    return {
      items: results as T[],
      pagination: {
        page,
        limit,
        total: results.length,
        totalPages: Math.ceil(results.length / (limit || 10)),
      },
    };
  }

  /**
   * Find with pagination
   */
  async findWithPagination(
    where?: Partial<T>,
    options?: PaginationOptions & { orderBy?: OrderBy },
  ): Promise<PaginationResult<T>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    // Get total count
    let countQuery: any = db.select({ count: sql<number>`count(*)` }).from(this.table);

    if (where) {
      const conditions = this.buildWhereConditions(where);
      countQuery = countQuery.where(conditions);
    }

    const [{ count }] = await countQuery;
    const total = Number(count);

    // Get paginated data
    const data = await this.findMany(where, {
      orderBy: options?.orderBy,
      limit,
      offset,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update a record by ID
   */
  async updateById(id: number | string, data: Partial<T>): Promise<T | null> {
    const processedData = await this.beforeUpdate(data);
    const updateData = {
      ...processedData,
      updatedAt: new Date(),
    };

    const result: any = await db
      .update(this.table)
      .set(updateData)
      .where(eq(this.table.id, id))
      .returning();
    return (result[0] as T) || null;
  }

  /**
   * Update records by conditions
   */
  async updateMany(where: Partial<T>, data: Partial<T>): Promise<T[]> {
    const conditions = this.buildWhereConditions(where);
    const processedData = await this.beforeUpdate(data);
    const updateData = {
      ...processedData,
      updatedAt: new Date(),
    };

    const results: any = await db.update(this.table).set(updateData).where(conditions).returning();
    return results as T[];
  }

  /**
   * Delete a record by ID
   */
  async deleteById(id: number | string): Promise<boolean> {
    const result: any = await db.delete(this.table).where(eq(this.table.id, id)).returning();
    return result.length > 0;
  }

  /**
   * Delete records by conditions
   */
  async deleteMany(where: Partial<T>): Promise<number> {
    const conditions = this.buildWhereConditions(where);
    const result: any = await db.delete(this.table).where(conditions).returning();
    return result.length;
  }

  /**
   * Soft delete (if isActive field exists)
   */ 
  async softDelete(where: Partial<T>): Promise<T | null> {
    const conditions = this.buildWhereConditions(where);
    const result: any = await db.update(this.table).set({ isActive: false }).where(conditions).returning();
    return result[0] as T;
  }

  /**
   * Count records
   */
  async count(where?: Partial<T>): Promise<number> {
    let query: any = db.select({ count: sql<number>`count(*)` }).from(this.table);

    if (where) {
      const conditions = this.buildWhereConditions(where);
      query = query.where(conditions);
    }

    const [{ count }] = await query;
    return Number(count);
  }

  /**
   * Check if record exists
   */
  async exists(where: Partial<T>): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Build WHERE conditions from object
   */
  protected buildWhereConditions(where: Partial<T>): SQL {
    const conditions = Object.entries(where).map(([key, value]) => {
      const column = this.table[key];
      return eq(column, value);
    });

    return conditions.length === 1 ? conditions[0] : and(...conditions)!;
  }

  /**
   * Execute raw SQL query
   */
  async query<R = unknown>(sqlQuery: string): Promise<R[]> {
    const result = await db.execute(sql.raw(sqlQuery));
    return result.rows as R[];
  }

  /**
   * Begin transaction
   */
  async transaction<R>(callback: Parameters<typeof db.transaction>[0]): Promise<R> {
    return (await db.transaction(callback)) as R;
  }

  protected async beforeCreate(data: Partial<T>): Promise<Partial<T>> {
    return data;
  }

  protected async beforeUpdate(data: Partial<T>): Promise<Partial<T>> {
    return data;
  }
}
