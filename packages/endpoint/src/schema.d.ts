import type {
  Schema,
  EntityInterface,
  PolymorphicInterface,
  SchemaClass,
  GetIndex,
  GetEntity,
  CheckLoop,
} from './interface.js';
import type {
  AbstractInstanceType,
  Normalize,
  NormalizeNullable,
  Denormalize,
  DenormalizeNullable,
  DenormalizeObject,
  DenormalizeNullableObject,
  NormalizeObject,
  NormalizedNullableObject,
  EntityMap,
  ObjectArgs,
} from './normal.js';
import { EntityFields } from './schemas/EntityFields.js';
import type {
  IEntityClass,
  IEntityInstance,
  EntityOptions,
  RequiredPKOptions,
  IDClass,
  Constructor,
  PKClass,
} from './schemas/EntityTypes.js';
import { default as Invalidate } from './schemas/Invalidate.js';
import { default as Query } from './schemas/Query.js';
import type {
  CollectionConstructor,
  DefaultArgs,
  SchemaAttributeFunction,
  SchemaFunction,
  UnionResult,
} from './schemaTypes.js';

export { EntityMap, Invalidate, Query };

export type { SchemaClass };

export { EntityInterface } from './interface.js';

export * from './schemaTypes.js';

/**
 * Represents arrays
 * @see https://dataclient.io/rest/api/Array
 */
export class Array<S extends Schema = Schema> implements SchemaClass {
  /**
   * Represents arrays
   * @see https://dataclient.io/rest/api/Array
   */
  constructor(
    definition: S,
    schemaAttribute?: S extends EntityMap<infer T> ?
      keyof T | SchemaFunction<keyof S>
    : undefined,
  );

  define(definition: Schema): void;
  readonly isSingleSchema: S extends EntityMap ? false : true;
  schemaKey(): string;
  readonly schema: S;
  normalize(
    input: any,
    parent: any,
    key: any,
    args: any[],
    visit: (...args: any) => any,
    addEntity: (...args: any) => any,
    getEntity: GetEntity,
    checkLoop: CheckLoop,
  ): (S extends EntityMap ? UnionResult<S> : Normalize<S>)[];

  _normalizeNullable():
    | (S extends EntityMap ? UnionResult<S> : Normalize<S>)[]
    | undefined;

  _denormalizeNullable():
    | (S extends EntityMap<infer T> ? T : Denormalize<S>)[]
    | undefined;

  denormalize(
    input: {},
    args: readonly any[],
    unvisit: (schema: any, input: any) => any,
  ): (S extends EntityMap<infer T> ? T : Denormalize<S>)[];

  queryKey(
    args: readonly any[],
    queryKey: (...args: any) => any,
    getEntity: any,
    getIndex: any,
  ): undefined;
}

/**
 * Retrieves all entities in cache
 *
 * @see https://dataclient.io/rest/api/All
 */
export class All<
  S extends EntityMap | EntityInterface = EntityMap | EntityInterface,
> implements SchemaClass
{
  /**
   * Retrieves all entities in cache
   *
   * @see https://dataclient.io/rest/api/All
   */
  constructor(
    definition: S,
    schemaAttribute?: S extends EntityMap<infer T> ?
      keyof T | SchemaFunction<keyof S>
    : undefined,
  );

  define(definition: Schema): void;
  readonly isSingleSchema: S extends EntityMap ? false : true;
  schemaKey(): string;
  readonly schema: S;
  schemaKey(): string;
  normalize(
    input: any,
    parent: any,
    key: any,
    args: any[],
    visit: (...args: any) => any,
    addEntity: (...args: any) => any,
    getEntity: GetEntity,
    checkLoop: CheckLoop,
  ): (S extends EntityMap ? UnionResult<S> : Normalize<S>)[];

  _normalizeNullable():
    | (S extends EntityMap ? UnionResult<S> : Normalize<S>)[]
    | undefined;

  _denormalizeNullable():
    | (S extends EntityMap<infer T> ? T : Denormalize<S>)[]
    | undefined;

  denormalize(
    input: {},
    args: readonly any[],
    unvisit: (schema: any, input: any) => any,
  ): (S extends EntityMap<infer T> ? T : Denormalize<S>)[];

  queryKey(
    // TODO: hack for now to allow for variable arg combinations with Query
    args: [] | [unknown],
    queryKey: (...args: any) => any,
    getEntity: GetEntity,
    getIndex: GetIndex,
  ): any;
}

