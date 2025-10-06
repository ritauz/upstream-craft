import { Deliverable } from '@/domain/entities/deliverable';

export interface IDeliverableRepository {
  getAll(): Deliverable[];
  getById(id: string): Deliverable | undefined;
  getByCategory(category: string): Deliverable[];
  getCategories(): string[];
  getDeliverableTypes(): Array<{ value: string; label: string }>;
}