/**
 * Represents objects with statically known members
 * @see https://dataclient.io/rest/api/Object
 */
export class Object<O extends Record<string, any> = Record<string, any>>
  implements SchemaClass
{
  /**
   * Represents objects with statically known members
   * @see https://dataclient.io/rest/api/Object
   */
  constructor(definition: O);
  define(definition: Schema): void;
  readonly schema: O;
  normalize(
    input: any,
    parent: any,
    key: any,
    args: any[],
    visit: (...args: any) => any,
    addEntity: (...args: any) => any,
    getEntity: GetEntity,
    checkLoop: CheckLoop,
  ): NormalizeObject<O>;

  _normalizeNullable(): NormalizedNullableObject<O>;

  _denormalizeNullable(): DenormalizeNullableObject<O>;

  denormalize(
    input: {},
    args: readonly any[],
    unvisit: (schema: any, input: any) => any,
  ): DenormalizeObject<O>;

  queryKey(
    args: ObjectArgs<O>,
    queryKey: (...args: any) => any,
    getEntity: GetEntity,
    getIndex: GetIndex,
  ): any;
}

type RequiredMember<
  O extends Record<string | number | symbol, unknown>,
  Required extends keyof O,
> = {
  [K in Required]: O[K];
};

type UnionSchemaToArgs<
  Choices extends EntityMap,
  SchemaAttribute extends
    | keyof AbstractInstanceType<Choices[keyof Choices]>
    | SchemaFunction<keyof Choices>,
> =
  SchemaAttribute extends keyof AbstractInstanceType<Choices[keyof Choices]> ?
    RequiredMember<
      AbstractInstanceType<Choices[keyof Choices]>,
      SchemaAttribute
    >
  : SchemaAttribute extends (value: infer Args, ...rest: any) => unknown ? Args
  : never;

/**
 * Represents polymorphic values.
 * @see https://dataclient.io/rest/api/Union
 */
export interface UnionConstructor {
  /**
   * Represents polymorphic values.
   * @see https://dataclient.io/rest/api/Union
   */
  new <
    Choices extends EntityMap,
    SchemaAttribute extends
      | keyof AbstractInstanceType<Choices[keyof Choices]>
      | SchemaFunction<keyof Choices>,
  >(
    definition: Choices,
    schemaAttribute: SchemaAttribute,
  ): UnionInstance<
    Choices,
    UnionSchemaToArgs<Choices, SchemaAttribute> &
      Partial<AbstractInstanceType<Choices[keyof Choices]>>
  >;

  readonly prototype: UnionInstance;
}

/**
 * Represents polymorphic values.
 * @see https://dataclient.io/rest/api/Union
 */
export interface UnionInstance<
  Choices extends EntityMap = any,
  Args extends EntityFields<
    AbstractInstanceType<Choices[keyof Choices]>
  > = EntityFields<AbstractInstanceType<Choices[keyof Choices]>>,
> {
  define(definition: Schema): void;
  inferSchema: SchemaAttributeFunction<Choices[keyof Choices]>;
  getSchemaAttribute: SchemaFunction<keyof Choices>;
  schemaKey(): string;
  readonly schema: Choices;
  normalize(
    input: any,
    parent: any,
    key: any,
    args: any[],
    visit: (...args: any) => any,
    addEntity: (...args: any) => any,
    getEntity: GetEntity,
    checkLoop: CheckLoop,
  ): UnionResult<Choices>;

  _normalizeNullable(): UnionResult<Choices> | undefined;

  _denormalizeNullable():
    | AbstractInstanceType<Choices[keyof Choices]>
    | undefined;

  denormalize(
    input: {},
    args: readonly any[],
    unvisit: (schema: any, input: any) => any,
  ): AbstractInstanceType<Choices[keyof Choices]>;

  queryKey(
    args: [Args],
    queryKey: (...args: any) => any,
    getEntity: GetEntity,
    getIndex: GetIndex,
  ): { id: any; schema: string };
}

/**
 * Represents polymorphic values.
 * @see https://dataclient.io/rest/api/Union
 */
export declare let UnionRoot: UnionConstructor;

/**
 * Represents polymorphic values.
 * @see https://dataclient.io/rest/api/Union
 */
export declare class Union<
  Choices extends EntityMap,
  SchemaAttribute extends
    | keyof AbstractInstanceType<Choices[keyof Choices]>
    | SchemaFunction<keyof Choices>,
> extends UnionRoot<Choices, SchemaAttribute> {}

/**
 * Represents variably sized objects
 * @see https://dataclient.io/rest/api/Values
 */
export class Values<Choices extends Schema = any> implements SchemaClass {
  /**
   * Represents variably sized objects
   * @see https://dataclient.io/rest/api/Values
   */
  constructor(
    definition: Choices,
    schemaAttribute?: Choices extends EntityMap<infer T> ?
      keyof T | SchemaFunction<keyof Choices>
    : undefined,
  );

  define(definition: Schema): void;
  readonly isSingleSchema: Choices extends EntityMap ? false : true;
  schemaKey(): string;
  inferSchema: SchemaAttributeFunction<
    Choices extends EntityMap ? Choices[keyof Choices] : Choices
  >;

  getSchemaAttribute: Choices extends EntityMap ? SchemaFunction<keyof Choices>
  : false;

  readonly schema: Choices;
  normalize(
    input: any,
    parent: any,
    key: any,
    args: any[],
    visit: (...args: any) => any,
    addEntity: (...args: any) => any,
    getEntity: GetEntity,
    checkLoop: CheckLoop,
  ): Record<
    string,
    Choices extends EntityMap ? UnionResult<Choices> : Normalize<Choices>
  >;

  _normalizeNullable():
    | Record<
        string,
        Choices extends EntityMap ? UnionResult<Choices>
        : NormalizeNullable<Choices>
      >
    | undefined;

  _denormalizeNullable(): Record<
    string,
    Choices extends EntityMap<infer T> ? T | undefined
    : DenormalizeNullable<Choices>
  >;

  denormalize(
    input: {},
    args: readonly any[],
    unvisit: (schema: any, input: any) => any,
  ): Record<
    string,
    Choices extends EntityMap<infer T> ? T : Denormalize<Choices>
  >;

  queryKey(
    args: readonly any[],
    queryKey: (...args: any) => any,
    getEntity: GetEntity,
    getIndex: GetIndex,
  ): undefined;
}

export type CollectionArrayAdder<S extends PolymorphicInterface> =
  S extends (
    {
      // ensure we are an array type
      denormalize(...args: any): any[];
      // get what we are an array of
      schema: infer T;
    }
  ) ?
    // TODO: eventually we want to allow singular or list and infer the return based on arguments
    T
  : never;

export declare let CollectionRoot: CollectionConstructor;

/**
 * Entities but for Arrays instead of classes
 * @see https://dataclient.io/rest/api/Collection
 */
export declare class Collection<
  S extends any[] | PolymorphicInterface = any,
  Args extends any[] = DefaultArgs,
  Parent = any,
> extends CollectionRoot<S, Args, Parent> {}

/**
 * Entity defines a single (globally) unique object.
 * @see https://dataclient.io/rest/api/schema.Entity
 */
export function Entity<TBase extends PKClass>(
  Base: TBase,
  opt?: EntityOptions<InstanceType<TBase>>,
): IEntityClass<TBase> & TBase;

// id is in Instance, so we default to that as pk
export function Entity<TBase extends IDClass>(
  Base: TBase,
  opt?: EntityOptions<InstanceType<TBase>>,
): IEntityClass<TBase> & TBase & (new (...args: any[]) => IEntityInstance);

// pk was specified in options, so we don't need to redefine
export function Entity<TBase extends Constructor>(
  Base: TBase,
  opt: RequiredPKOptions<InstanceType<TBase>>,
): IEntityClass<TBase> & TBase & (new (...args: any[]) => IEntityInstance);

/* TODO: figure out how to make abstract class mixins work. until then we will require PK in options
export function Entity<TBase extends Constructor>(
  Base: TBase,
  opt?: EntityOptions<keyof InstanceType<TBase>>,
): (abstract new (...args: any[]) => {
  pk(parent?: any, key?: string): string | number | undefined;
}) &
  IEntityClass<TBase> &
  TBase;
*/
