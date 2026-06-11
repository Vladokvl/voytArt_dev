
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Author
 * 
 */
export type Author = $Result.DefaultSelection<Prisma.$AuthorPayload>
/**
 * Model Collection
 * 
 */
export type Collection = $Result.DefaultSelection<Prisma.$CollectionPayload>
/**
 * Model Painting
 * 
 */
export type Painting = $Result.DefaultSelection<Prisma.$PaintingPayload>
/**
 * Model PaintingMedia
 * 
 */
export type PaintingMedia = $Result.DefaultSelection<Prisma.$PaintingMediaPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ProductImage
 * 
 */
export type ProductImage = $Result.DefaultSelection<Prisma.$ProductImagePayload>
/**
 * Model GalleryPost
 * 
 */
export type GalleryPost = $Result.DefaultSelection<Prisma.$GalleryPostPayload>
/**
 * Model GalleryPostMedia
 * 
 */
export type GalleryPostMedia = $Result.DefaultSelection<Prisma.$GalleryPostMediaPayload>
/**
 * Model AdminUser
 * 
 */
export type AdminUser = $Result.DefaultSelection<Prisma.$AdminUserPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MediaType: {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO'
};

export type MediaType = (typeof MediaType)[keyof typeof MediaType]

}

export type MediaType = $Enums.MediaType

export const MediaType: typeof $Enums.MediaType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Authors
 * const authors = await prisma.author.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Authors
   * const authors = await prisma.author.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.author`: Exposes CRUD operations for the **Author** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Authors
    * const authors = await prisma.author.findMany()
    * ```
    */
  get author(): Prisma.AuthorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.collection`: Exposes CRUD operations for the **Collection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Collections
    * const collections = await prisma.collection.findMany()
    * ```
    */
  get collection(): Prisma.CollectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.painting`: Exposes CRUD operations for the **Painting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Paintings
    * const paintings = await prisma.painting.findMany()
    * ```
    */
  get painting(): Prisma.PaintingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paintingMedia`: Exposes CRUD operations for the **PaintingMedia** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaintingMedias
    * const paintingMedias = await prisma.paintingMedia.findMany()
    * ```
    */
  get paintingMedia(): Prisma.PaintingMediaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productImage`: Exposes CRUD operations for the **ProductImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductImages
    * const productImages = await prisma.productImage.findMany()
    * ```
    */
  get productImage(): Prisma.ProductImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.galleryPost`: Exposes CRUD operations for the **GalleryPost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GalleryPosts
    * const galleryPosts = await prisma.galleryPost.findMany()
    * ```
    */
  get galleryPost(): Prisma.GalleryPostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.galleryPostMedia`: Exposes CRUD operations for the **GalleryPostMedia** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GalleryPostMedias
    * const galleryPostMedias = await prisma.galleryPostMedia.findMany()
    * ```
    */
  get galleryPostMedia(): Prisma.GalleryPostMediaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.adminUser`: Exposes CRUD operations for the **AdminUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminUsers
    * const adminUsers = await prisma.adminUser.findMany()
    * ```
    */
  get adminUser(): Prisma.AdminUserDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Author: 'Author',
    Collection: 'Collection',
    Painting: 'Painting',
    PaintingMedia: 'PaintingMedia',
    Category: 'Category',
    Product: 'Product',
    ProductImage: 'ProductImage',
    GalleryPost: 'GalleryPost',
    GalleryPostMedia: 'GalleryPostMedia',
    AdminUser: 'AdminUser'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "author" | "collection" | "painting" | "paintingMedia" | "category" | "product" | "productImage" | "galleryPost" | "galleryPostMedia" | "adminUser"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Author: {
        payload: Prisma.$AuthorPayload<ExtArgs>
        fields: Prisma.AuthorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          findFirst: {
            args: Prisma.AuthorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          findMany: {
            args: Prisma.AuthorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>[]
          }
          create: {
            args: Prisma.AuthorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          createMany: {
            args: Prisma.AuthorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>[]
          }
          delete: {
            args: Prisma.AuthorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          update: {
            args: Prisma.AuthorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          deleteMany: {
            args: Prisma.AuthorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>[]
          }
          upsert: {
            args: Prisma.AuthorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthorPayload>
          }
          aggregate: {
            args: Prisma.AuthorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthor>
          }
          groupBy: {
            args: Prisma.AuthorGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthorGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthorCountArgs<ExtArgs>
            result: $Utils.Optional<AuthorCountAggregateOutputType> | number
          }
        }
      }
      Collection: {
        payload: Prisma.$CollectionPayload<ExtArgs>
        fields: Prisma.CollectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CollectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CollectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          findFirst: {
            args: Prisma.CollectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CollectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          findMany: {
            args: Prisma.CollectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>[]
          }
          create: {
            args: Prisma.CollectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          createMany: {
            args: Prisma.CollectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CollectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>[]
          }
          delete: {
            args: Prisma.CollectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          update: {
            args: Prisma.CollectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          deleteMany: {
            args: Prisma.CollectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CollectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CollectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>[]
          }
          upsert: {
            args: Prisma.CollectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          aggregate: {
            args: Prisma.CollectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCollection>
          }
          groupBy: {
            args: Prisma.CollectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CollectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CollectionCountArgs<ExtArgs>
            result: $Utils.Optional<CollectionCountAggregateOutputType> | number
          }
        }
      }
      Painting: {
        payload: Prisma.$PaintingPayload<ExtArgs>
        fields: Prisma.PaintingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaintingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaintingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>
          }
          findFirst: {
            args: Prisma.PaintingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaintingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>
          }
          findMany: {
            args: Prisma.PaintingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>[]
          }
          create: {
            args: Prisma.PaintingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>
          }
          createMany: {
            args: Prisma.PaintingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaintingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>[]
          }
          delete: {
            args: Prisma.PaintingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>
          }
          update: {
            args: Prisma.PaintingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>
          }
          deleteMany: {
            args: Prisma.PaintingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaintingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaintingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>[]
          }
          upsert: {
            args: Prisma.PaintingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingPayload>
          }
          aggregate: {
            args: Prisma.PaintingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePainting>
          }
          groupBy: {
            args: Prisma.PaintingGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaintingGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaintingCountArgs<ExtArgs>
            result: $Utils.Optional<PaintingCountAggregateOutputType> | number
          }
        }
      }
      PaintingMedia: {
        payload: Prisma.$PaintingMediaPayload<ExtArgs>
        fields: Prisma.PaintingMediaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaintingMediaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaintingMediaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>
          }
          findFirst: {
            args: Prisma.PaintingMediaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaintingMediaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>
          }
          findMany: {
            args: Prisma.PaintingMediaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>[]
          }
          create: {
            args: Prisma.PaintingMediaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>
          }
          createMany: {
            args: Prisma.PaintingMediaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaintingMediaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>[]
          }
          delete: {
            args: Prisma.PaintingMediaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>
          }
          update: {
            args: Prisma.PaintingMediaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>
          }
          deleteMany: {
            args: Prisma.PaintingMediaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaintingMediaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaintingMediaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>[]
          }
          upsert: {
            args: Prisma.PaintingMediaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaintingMediaPayload>
          }
          aggregate: {
            args: Prisma.PaintingMediaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaintingMedia>
          }
          groupBy: {
            args: Prisma.PaintingMediaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaintingMediaGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaintingMediaCountArgs<ExtArgs>
            result: $Utils.Optional<PaintingMediaCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ProductImage: {
        payload: Prisma.$ProductImagePayload<ExtArgs>
        fields: Prisma.ProductImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          findFirst: {
            args: Prisma.ProductImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          findMany: {
            args: Prisma.ProductImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>[]
          }
          create: {
            args: Prisma.ProductImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          createMany: {
            args: Prisma.ProductImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>[]
          }
          delete: {
            args: Prisma.ProductImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          update: {
            args: Prisma.ProductImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          deleteMany: {
            args: Prisma.ProductImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductImageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>[]
          }
          upsert: {
            args: Prisma.ProductImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          aggregate: {
            args: Prisma.ProductImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductImage>
          }
          groupBy: {
            args: Prisma.ProductImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductImageCountArgs<ExtArgs>
            result: $Utils.Optional<ProductImageCountAggregateOutputType> | number
          }
        }
      }
      GalleryPost: {
        payload: Prisma.$GalleryPostPayload<ExtArgs>
        fields: Prisma.GalleryPostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GalleryPostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GalleryPostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>
          }
          findFirst: {
            args: Prisma.GalleryPostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GalleryPostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>
          }
          findMany: {
            args: Prisma.GalleryPostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>[]
          }
          create: {
            args: Prisma.GalleryPostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>
          }
          createMany: {
            args: Prisma.GalleryPostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GalleryPostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>[]
          }
          delete: {
            args: Prisma.GalleryPostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>
          }
          update: {
            args: Prisma.GalleryPostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>
          }
          deleteMany: {
            args: Prisma.GalleryPostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GalleryPostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GalleryPostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>[]
          }
          upsert: {
            args: Prisma.GalleryPostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostPayload>
          }
          aggregate: {
            args: Prisma.GalleryPostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGalleryPost>
          }
          groupBy: {
            args: Prisma.GalleryPostGroupByArgs<ExtArgs>
            result: $Utils.Optional<GalleryPostGroupByOutputType>[]
          }
          count: {
            args: Prisma.GalleryPostCountArgs<ExtArgs>
            result: $Utils.Optional<GalleryPostCountAggregateOutputType> | number
          }
        }
      }
      GalleryPostMedia: {
        payload: Prisma.$GalleryPostMediaPayload<ExtArgs>
        fields: Prisma.GalleryPostMediaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GalleryPostMediaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GalleryPostMediaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>
          }
          findFirst: {
            args: Prisma.GalleryPostMediaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GalleryPostMediaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>
          }
          findMany: {
            args: Prisma.GalleryPostMediaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>[]
          }
          create: {
            args: Prisma.GalleryPostMediaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>
          }
          createMany: {
            args: Prisma.GalleryPostMediaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GalleryPostMediaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>[]
          }
          delete: {
            args: Prisma.GalleryPostMediaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>
          }
          update: {
            args: Prisma.GalleryPostMediaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>
          }
          deleteMany: {
            args: Prisma.GalleryPostMediaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GalleryPostMediaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GalleryPostMediaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>[]
          }
          upsert: {
            args: Prisma.GalleryPostMediaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPostMediaPayload>
          }
          aggregate: {
            args: Prisma.GalleryPostMediaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGalleryPostMedia>
          }
          groupBy: {
            args: Prisma.GalleryPostMediaGroupByArgs<ExtArgs>
            result: $Utils.Optional<GalleryPostMediaGroupByOutputType>[]
          }
          count: {
            args: Prisma.GalleryPostMediaCountArgs<ExtArgs>
            result: $Utils.Optional<GalleryPostMediaCountAggregateOutputType> | number
          }
        }
      }
      AdminUser: {
        payload: Prisma.$AdminUserPayload<ExtArgs>
        fields: Prisma.AdminUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          findFirst: {
            args: Prisma.AdminUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          findMany: {
            args: Prisma.AdminUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          create: {
            args: Prisma.AdminUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          createMany: {
            args: Prisma.AdminUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          delete: {
            args: Prisma.AdminUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          update: {
            args: Prisma.AdminUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          deleteMany: {
            args: Prisma.AdminUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          upsert: {
            args: Prisma.AdminUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          aggregate: {
            args: Prisma.AdminUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminUser>
          }
          groupBy: {
            args: Prisma.AdminUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminUserCountArgs<ExtArgs>
            result: $Utils.Optional<AdminUserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    author?: AuthorOmit
    collection?: CollectionOmit
    painting?: PaintingOmit
    paintingMedia?: PaintingMediaOmit
    category?: CategoryOmit
    product?: ProductOmit
    productImage?: ProductImageOmit
    galleryPost?: GalleryPostOmit
    galleryPostMedia?: GalleryPostMediaOmit
    adminUser?: AdminUserOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AuthorCountOutputType
   */

  export type AuthorCountOutputType = {
    paintings: number
    collections: number
    products: number
  }

  export type AuthorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paintings?: boolean | AuthorCountOutputTypeCountPaintingsArgs
    collections?: boolean | AuthorCountOutputTypeCountCollectionsArgs
    products?: boolean | AuthorCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * AuthorCountOutputType without action
   */
  export type AuthorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthorCountOutputType
     */
    select?: AuthorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuthorCountOutputType without action
   */
  export type AuthorCountOutputTypeCountPaintingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaintingWhereInput
  }

  /**
   * AuthorCountOutputType without action
   */
  export type AuthorCountOutputTypeCountCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionWhereInput
  }

  /**
   * AuthorCountOutputType without action
   */
  export type AuthorCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type CollectionCountOutputType
   */

  export type CollectionCountOutputType = {
    paintings: number
  }

  export type CollectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paintings?: boolean | CollectionCountOutputTypeCountPaintingsArgs
  }

  // Custom InputTypes
  /**
   * CollectionCountOutputType without action
   */
  export type CollectionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCountOutputType
     */
    select?: CollectionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CollectionCountOutputType without action
   */
  export type CollectionCountOutputTypeCountPaintingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaintingWhereInput
  }


  /**
   * Count Type PaintingCountOutputType
   */

  export type PaintingCountOutputType = {
    media: number
  }

  export type PaintingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | PaintingCountOutputTypeCountMediaArgs
  }

  // Custom InputTypes
  /**
   * PaintingCountOutputType without action
   */
  export type PaintingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingCountOutputType
     */
    select?: PaintingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PaintingCountOutputType without action
   */
  export type PaintingCountOutputTypeCountMediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaintingMediaWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    products: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | CategoryCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    images: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | ProductCountOutputTypeCountImagesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductImageWhereInput
  }


  /**
   * Count Type GalleryPostCountOutputType
   */

  export type GalleryPostCountOutputType = {
    media: number
  }

  export type GalleryPostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | GalleryPostCountOutputTypeCountMediaArgs
  }

  // Custom InputTypes
  /**
   * GalleryPostCountOutputType without action
   */
  export type GalleryPostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostCountOutputType
     */
    select?: GalleryPostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GalleryPostCountOutputType without action
   */
  export type GalleryPostCountOutputTypeCountMediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryPostMediaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Author
   */

  export type AggregateAuthor = {
    _count: AuthorCountAggregateOutputType | null
    _avg: AuthorAvgAggregateOutputType | null
    _sum: AuthorSumAggregateOutputType | null
    _min: AuthorMinAggregateOutputType | null
    _max: AuthorMaxAggregateOutputType | null
  }

  export type AuthorAvgAggregateOutputType = {
    id: number | null
  }

  export type AuthorSumAggregateOutputType = {
    id: number | null
  }

  export type AuthorMinAggregateOutputType = {
    id: number | null
    firstName: string | null
    lastName: string | null
    bio: string | null
    photoUrl: string | null
    photoPublicId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthorMaxAggregateOutputType = {
    id: number | null
    firstName: string | null
    lastName: string | null
    bio: string | null
    photoUrl: string | null
    photoPublicId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthorCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    bio: number
    photoUrl: number
    photoPublicId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthorAvgAggregateInputType = {
    id?: true
  }

  export type AuthorSumAggregateInputType = {
    id?: true
  }

  export type AuthorMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    bio?: true
    photoUrl?: true
    photoPublicId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthorMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    bio?: true
    photoUrl?: true
    photoPublicId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthorCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    bio?: true
    photoUrl?: true
    photoPublicId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Author to aggregate.
     */
    where?: AuthorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authors to fetch.
     */
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Authors
    **/
    _count?: true | AuthorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthorMaxAggregateInputType
  }

  export type GetAuthorAggregateType<T extends AuthorAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthor[P]>
      : GetScalarType<T[P], AggregateAuthor[P]>
  }




  export type AuthorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthorWhereInput
    orderBy?: AuthorOrderByWithAggregationInput | AuthorOrderByWithAggregationInput[]
    by: AuthorScalarFieldEnum[] | AuthorScalarFieldEnum
    having?: AuthorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthorCountAggregateInputType | true
    _avg?: AuthorAvgAggregateInputType
    _sum?: AuthorSumAggregateInputType
    _min?: AuthorMinAggregateInputType
    _max?: AuthorMaxAggregateInputType
  }

  export type AuthorGroupByOutputType = {
    id: number
    firstName: string
    lastName: string
    bio: string | null
    photoUrl: string | null
    photoPublicId: string
    createdAt: Date
    updatedAt: Date
    _count: AuthorCountAggregateOutputType | null
    _avg: AuthorAvgAggregateOutputType | null
    _sum: AuthorSumAggregateOutputType | null
    _min: AuthorMinAggregateOutputType | null
    _max: AuthorMaxAggregateOutputType | null
  }

  type GetAuthorGroupByPayload<T extends AuthorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthorGroupByOutputType[P]>
            : GetScalarType<T[P], AuthorGroupByOutputType[P]>
        }
      >
    >


  export type AuthorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    bio?: boolean
    photoUrl?: boolean
    photoPublicId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    paintings?: boolean | Author$paintingsArgs<ExtArgs>
    collections?: boolean | Author$collectionsArgs<ExtArgs>
    products?: boolean | Author$productsArgs<ExtArgs>
    _count?: boolean | AuthorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["author"]>

  export type AuthorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    bio?: boolean
    photoUrl?: boolean
    photoPublicId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["author"]>

  export type AuthorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    bio?: boolean
    photoUrl?: boolean
    photoPublicId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["author"]>

  export type AuthorSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    bio?: boolean
    photoUrl?: boolean
    photoPublicId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firstName" | "lastName" | "bio" | "photoUrl" | "photoPublicId" | "createdAt" | "updatedAt", ExtArgs["result"]["author"]>
  export type AuthorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paintings?: boolean | Author$paintingsArgs<ExtArgs>
    collections?: boolean | Author$collectionsArgs<ExtArgs>
    products?: boolean | Author$productsArgs<ExtArgs>
    _count?: boolean | AuthorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuthorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AuthorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AuthorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Author"
    objects: {
      paintings: Prisma.$PaintingPayload<ExtArgs>[]
      collections: Prisma.$CollectionPayload<ExtArgs>[]
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      firstName: string
      lastName: string
      bio: string | null
      photoUrl: string | null
      photoPublicId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["author"]>
    composites: {}
  }

  type AuthorGetPayload<S extends boolean | null | undefined | AuthorDefaultArgs> = $Result.GetResult<Prisma.$AuthorPayload, S>

  type AuthorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthorCountAggregateInputType | true
    }

  export interface AuthorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Author'], meta: { name: 'Author' } }
    /**
     * Find zero or one Author that matches the filter.
     * @param {AuthorFindUniqueArgs} args - Arguments to find a Author
     * @example
     * // Get one Author
     * const author = await prisma.author.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthorFindUniqueArgs>(args: SelectSubset<T, AuthorFindUniqueArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Author that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthorFindUniqueOrThrowArgs} args - Arguments to find a Author
     * @example
     * // Get one Author
     * const author = await prisma.author.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthorFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Author that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorFindFirstArgs} args - Arguments to find a Author
     * @example
     * // Get one Author
     * const author = await prisma.author.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthorFindFirstArgs>(args?: SelectSubset<T, AuthorFindFirstArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Author that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorFindFirstOrThrowArgs} args - Arguments to find a Author
     * @example
     * // Get one Author
     * const author = await prisma.author.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthorFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthorFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Authors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Authors
     * const authors = await prisma.author.findMany()
     * 
     * // Get first 10 Authors
     * const authors = await prisma.author.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authorWithIdOnly = await prisma.author.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthorFindManyArgs>(args?: SelectSubset<T, AuthorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Author.
     * @param {AuthorCreateArgs} args - Arguments to create a Author.
     * @example
     * // Create one Author
     * const Author = await prisma.author.create({
     *   data: {
     *     // ... data to create a Author
     *   }
     * })
     * 
     */
    create<T extends AuthorCreateArgs>(args: SelectSubset<T, AuthorCreateArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Authors.
     * @param {AuthorCreateManyArgs} args - Arguments to create many Authors.
     * @example
     * // Create many Authors
     * const author = await prisma.author.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthorCreateManyArgs>(args?: SelectSubset<T, AuthorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Authors and returns the data saved in the database.
     * @param {AuthorCreateManyAndReturnArgs} args - Arguments to create many Authors.
     * @example
     * // Create many Authors
     * const author = await prisma.author.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Authors and only return the `id`
     * const authorWithIdOnly = await prisma.author.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthorCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Author.
     * @param {AuthorDeleteArgs} args - Arguments to delete one Author.
     * @example
     * // Delete one Author
     * const Author = await prisma.author.delete({
     *   where: {
     *     // ... filter to delete one Author
     *   }
     * })
     * 
     */
    delete<T extends AuthorDeleteArgs>(args: SelectSubset<T, AuthorDeleteArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Author.
     * @param {AuthorUpdateArgs} args - Arguments to update one Author.
     * @example
     * // Update one Author
     * const author = await prisma.author.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthorUpdateArgs>(args: SelectSubset<T, AuthorUpdateArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Authors.
     * @param {AuthorDeleteManyArgs} args - Arguments to filter Authors to delete.
     * @example
     * // Delete a few Authors
     * const { count } = await prisma.author.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthorDeleteManyArgs>(args?: SelectSubset<T, AuthorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Authors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Authors
     * const author = await prisma.author.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthorUpdateManyArgs>(args: SelectSubset<T, AuthorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Authors and returns the data updated in the database.
     * @param {AuthorUpdateManyAndReturnArgs} args - Arguments to update many Authors.
     * @example
     * // Update many Authors
     * const author = await prisma.author.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Authors and only return the `id`
     * const authorWithIdOnly = await prisma.author.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthorUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Author.
     * @param {AuthorUpsertArgs} args - Arguments to update or create a Author.
     * @example
     * // Update or create a Author
     * const author = await prisma.author.upsert({
     *   create: {
     *     // ... data to create a Author
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Author we want to update
     *   }
     * })
     */
    upsert<T extends AuthorUpsertArgs>(args: SelectSubset<T, AuthorUpsertArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Authors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorCountArgs} args - Arguments to filter Authors to count.
     * @example
     * // Count the number of Authors
     * const count = await prisma.author.count({
     *   where: {
     *     // ... the filter for the Authors we want to count
     *   }
     * })
    **/
    count<T extends AuthorCountArgs>(
      args?: Subset<T, AuthorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Author.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthorAggregateArgs>(args: Subset<T, AuthorAggregateArgs>): Prisma.PrismaPromise<GetAuthorAggregateType<T>>

    /**
     * Group by Author.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthorGroupByArgs['orderBy'] }
        : { orderBy?: AuthorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Author model
   */
  readonly fields: AuthorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Author.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    paintings<T extends Author$paintingsArgs<ExtArgs> = {}>(args?: Subset<T, Author$paintingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collections<T extends Author$collectionsArgs<ExtArgs> = {}>(args?: Subset<T, Author$collectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    products<T extends Author$productsArgs<ExtArgs> = {}>(args?: Subset<T, Author$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Author model
   */
  interface AuthorFieldRefs {
    readonly id: FieldRef<"Author", 'Int'>
    readonly firstName: FieldRef<"Author", 'String'>
    readonly lastName: FieldRef<"Author", 'String'>
    readonly bio: FieldRef<"Author", 'String'>
    readonly photoUrl: FieldRef<"Author", 'String'>
    readonly photoPublicId: FieldRef<"Author", 'String'>
    readonly createdAt: FieldRef<"Author", 'DateTime'>
    readonly updatedAt: FieldRef<"Author", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Author findUnique
   */
  export type AuthorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Author to fetch.
     */
    where: AuthorWhereUniqueInput
  }

  /**
   * Author findUniqueOrThrow
   */
  export type AuthorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Author to fetch.
     */
    where: AuthorWhereUniqueInput
  }

  /**
   * Author findFirst
   */
  export type AuthorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Author to fetch.
     */
    where?: AuthorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authors to fetch.
     */
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Authors.
     */
    cursor?: AuthorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authors.
     */
    distinct?: AuthorScalarFieldEnum | AuthorScalarFieldEnum[]
  }

  /**
   * Author findFirstOrThrow
   */
  export type AuthorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Author to fetch.
     */
    where?: AuthorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authors to fetch.
     */
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Authors.
     */
    cursor?: AuthorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authors.
     */
    distinct?: AuthorScalarFieldEnum | AuthorScalarFieldEnum[]
  }

  /**
   * Author findMany
   */
  export type AuthorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter, which Authors to fetch.
     */
    where?: AuthorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authors to fetch.
     */
    orderBy?: AuthorOrderByWithRelationInput | AuthorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Authors.
     */
    cursor?: AuthorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authors.
     */
    distinct?: AuthorScalarFieldEnum | AuthorScalarFieldEnum[]
  }

  /**
   * Author create
   */
  export type AuthorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * The data needed to create a Author.
     */
    data: XOR<AuthorCreateInput, AuthorUncheckedCreateInput>
  }

  /**
   * Author createMany
   */
  export type AuthorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Authors.
     */
    data: AuthorCreateManyInput | AuthorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Author createManyAndReturn
   */
  export type AuthorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * The data used to create many Authors.
     */
    data: AuthorCreateManyInput | AuthorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Author update
   */
  export type AuthorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * The data needed to update a Author.
     */
    data: XOR<AuthorUpdateInput, AuthorUncheckedUpdateInput>
    /**
     * Choose, which Author to update.
     */
    where: AuthorWhereUniqueInput
  }

  /**
   * Author updateMany
   */
  export type AuthorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Authors.
     */
    data: XOR<AuthorUpdateManyMutationInput, AuthorUncheckedUpdateManyInput>
    /**
     * Filter which Authors to update
     */
    where?: AuthorWhereInput
    /**
     * Limit how many Authors to update.
     */
    limit?: number
  }

  /**
   * Author updateManyAndReturn
   */
  export type AuthorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * The data used to update Authors.
     */
    data: XOR<AuthorUpdateManyMutationInput, AuthorUncheckedUpdateManyInput>
    /**
     * Filter which Authors to update
     */
    where?: AuthorWhereInput
    /**
     * Limit how many Authors to update.
     */
    limit?: number
  }

  /**
   * Author upsert
   */
  export type AuthorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * The filter to search for the Author to update in case it exists.
     */
    where: AuthorWhereUniqueInput
    /**
     * In case the Author found by the `where` argument doesn't exist, create a new Author with this data.
     */
    create: XOR<AuthorCreateInput, AuthorUncheckedCreateInput>
    /**
     * In case the Author was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthorUpdateInput, AuthorUncheckedUpdateInput>
  }

  /**
   * Author delete
   */
  export type AuthorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
    /**
     * Filter which Author to delete.
     */
    where: AuthorWhereUniqueInput
  }

  /**
   * Author deleteMany
   */
  export type AuthorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Authors to delete
     */
    where?: AuthorWhereInput
    /**
     * Limit how many Authors to delete.
     */
    limit?: number
  }

  /**
   * Author.paintings
   */
  export type Author$paintingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    where?: PaintingWhereInput
    orderBy?: PaintingOrderByWithRelationInput | PaintingOrderByWithRelationInput[]
    cursor?: PaintingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaintingScalarFieldEnum | PaintingScalarFieldEnum[]
  }

  /**
   * Author.collections
   */
  export type Author$collectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    where?: CollectionWhereInput
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    cursor?: CollectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Author.products
   */
  export type Author$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Author without action
   */
  export type AuthorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Author
     */
    select?: AuthorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Author
     */
    omit?: AuthorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthorInclude<ExtArgs> | null
  }


  /**
   * Model Collection
   */

  export type AggregateCollection = {
    _count: CollectionCountAggregateOutputType | null
    _avg: CollectionAvgAggregateOutputType | null
    _sum: CollectionSumAggregateOutputType | null
    _min: CollectionMinAggregateOutputType | null
    _max: CollectionMaxAggregateOutputType | null
  }

  export type CollectionAvgAggregateOutputType = {
    id: number | null
    authorId: number | null
  }

  export type CollectionSumAggregateOutputType = {
    id: number | null
    authorId: number | null
  }

  export type CollectionMinAggregateOutputType = {
    id: number | null
    title: string | null
    coverPhotoUrl: string | null
    coverPhotoPublicId: string | null
    authorId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollectionMaxAggregateOutputType = {
    id: number | null
    title: string | null
    coverPhotoUrl: string | null
    coverPhotoPublicId: string | null
    authorId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollectionCountAggregateOutputType = {
    id: number
    title: number
    coverPhotoUrl: number
    coverPhotoPublicId: number
    authorId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CollectionAvgAggregateInputType = {
    id?: true
    authorId?: true
  }

  export type CollectionSumAggregateInputType = {
    id?: true
    authorId?: true
  }

  export type CollectionMinAggregateInputType = {
    id?: true
    title?: true
    coverPhotoUrl?: true
    coverPhotoPublicId?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollectionMaxAggregateInputType = {
    id?: true
    title?: true
    coverPhotoUrl?: true
    coverPhotoPublicId?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollectionCountAggregateInputType = {
    id?: true
    title?: true
    coverPhotoUrl?: true
    coverPhotoPublicId?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CollectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Collection to aggregate.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Collections
    **/
    _count?: true | CollectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CollectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CollectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollectionMaxAggregateInputType
  }

  export type GetCollectionAggregateType<T extends CollectionAggregateArgs> = {
        [P in keyof T & keyof AggregateCollection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollection[P]>
      : GetScalarType<T[P], AggregateCollection[P]>
  }




  export type CollectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionWhereInput
    orderBy?: CollectionOrderByWithAggregationInput | CollectionOrderByWithAggregationInput[]
    by: CollectionScalarFieldEnum[] | CollectionScalarFieldEnum
    having?: CollectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollectionCountAggregateInputType | true
    _avg?: CollectionAvgAggregateInputType
    _sum?: CollectionSumAggregateInputType
    _min?: CollectionMinAggregateInputType
    _max?: CollectionMaxAggregateInputType
  }

  export type CollectionGroupByOutputType = {
    id: number
    title: string
    coverPhotoUrl: string | null
    coverPhotoPublicId: string
    authorId: number
    createdAt: Date
    updatedAt: Date
    _count: CollectionCountAggregateOutputType | null
    _avg: CollectionAvgAggregateOutputType | null
    _sum: CollectionSumAggregateOutputType | null
    _min: CollectionMinAggregateOutputType | null
    _max: CollectionMaxAggregateOutputType | null
  }

  type GetCollectionGroupByPayload<T extends CollectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CollectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollectionGroupByOutputType[P]>
            : GetScalarType<T[P], CollectionGroupByOutputType[P]>
        }
      >
    >


  export type CollectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    coverPhotoUrl?: boolean
    coverPhotoPublicId?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    paintings?: boolean | Collection$paintingsArgs<ExtArgs>
    _count?: boolean | CollectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collection"]>

  export type CollectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    coverPhotoUrl?: boolean
    coverPhotoPublicId?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | AuthorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collection"]>

  export type CollectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    coverPhotoUrl?: boolean
    coverPhotoPublicId?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | AuthorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collection"]>

  export type CollectionSelectScalar = {
    id?: boolean
    title?: boolean
    coverPhotoUrl?: boolean
    coverPhotoPublicId?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CollectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "coverPhotoUrl" | "coverPhotoPublicId" | "authorId" | "createdAt" | "updatedAt", ExtArgs["result"]["collection"]>
  export type CollectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    paintings?: boolean | Collection$paintingsArgs<ExtArgs>
    _count?: boolean | CollectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CollectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | AuthorDefaultArgs<ExtArgs>
  }
  export type CollectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | AuthorDefaultArgs<ExtArgs>
  }

  export type $CollectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Collection"
    objects: {
      author: Prisma.$AuthorPayload<ExtArgs>
      paintings: Prisma.$PaintingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      coverPhotoUrl: string | null
      coverPhotoPublicId: string
      authorId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["collection"]>
    composites: {}
  }

  type CollectionGetPayload<S extends boolean | null | undefined | CollectionDefaultArgs> = $Result.GetResult<Prisma.$CollectionPayload, S>

  type CollectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CollectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CollectionCountAggregateInputType | true
    }

  export interface CollectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Collection'], meta: { name: 'Collection' } }
    /**
     * Find zero or one Collection that matches the filter.
     * @param {CollectionFindUniqueArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CollectionFindUniqueArgs>(args: SelectSubset<T, CollectionFindUniqueArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Collection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CollectionFindUniqueOrThrowArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CollectionFindUniqueOrThrowArgs>(args: SelectSubset<T, CollectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Collection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindFirstArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CollectionFindFirstArgs>(args?: SelectSubset<T, CollectionFindFirstArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Collection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindFirstOrThrowArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CollectionFindFirstOrThrowArgs>(args?: SelectSubset<T, CollectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Collections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Collections
     * const collections = await prisma.collection.findMany()
     * 
     * // Get first 10 Collections
     * const collections = await prisma.collection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const collectionWithIdOnly = await prisma.collection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CollectionFindManyArgs>(args?: SelectSubset<T, CollectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Collection.
     * @param {CollectionCreateArgs} args - Arguments to create a Collection.
     * @example
     * // Create one Collection
     * const Collection = await prisma.collection.create({
     *   data: {
     *     // ... data to create a Collection
     *   }
     * })
     * 
     */
    create<T extends CollectionCreateArgs>(args: SelectSubset<T, CollectionCreateArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Collections.
     * @param {CollectionCreateManyArgs} args - Arguments to create many Collections.
     * @example
     * // Create many Collections
     * const collection = await prisma.collection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CollectionCreateManyArgs>(args?: SelectSubset<T, CollectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Collections and returns the data saved in the database.
     * @param {CollectionCreateManyAndReturnArgs} args - Arguments to create many Collections.
     * @example
     * // Create many Collections
     * const collection = await prisma.collection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Collections and only return the `id`
     * const collectionWithIdOnly = await prisma.collection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CollectionCreateManyAndReturnArgs>(args?: SelectSubset<T, CollectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Collection.
     * @param {CollectionDeleteArgs} args - Arguments to delete one Collection.
     * @example
     * // Delete one Collection
     * const Collection = await prisma.collection.delete({
     *   where: {
     *     // ... filter to delete one Collection
     *   }
     * })
     * 
     */
    delete<T extends CollectionDeleteArgs>(args: SelectSubset<T, CollectionDeleteArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Collection.
     * @param {CollectionUpdateArgs} args - Arguments to update one Collection.
     * @example
     * // Update one Collection
     * const collection = await prisma.collection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CollectionUpdateArgs>(args: SelectSubset<T, CollectionUpdateArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Collections.
     * @param {CollectionDeleteManyArgs} args - Arguments to filter Collections to delete.
     * @example
     * // Delete a few Collections
     * const { count } = await prisma.collection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CollectionDeleteManyArgs>(args?: SelectSubset<T, CollectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Collections
     * const collection = await prisma.collection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CollectionUpdateManyArgs>(args: SelectSubset<T, CollectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collections and returns the data updated in the database.
     * @param {CollectionUpdateManyAndReturnArgs} args - Arguments to update many Collections.
     * @example
     * // Update many Collections
     * const collection = await prisma.collection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Collections and only return the `id`
     * const collectionWithIdOnly = await prisma.collection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CollectionUpdateManyAndReturnArgs>(args: SelectSubset<T, CollectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Collection.
     * @param {CollectionUpsertArgs} args - Arguments to update or create a Collection.
     * @example
     * // Update or create a Collection
     * const collection = await prisma.collection.upsert({
     *   create: {
     *     // ... data to create a Collection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Collection we want to update
     *   }
     * })
     */
    upsert<T extends CollectionUpsertArgs>(args: SelectSubset<T, CollectionUpsertArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCountArgs} args - Arguments to filter Collections to count.
     * @example
     * // Count the number of Collections
     * const count = await prisma.collection.count({
     *   where: {
     *     // ... the filter for the Collections we want to count
     *   }
     * })
    **/
    count<T extends CollectionCountArgs>(
      args?: Subset<T, CollectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Collection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CollectionAggregateArgs>(args: Subset<T, CollectionAggregateArgs>): Prisma.PrismaPromise<GetCollectionAggregateType<T>>

    /**
     * Group by Collection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CollectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollectionGroupByArgs['orderBy'] }
        : { orderBy?: CollectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CollectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Collection model
   */
  readonly fields: CollectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Collection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CollectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends AuthorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthorDefaultArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    paintings<T extends Collection$paintingsArgs<ExtArgs> = {}>(args?: Subset<T, Collection$paintingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Collection model
   */
  interface CollectionFieldRefs {
    readonly id: FieldRef<"Collection", 'Int'>
    readonly title: FieldRef<"Collection", 'String'>
    readonly coverPhotoUrl: FieldRef<"Collection", 'String'>
    readonly coverPhotoPublicId: FieldRef<"Collection", 'String'>
    readonly authorId: FieldRef<"Collection", 'Int'>
    readonly createdAt: FieldRef<"Collection", 'DateTime'>
    readonly updatedAt: FieldRef<"Collection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Collection findUnique
   */
  export type CollectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection findUniqueOrThrow
   */
  export type CollectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection findFirst
   */
  export type CollectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collections.
     */
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection findFirstOrThrow
   */
  export type CollectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collections.
     */
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection findMany
   */
  export type CollectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collections to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collections.
     */
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection create
   */
  export type CollectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Collection.
     */
    data: XOR<CollectionCreateInput, CollectionUncheckedCreateInput>
  }

  /**
   * Collection createMany
   */
  export type CollectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Collections.
     */
    data: CollectionCreateManyInput | CollectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Collection createManyAndReturn
   */
  export type CollectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * The data used to create many Collections.
     */
    data: CollectionCreateManyInput | CollectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Collection update
   */
  export type CollectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Collection.
     */
    data: XOR<CollectionUpdateInput, CollectionUncheckedUpdateInput>
    /**
     * Choose, which Collection to update.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection updateMany
   */
  export type CollectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Collections.
     */
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyInput>
    /**
     * Filter which Collections to update
     */
    where?: CollectionWhereInput
    /**
     * Limit how many Collections to update.
     */
    limit?: number
  }

  /**
   * Collection updateManyAndReturn
   */
  export type CollectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * The data used to update Collections.
     */
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyInput>
    /**
     * Filter which Collections to update
     */
    where?: CollectionWhereInput
    /**
     * Limit how many Collections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Collection upsert
   */
  export type CollectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Collection to update in case it exists.
     */
    where: CollectionWhereUniqueInput
    /**
     * In case the Collection found by the `where` argument doesn't exist, create a new Collection with this data.
     */
    create: XOR<CollectionCreateInput, CollectionUncheckedCreateInput>
    /**
     * In case the Collection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CollectionUpdateInput, CollectionUncheckedUpdateInput>
  }

  /**
   * Collection delete
   */
  export type CollectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter which Collection to delete.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection deleteMany
   */
  export type CollectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Collections to delete
     */
    where?: CollectionWhereInput
    /**
     * Limit how many Collections to delete.
     */
    limit?: number
  }

  /**
   * Collection.paintings
   */
  export type Collection$paintingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    where?: PaintingWhereInput
    orderBy?: PaintingOrderByWithRelationInput | PaintingOrderByWithRelationInput[]
    cursor?: PaintingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaintingScalarFieldEnum | PaintingScalarFieldEnum[]
  }

  /**
   * Collection without action
   */
  export type CollectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
  }


  /**
   * Model Painting
   */

  export type AggregatePainting = {
    _count: PaintingCountAggregateOutputType | null
    _avg: PaintingAvgAggregateOutputType | null
    _sum: PaintingSumAggregateOutputType | null
    _min: PaintingMinAggregateOutputType | null
    _max: PaintingMaxAggregateOutputType | null
  }

  export type PaintingAvgAggregateOutputType = {
    id: number | null
    sortOrder: number | null
    year: number | null
    authorId: number | null
    collectionId: number | null
  }

  export type PaintingSumAggregateOutputType = {
    id: number | null
    sortOrder: number | null
    year: number | null
    authorId: number | null
    collectionId: number | null
  }

  export type PaintingMinAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    coverUrl: string | null
    coverPublicId: string | null
    hasNeon: boolean | null
    isForSale: boolean | null
    sortOrder: number | null
    year: number | null
    authorId: number | null
    collectionId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaintingMaxAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    coverUrl: string | null
    coverPublicId: string | null
    hasNeon: boolean | null
    isForSale: boolean | null
    sortOrder: number | null
    year: number | null
    authorId: number | null
    collectionId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaintingCountAggregateOutputType = {
    id: number
    title: number
    description: number
    coverUrl: number
    coverPublicId: number
    hasNeon: number
    isForSale: number
    sortOrder: number
    year: number
    authorId: number
    collectionId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaintingAvgAggregateInputType = {
    id?: true
    sortOrder?: true
    year?: true
    authorId?: true
    collectionId?: true
  }

  export type PaintingSumAggregateInputType = {
    id?: true
    sortOrder?: true
    year?: true
    authorId?: true
    collectionId?: true
  }

  export type PaintingMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    coverUrl?: true
    coverPublicId?: true
    hasNeon?: true
    isForSale?: true
    sortOrder?: true
    year?: true
    authorId?: true
    collectionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaintingMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    coverUrl?: true
    coverPublicId?: true
    hasNeon?: true
    isForSale?: true
    sortOrder?: true
    year?: true
    authorId?: true
    collectionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaintingCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    coverUrl?: true
    coverPublicId?: true
    hasNeon?: true
    isForSale?: true
    sortOrder?: true
    year?: true
    authorId?: true
    collectionId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaintingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Painting to aggregate.
     */
    where?: PaintingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Paintings to fetch.
     */
    orderBy?: PaintingOrderByWithRelationInput | PaintingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaintingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Paintings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Paintings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Paintings
    **/
    _count?: true | PaintingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaintingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaintingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaintingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaintingMaxAggregateInputType
  }

  export type GetPaintingAggregateType<T extends PaintingAggregateArgs> = {
        [P in keyof T & keyof AggregatePainting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePainting[P]>
      : GetScalarType<T[P], AggregatePainting[P]>
  }




  export type PaintingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaintingWhereInput
    orderBy?: PaintingOrderByWithAggregationInput | PaintingOrderByWithAggregationInput[]
    by: PaintingScalarFieldEnum[] | PaintingScalarFieldEnum
    having?: PaintingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaintingCountAggregateInputType | true
    _avg?: PaintingAvgAggregateInputType
    _sum?: PaintingSumAggregateInputType
    _min?: PaintingMinAggregateInputType
    _max?: PaintingMaxAggregateInputType
  }

  export type PaintingGroupByOutputType = {
    id: number
    title: string
    description: string | null
    coverUrl: string
    coverPublicId: string
    hasNeon: boolean
    isForSale: boolean
    sortOrder: number
    year: number | null
    authorId: number
    collectionId: number | null
    createdAt: Date
    updatedAt: Date
    _count: PaintingCountAggregateOutputType | null
    _avg: PaintingAvgAggregateOutputType | null
    _sum: PaintingSumAggregateOutputType | null
    _min: PaintingMinAggregateOutputType | null
    _max: PaintingMaxAggregateOutputType | null
  }

  type GetPaintingGroupByPayload<T extends PaintingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaintingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaintingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaintingGroupByOutputType[P]>
            : GetScalarType<T[P], PaintingGroupByOutputType[P]>
        }
      >
    >


  export type PaintingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    coverUrl?: boolean
    coverPublicId?: boolean
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: boolean
    year?: boolean
    authorId?: boolean
    collectionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    collection?: boolean | Painting$collectionArgs<ExtArgs>
    media?: boolean | Painting$mediaArgs<ExtArgs>
    _count?: boolean | PaintingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["painting"]>

  export type PaintingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    coverUrl?: boolean
    coverPublicId?: boolean
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: boolean
    year?: boolean
    authorId?: boolean
    collectionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    collection?: boolean | Painting$collectionArgs<ExtArgs>
  }, ExtArgs["result"]["painting"]>

  export type PaintingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    coverUrl?: boolean
    coverPublicId?: boolean
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: boolean
    year?: boolean
    authorId?: boolean
    collectionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    collection?: boolean | Painting$collectionArgs<ExtArgs>
  }, ExtArgs["result"]["painting"]>

  export type PaintingSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    coverUrl?: boolean
    coverPublicId?: boolean
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: boolean
    year?: boolean
    authorId?: boolean
    collectionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaintingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "coverUrl" | "coverPublicId" | "hasNeon" | "isForSale" | "sortOrder" | "year" | "authorId" | "collectionId" | "createdAt" | "updatedAt", ExtArgs["result"]["painting"]>
  export type PaintingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    collection?: boolean | Painting$collectionArgs<ExtArgs>
    media?: boolean | Painting$mediaArgs<ExtArgs>
    _count?: boolean | PaintingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PaintingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    collection?: boolean | Painting$collectionArgs<ExtArgs>
  }
  export type PaintingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    collection?: boolean | Painting$collectionArgs<ExtArgs>
  }

  export type $PaintingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Painting"
    objects: {
      author: Prisma.$AuthorPayload<ExtArgs>
      collection: Prisma.$CollectionPayload<ExtArgs> | null
      media: Prisma.$PaintingMediaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      description: string | null
      coverUrl: string
      coverPublicId: string
      hasNeon: boolean
      isForSale: boolean
      sortOrder: number
      year: number | null
      authorId: number
      collectionId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["painting"]>
    composites: {}
  }

  type PaintingGetPayload<S extends boolean | null | undefined | PaintingDefaultArgs> = $Result.GetResult<Prisma.$PaintingPayload, S>

  type PaintingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaintingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaintingCountAggregateInputType | true
    }

  export interface PaintingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Painting'], meta: { name: 'Painting' } }
    /**
     * Find zero or one Painting that matches the filter.
     * @param {PaintingFindUniqueArgs} args - Arguments to find a Painting
     * @example
     * // Get one Painting
     * const painting = await prisma.painting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaintingFindUniqueArgs>(args: SelectSubset<T, PaintingFindUniqueArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Painting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaintingFindUniqueOrThrowArgs} args - Arguments to find a Painting
     * @example
     * // Get one Painting
     * const painting = await prisma.painting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaintingFindUniqueOrThrowArgs>(args: SelectSubset<T, PaintingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Painting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingFindFirstArgs} args - Arguments to find a Painting
     * @example
     * // Get one Painting
     * const painting = await prisma.painting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaintingFindFirstArgs>(args?: SelectSubset<T, PaintingFindFirstArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Painting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingFindFirstOrThrowArgs} args - Arguments to find a Painting
     * @example
     * // Get one Painting
     * const painting = await prisma.painting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaintingFindFirstOrThrowArgs>(args?: SelectSubset<T, PaintingFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Paintings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Paintings
     * const paintings = await prisma.painting.findMany()
     * 
     * // Get first 10 Paintings
     * const paintings = await prisma.painting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paintingWithIdOnly = await prisma.painting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaintingFindManyArgs>(args?: SelectSubset<T, PaintingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Painting.
     * @param {PaintingCreateArgs} args - Arguments to create a Painting.
     * @example
     * // Create one Painting
     * const Painting = await prisma.painting.create({
     *   data: {
     *     // ... data to create a Painting
     *   }
     * })
     * 
     */
    create<T extends PaintingCreateArgs>(args: SelectSubset<T, PaintingCreateArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Paintings.
     * @param {PaintingCreateManyArgs} args - Arguments to create many Paintings.
     * @example
     * // Create many Paintings
     * const painting = await prisma.painting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaintingCreateManyArgs>(args?: SelectSubset<T, PaintingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Paintings and returns the data saved in the database.
     * @param {PaintingCreateManyAndReturnArgs} args - Arguments to create many Paintings.
     * @example
     * // Create many Paintings
     * const painting = await prisma.painting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Paintings and only return the `id`
     * const paintingWithIdOnly = await prisma.painting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaintingCreateManyAndReturnArgs>(args?: SelectSubset<T, PaintingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Painting.
     * @param {PaintingDeleteArgs} args - Arguments to delete one Painting.
     * @example
     * // Delete one Painting
     * const Painting = await prisma.painting.delete({
     *   where: {
     *     // ... filter to delete one Painting
     *   }
     * })
     * 
     */
    delete<T extends PaintingDeleteArgs>(args: SelectSubset<T, PaintingDeleteArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Painting.
     * @param {PaintingUpdateArgs} args - Arguments to update one Painting.
     * @example
     * // Update one Painting
     * const painting = await prisma.painting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaintingUpdateArgs>(args: SelectSubset<T, PaintingUpdateArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Paintings.
     * @param {PaintingDeleteManyArgs} args - Arguments to filter Paintings to delete.
     * @example
     * // Delete a few Paintings
     * const { count } = await prisma.painting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaintingDeleteManyArgs>(args?: SelectSubset<T, PaintingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Paintings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Paintings
     * const painting = await prisma.painting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaintingUpdateManyArgs>(args: SelectSubset<T, PaintingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Paintings and returns the data updated in the database.
     * @param {PaintingUpdateManyAndReturnArgs} args - Arguments to update many Paintings.
     * @example
     * // Update many Paintings
     * const painting = await prisma.painting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Paintings and only return the `id`
     * const paintingWithIdOnly = await prisma.painting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaintingUpdateManyAndReturnArgs>(args: SelectSubset<T, PaintingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Painting.
     * @param {PaintingUpsertArgs} args - Arguments to update or create a Painting.
     * @example
     * // Update or create a Painting
     * const painting = await prisma.painting.upsert({
     *   create: {
     *     // ... data to create a Painting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Painting we want to update
     *   }
     * })
     */
    upsert<T extends PaintingUpsertArgs>(args: SelectSubset<T, PaintingUpsertArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Paintings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingCountArgs} args - Arguments to filter Paintings to count.
     * @example
     * // Count the number of Paintings
     * const count = await prisma.painting.count({
     *   where: {
     *     // ... the filter for the Paintings we want to count
     *   }
     * })
    **/
    count<T extends PaintingCountArgs>(
      args?: Subset<T, PaintingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaintingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Painting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaintingAggregateArgs>(args: Subset<T, PaintingAggregateArgs>): Prisma.PrismaPromise<GetPaintingAggregateType<T>>

    /**
     * Group by Painting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaintingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaintingGroupByArgs['orderBy'] }
        : { orderBy?: PaintingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaintingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaintingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Painting model
   */
  readonly fields: PaintingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Painting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaintingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends AuthorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthorDefaultArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    collection<T extends Painting$collectionArgs<ExtArgs> = {}>(args?: Subset<T, Painting$collectionArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    media<T extends Painting$mediaArgs<ExtArgs> = {}>(args?: Subset<T, Painting$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Painting model
   */
  interface PaintingFieldRefs {
    readonly id: FieldRef<"Painting", 'Int'>
    readonly title: FieldRef<"Painting", 'String'>
    readonly description: FieldRef<"Painting", 'String'>
    readonly coverUrl: FieldRef<"Painting", 'String'>
    readonly coverPublicId: FieldRef<"Painting", 'String'>
    readonly hasNeon: FieldRef<"Painting", 'Boolean'>
    readonly isForSale: FieldRef<"Painting", 'Boolean'>
    readonly sortOrder: FieldRef<"Painting", 'Int'>
    readonly year: FieldRef<"Painting", 'Int'>
    readonly authorId: FieldRef<"Painting", 'Int'>
    readonly collectionId: FieldRef<"Painting", 'Int'>
    readonly createdAt: FieldRef<"Painting", 'DateTime'>
    readonly updatedAt: FieldRef<"Painting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Painting findUnique
   */
  export type PaintingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * Filter, which Painting to fetch.
     */
    where: PaintingWhereUniqueInput
  }

  /**
   * Painting findUniqueOrThrow
   */
  export type PaintingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * Filter, which Painting to fetch.
     */
    where: PaintingWhereUniqueInput
  }

  /**
   * Painting findFirst
   */
  export type PaintingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * Filter, which Painting to fetch.
     */
    where?: PaintingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Paintings to fetch.
     */
    orderBy?: PaintingOrderByWithRelationInput | PaintingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Paintings.
     */
    cursor?: PaintingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Paintings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Paintings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Paintings.
     */
    distinct?: PaintingScalarFieldEnum | PaintingScalarFieldEnum[]
  }

  /**
   * Painting findFirstOrThrow
   */
  export type PaintingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * Filter, which Painting to fetch.
     */
    where?: PaintingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Paintings to fetch.
     */
    orderBy?: PaintingOrderByWithRelationInput | PaintingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Paintings.
     */
    cursor?: PaintingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Paintings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Paintings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Paintings.
     */
    distinct?: PaintingScalarFieldEnum | PaintingScalarFieldEnum[]
  }

  /**
   * Painting findMany
   */
  export type PaintingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * Filter, which Paintings to fetch.
     */
    where?: PaintingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Paintings to fetch.
     */
    orderBy?: PaintingOrderByWithRelationInput | PaintingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Paintings.
     */
    cursor?: PaintingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Paintings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Paintings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Paintings.
     */
    distinct?: PaintingScalarFieldEnum | PaintingScalarFieldEnum[]
  }

  /**
   * Painting create
   */
  export type PaintingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * The data needed to create a Painting.
     */
    data: XOR<PaintingCreateInput, PaintingUncheckedCreateInput>
  }

  /**
   * Painting createMany
   */
  export type PaintingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Paintings.
     */
    data: PaintingCreateManyInput | PaintingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Painting createManyAndReturn
   */
  export type PaintingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * The data used to create many Paintings.
     */
    data: PaintingCreateManyInput | PaintingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Painting update
   */
  export type PaintingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * The data needed to update a Painting.
     */
    data: XOR<PaintingUpdateInput, PaintingUncheckedUpdateInput>
    /**
     * Choose, which Painting to update.
     */
    where: PaintingWhereUniqueInput
  }

  /**
   * Painting updateMany
   */
  export type PaintingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Paintings.
     */
    data: XOR<PaintingUpdateManyMutationInput, PaintingUncheckedUpdateManyInput>
    /**
     * Filter which Paintings to update
     */
    where?: PaintingWhereInput
    /**
     * Limit how many Paintings to update.
     */
    limit?: number
  }

  /**
   * Painting updateManyAndReturn
   */
  export type PaintingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * The data used to update Paintings.
     */
    data: XOR<PaintingUpdateManyMutationInput, PaintingUncheckedUpdateManyInput>
    /**
     * Filter which Paintings to update
     */
    where?: PaintingWhereInput
    /**
     * Limit how many Paintings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Painting upsert
   */
  export type PaintingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * The filter to search for the Painting to update in case it exists.
     */
    where: PaintingWhereUniqueInput
    /**
     * In case the Painting found by the `where` argument doesn't exist, create a new Painting with this data.
     */
    create: XOR<PaintingCreateInput, PaintingUncheckedCreateInput>
    /**
     * In case the Painting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaintingUpdateInput, PaintingUncheckedUpdateInput>
  }

  /**
   * Painting delete
   */
  export type PaintingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
    /**
     * Filter which Painting to delete.
     */
    where: PaintingWhereUniqueInput
  }

  /**
   * Painting deleteMany
   */
  export type PaintingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Paintings to delete
     */
    where?: PaintingWhereInput
    /**
     * Limit how many Paintings to delete.
     */
    limit?: number
  }

  /**
   * Painting.collection
   */
  export type Painting$collectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    where?: CollectionWhereInput
  }

  /**
   * Painting.media
   */
  export type Painting$mediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    where?: PaintingMediaWhereInput
    orderBy?: PaintingMediaOrderByWithRelationInput | PaintingMediaOrderByWithRelationInput[]
    cursor?: PaintingMediaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaintingMediaScalarFieldEnum | PaintingMediaScalarFieldEnum[]
  }

  /**
   * Painting without action
   */
  export type PaintingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Painting
     */
    select?: PaintingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Painting
     */
    omit?: PaintingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingInclude<ExtArgs> | null
  }


  /**
   * Model PaintingMedia
   */

  export type AggregatePaintingMedia = {
    _count: PaintingMediaCountAggregateOutputType | null
    _avg: PaintingMediaAvgAggregateOutputType | null
    _sum: PaintingMediaSumAggregateOutputType | null
    _min: PaintingMediaMinAggregateOutputType | null
    _max: PaintingMediaMaxAggregateOutputType | null
  }

  export type PaintingMediaAvgAggregateOutputType = {
    id: number | null
    order: number | null
    paintingId: number | null
  }

  export type PaintingMediaSumAggregateOutputType = {
    id: number | null
    order: number | null
    paintingId: number | null
  }

  export type PaintingMediaMinAggregateOutputType = {
    id: number | null
    url: string | null
    publicId: string | null
    isNeon: boolean | null
    order: number | null
    type: $Enums.MediaType | null
    paintingId: number | null
  }

  export type PaintingMediaMaxAggregateOutputType = {
    id: number | null
    url: string | null
    publicId: string | null
    isNeon: boolean | null
    order: number | null
    type: $Enums.MediaType | null
    paintingId: number | null
  }

  export type PaintingMediaCountAggregateOutputType = {
    id: number
    url: number
    publicId: number
    isNeon: number
    order: number
    type: number
    paintingId: number
    _all: number
  }


  export type PaintingMediaAvgAggregateInputType = {
    id?: true
    order?: true
    paintingId?: true
  }

  export type PaintingMediaSumAggregateInputType = {
    id?: true
    order?: true
    paintingId?: true
  }

  export type PaintingMediaMinAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    isNeon?: true
    order?: true
    type?: true
    paintingId?: true
  }

  export type PaintingMediaMaxAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    isNeon?: true
    order?: true
    type?: true
    paintingId?: true
  }

  export type PaintingMediaCountAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    isNeon?: true
    order?: true
    type?: true
    paintingId?: true
    _all?: true
  }

  export type PaintingMediaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaintingMedia to aggregate.
     */
    where?: PaintingMediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaintingMedias to fetch.
     */
    orderBy?: PaintingMediaOrderByWithRelationInput | PaintingMediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaintingMediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaintingMedias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaintingMedias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaintingMedias
    **/
    _count?: true | PaintingMediaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaintingMediaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaintingMediaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaintingMediaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaintingMediaMaxAggregateInputType
  }

  export type GetPaintingMediaAggregateType<T extends PaintingMediaAggregateArgs> = {
        [P in keyof T & keyof AggregatePaintingMedia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaintingMedia[P]>
      : GetScalarType<T[P], AggregatePaintingMedia[P]>
  }




  export type PaintingMediaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaintingMediaWhereInput
    orderBy?: PaintingMediaOrderByWithAggregationInput | PaintingMediaOrderByWithAggregationInput[]
    by: PaintingMediaScalarFieldEnum[] | PaintingMediaScalarFieldEnum
    having?: PaintingMediaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaintingMediaCountAggregateInputType | true
    _avg?: PaintingMediaAvgAggregateInputType
    _sum?: PaintingMediaSumAggregateInputType
    _min?: PaintingMediaMinAggregateInputType
    _max?: PaintingMediaMaxAggregateInputType
  }

  export type PaintingMediaGroupByOutputType = {
    id: number
    url: string
    publicId: string
    isNeon: boolean
    order: number
    type: $Enums.MediaType
    paintingId: number
    _count: PaintingMediaCountAggregateOutputType | null
    _avg: PaintingMediaAvgAggregateOutputType | null
    _sum: PaintingMediaSumAggregateOutputType | null
    _min: PaintingMediaMinAggregateOutputType | null
    _max: PaintingMediaMaxAggregateOutputType | null
  }

  type GetPaintingMediaGroupByPayload<T extends PaintingMediaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaintingMediaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaintingMediaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaintingMediaGroupByOutputType[P]>
            : GetScalarType<T[P], PaintingMediaGroupByOutputType[P]>
        }
      >
    >


  export type PaintingMediaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    isNeon?: boolean
    order?: boolean
    type?: boolean
    paintingId?: boolean
    painting?: boolean | PaintingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paintingMedia"]>

  export type PaintingMediaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    isNeon?: boolean
    order?: boolean
    type?: boolean
    paintingId?: boolean
    painting?: boolean | PaintingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paintingMedia"]>

  export type PaintingMediaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    isNeon?: boolean
    order?: boolean
    type?: boolean
    paintingId?: boolean
    painting?: boolean | PaintingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paintingMedia"]>

  export type PaintingMediaSelectScalar = {
    id?: boolean
    url?: boolean
    publicId?: boolean
    isNeon?: boolean
    order?: boolean
    type?: boolean
    paintingId?: boolean
  }

  export type PaintingMediaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "publicId" | "isNeon" | "order" | "type" | "paintingId", ExtArgs["result"]["paintingMedia"]>
  export type PaintingMediaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    painting?: boolean | PaintingDefaultArgs<ExtArgs>
  }
  export type PaintingMediaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    painting?: boolean | PaintingDefaultArgs<ExtArgs>
  }
  export type PaintingMediaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    painting?: boolean | PaintingDefaultArgs<ExtArgs>
  }

  export type $PaintingMediaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaintingMedia"
    objects: {
      painting: Prisma.$PaintingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      url: string
      publicId: string
      isNeon: boolean
      order: number
      type: $Enums.MediaType
      paintingId: number
    }, ExtArgs["result"]["paintingMedia"]>
    composites: {}
  }

  type PaintingMediaGetPayload<S extends boolean | null | undefined | PaintingMediaDefaultArgs> = $Result.GetResult<Prisma.$PaintingMediaPayload, S>

  type PaintingMediaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaintingMediaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaintingMediaCountAggregateInputType | true
    }

  export interface PaintingMediaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaintingMedia'], meta: { name: 'PaintingMedia' } }
    /**
     * Find zero or one PaintingMedia that matches the filter.
     * @param {PaintingMediaFindUniqueArgs} args - Arguments to find a PaintingMedia
     * @example
     * // Get one PaintingMedia
     * const paintingMedia = await prisma.paintingMedia.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaintingMediaFindUniqueArgs>(args: SelectSubset<T, PaintingMediaFindUniqueArgs<ExtArgs>>): Prisma__PaintingMediaClient<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PaintingMedia that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaintingMediaFindUniqueOrThrowArgs} args - Arguments to find a PaintingMedia
     * @example
     * // Get one PaintingMedia
     * const paintingMedia = await prisma.paintingMedia.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaintingMediaFindUniqueOrThrowArgs>(args: SelectSubset<T, PaintingMediaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaintingMediaClient<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaintingMedia that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingMediaFindFirstArgs} args - Arguments to find a PaintingMedia
     * @example
     * // Get one PaintingMedia
     * const paintingMedia = await prisma.paintingMedia.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaintingMediaFindFirstArgs>(args?: SelectSubset<T, PaintingMediaFindFirstArgs<ExtArgs>>): Prisma__PaintingMediaClient<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaintingMedia that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingMediaFindFirstOrThrowArgs} args - Arguments to find a PaintingMedia
     * @example
     * // Get one PaintingMedia
     * const paintingMedia = await prisma.paintingMedia.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaintingMediaFindFirstOrThrowArgs>(args?: SelectSubset<T, PaintingMediaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaintingMediaClient<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PaintingMedias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingMediaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaintingMedias
     * const paintingMedias = await prisma.paintingMedia.findMany()
     * 
     * // Get first 10 PaintingMedias
     * const paintingMedias = await prisma.paintingMedia.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paintingMediaWithIdOnly = await prisma.paintingMedia.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaintingMediaFindManyArgs>(args?: SelectSubset<T, PaintingMediaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PaintingMedia.
     * @param {PaintingMediaCreateArgs} args - Arguments to create a PaintingMedia.
     * @example
     * // Create one PaintingMedia
     * const PaintingMedia = await prisma.paintingMedia.create({
     *   data: {
     *     // ... data to create a PaintingMedia
     *   }
     * })
     * 
     */
    create<T extends PaintingMediaCreateArgs>(args: SelectSubset<T, PaintingMediaCreateArgs<ExtArgs>>): Prisma__PaintingMediaClient<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PaintingMedias.
     * @param {PaintingMediaCreateManyArgs} args - Arguments to create many PaintingMedias.
     * @example
     * // Create many PaintingMedias
     * const paintingMedia = await prisma.paintingMedia.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaintingMediaCreateManyArgs>(args?: SelectSubset<T, PaintingMediaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaintingMedias and returns the data saved in the database.
     * @param {PaintingMediaCreateManyAndReturnArgs} args - Arguments to create many PaintingMedias.
     * @example
     * // Create many PaintingMedias
     * const paintingMedia = await prisma.paintingMedia.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaintingMedias and only return the `id`
     * const paintingMediaWithIdOnly = await prisma.paintingMedia.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaintingMediaCreateManyAndReturnArgs>(args?: SelectSubset<T, PaintingMediaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PaintingMedia.
     * @param {PaintingMediaDeleteArgs} args - Arguments to delete one PaintingMedia.
     * @example
     * // Delete one PaintingMedia
     * const PaintingMedia = await prisma.paintingMedia.delete({
     *   where: {
     *     // ... filter to delete one PaintingMedia
     *   }
     * })
     * 
     */
    delete<T extends PaintingMediaDeleteArgs>(args: SelectSubset<T, PaintingMediaDeleteArgs<ExtArgs>>): Prisma__PaintingMediaClient<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PaintingMedia.
     * @param {PaintingMediaUpdateArgs} args - Arguments to update one PaintingMedia.
     * @example
     * // Update one PaintingMedia
     * const paintingMedia = await prisma.paintingMedia.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaintingMediaUpdateArgs>(args: SelectSubset<T, PaintingMediaUpdateArgs<ExtArgs>>): Prisma__PaintingMediaClient<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PaintingMedias.
     * @param {PaintingMediaDeleteManyArgs} args - Arguments to filter PaintingMedias to delete.
     * @example
     * // Delete a few PaintingMedias
     * const { count } = await prisma.paintingMedia.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaintingMediaDeleteManyArgs>(args?: SelectSubset<T, PaintingMediaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaintingMedias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingMediaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaintingMedias
     * const paintingMedia = await prisma.paintingMedia.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaintingMediaUpdateManyArgs>(args: SelectSubset<T, PaintingMediaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaintingMedias and returns the data updated in the database.
     * @param {PaintingMediaUpdateManyAndReturnArgs} args - Arguments to update many PaintingMedias.
     * @example
     * // Update many PaintingMedias
     * const paintingMedia = await prisma.paintingMedia.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PaintingMedias and only return the `id`
     * const paintingMediaWithIdOnly = await prisma.paintingMedia.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaintingMediaUpdateManyAndReturnArgs>(args: SelectSubset<T, PaintingMediaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PaintingMedia.
     * @param {PaintingMediaUpsertArgs} args - Arguments to update or create a PaintingMedia.
     * @example
     * // Update or create a PaintingMedia
     * const paintingMedia = await prisma.paintingMedia.upsert({
     *   create: {
     *     // ... data to create a PaintingMedia
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaintingMedia we want to update
     *   }
     * })
     */
    upsert<T extends PaintingMediaUpsertArgs>(args: SelectSubset<T, PaintingMediaUpsertArgs<ExtArgs>>): Prisma__PaintingMediaClient<$Result.GetResult<Prisma.$PaintingMediaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PaintingMedias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingMediaCountArgs} args - Arguments to filter PaintingMedias to count.
     * @example
     * // Count the number of PaintingMedias
     * const count = await prisma.paintingMedia.count({
     *   where: {
     *     // ... the filter for the PaintingMedias we want to count
     *   }
     * })
    **/
    count<T extends PaintingMediaCountArgs>(
      args?: Subset<T, PaintingMediaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaintingMediaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaintingMedia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingMediaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaintingMediaAggregateArgs>(args: Subset<T, PaintingMediaAggregateArgs>): Prisma.PrismaPromise<GetPaintingMediaAggregateType<T>>

    /**
     * Group by PaintingMedia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaintingMediaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaintingMediaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaintingMediaGroupByArgs['orderBy'] }
        : { orderBy?: PaintingMediaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaintingMediaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaintingMediaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaintingMedia model
   */
  readonly fields: PaintingMediaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaintingMedia.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaintingMediaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    painting<T extends PaintingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaintingDefaultArgs<ExtArgs>>): Prisma__PaintingClient<$Result.GetResult<Prisma.$PaintingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaintingMedia model
   */
  interface PaintingMediaFieldRefs {
    readonly id: FieldRef<"PaintingMedia", 'Int'>
    readonly url: FieldRef<"PaintingMedia", 'String'>
    readonly publicId: FieldRef<"PaintingMedia", 'String'>
    readonly isNeon: FieldRef<"PaintingMedia", 'Boolean'>
    readonly order: FieldRef<"PaintingMedia", 'Int'>
    readonly type: FieldRef<"PaintingMedia", 'MediaType'>
    readonly paintingId: FieldRef<"PaintingMedia", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * PaintingMedia findUnique
   */
  export type PaintingMediaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * Filter, which PaintingMedia to fetch.
     */
    where: PaintingMediaWhereUniqueInput
  }

  /**
   * PaintingMedia findUniqueOrThrow
   */
  export type PaintingMediaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * Filter, which PaintingMedia to fetch.
     */
    where: PaintingMediaWhereUniqueInput
  }

  /**
   * PaintingMedia findFirst
   */
  export type PaintingMediaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * Filter, which PaintingMedia to fetch.
     */
    where?: PaintingMediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaintingMedias to fetch.
     */
    orderBy?: PaintingMediaOrderByWithRelationInput | PaintingMediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaintingMedias.
     */
    cursor?: PaintingMediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaintingMedias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaintingMedias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaintingMedias.
     */
    distinct?: PaintingMediaScalarFieldEnum | PaintingMediaScalarFieldEnum[]
  }

  /**
   * PaintingMedia findFirstOrThrow
   */
  export type PaintingMediaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * Filter, which PaintingMedia to fetch.
     */
    where?: PaintingMediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaintingMedias to fetch.
     */
    orderBy?: PaintingMediaOrderByWithRelationInput | PaintingMediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaintingMedias.
     */
    cursor?: PaintingMediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaintingMedias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaintingMedias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaintingMedias.
     */
    distinct?: PaintingMediaScalarFieldEnum | PaintingMediaScalarFieldEnum[]
  }

  /**
   * PaintingMedia findMany
   */
  export type PaintingMediaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * Filter, which PaintingMedias to fetch.
     */
    where?: PaintingMediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaintingMedias to fetch.
     */
    orderBy?: PaintingMediaOrderByWithRelationInput | PaintingMediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaintingMedias.
     */
    cursor?: PaintingMediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaintingMedias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaintingMedias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaintingMedias.
     */
    distinct?: PaintingMediaScalarFieldEnum | PaintingMediaScalarFieldEnum[]
  }

  /**
   * PaintingMedia create
   */
  export type PaintingMediaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * The data needed to create a PaintingMedia.
     */
    data: XOR<PaintingMediaCreateInput, PaintingMediaUncheckedCreateInput>
  }

  /**
   * PaintingMedia createMany
   */
  export type PaintingMediaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaintingMedias.
     */
    data: PaintingMediaCreateManyInput | PaintingMediaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaintingMedia createManyAndReturn
   */
  export type PaintingMediaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * The data used to create many PaintingMedias.
     */
    data: PaintingMediaCreateManyInput | PaintingMediaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaintingMedia update
   */
  export type PaintingMediaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * The data needed to update a PaintingMedia.
     */
    data: XOR<PaintingMediaUpdateInput, PaintingMediaUncheckedUpdateInput>
    /**
     * Choose, which PaintingMedia to update.
     */
    where: PaintingMediaWhereUniqueInput
  }

  /**
   * PaintingMedia updateMany
   */
  export type PaintingMediaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaintingMedias.
     */
    data: XOR<PaintingMediaUpdateManyMutationInput, PaintingMediaUncheckedUpdateManyInput>
    /**
     * Filter which PaintingMedias to update
     */
    where?: PaintingMediaWhereInput
    /**
     * Limit how many PaintingMedias to update.
     */
    limit?: number
  }

  /**
   * PaintingMedia updateManyAndReturn
   */
  export type PaintingMediaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * The data used to update PaintingMedias.
     */
    data: XOR<PaintingMediaUpdateManyMutationInput, PaintingMediaUncheckedUpdateManyInput>
    /**
     * Filter which PaintingMedias to update
     */
    where?: PaintingMediaWhereInput
    /**
     * Limit how many PaintingMedias to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaintingMedia upsert
   */
  export type PaintingMediaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * The filter to search for the PaintingMedia to update in case it exists.
     */
    where: PaintingMediaWhereUniqueInput
    /**
     * In case the PaintingMedia found by the `where` argument doesn't exist, create a new PaintingMedia with this data.
     */
    create: XOR<PaintingMediaCreateInput, PaintingMediaUncheckedCreateInput>
    /**
     * In case the PaintingMedia was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaintingMediaUpdateInput, PaintingMediaUncheckedUpdateInput>
  }

  /**
   * PaintingMedia delete
   */
  export type PaintingMediaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
    /**
     * Filter which PaintingMedia to delete.
     */
    where: PaintingMediaWhereUniqueInput
  }

  /**
   * PaintingMedia deleteMany
   */
  export type PaintingMediaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaintingMedias to delete
     */
    where?: PaintingMediaWhereInput
    /**
     * Limit how many PaintingMedias to delete.
     */
    limit?: number
  }

  /**
   * PaintingMedia without action
   */
  export type PaintingMediaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaintingMedia
     */
    select?: PaintingMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaintingMedia
     */
    omit?: PaintingMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaintingMediaInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "createdAt" | "updatedAt", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends Category$productsArgs<ExtArgs> = {}>(args?: Subset<T, Category$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
    readonly slug: FieldRef<"Category", 'String'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.products
   */
  export type Category$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    id: number | null
    price: number | null
    stock: number | null
    sortOrder: number | null
    categoryId: number | null
    authorId: number | null
  }

  export type ProductSumAggregateOutputType = {
    id: number | null
    price: number | null
    stock: number | null
    sortOrder: number | null
    categoryId: number | null
    authorId: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    price: number | null
    stock: number | null
    sortOrder: number | null
    categoryId: number | null
    authorId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    price: number | null
    stock: number | null
    sortOrder: number | null
    categoryId: number | null
    authorId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    title: number
    description: number
    price: number
    stock: number
    sortOrder: number
    categoryId: number
    authorId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    id?: true
    price?: true
    stock?: true
    sortOrder?: true
    categoryId?: true
    authorId?: true
  }

  export type ProductSumAggregateInputType = {
    id?: true
    price?: true
    stock?: true
    sortOrder?: true
    categoryId?: true
    authorId?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    stock?: true
    sortOrder?: true
    categoryId?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    stock?: true
    sortOrder?: true
    categoryId?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    stock?: true
    sortOrder?: true
    categoryId?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: number
    title: string
    description: string | null
    price: number
    stock: number
    sortOrder: number
    categoryId: number
    authorId: number
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    stock?: boolean
    sortOrder?: boolean
    categoryId?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    images?: boolean | Product$imagesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    stock?: boolean
    sortOrder?: boolean
    categoryId?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    author?: boolean | AuthorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    stock?: boolean
    sortOrder?: boolean
    categoryId?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    author?: boolean | AuthorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    stock?: boolean
    sortOrder?: boolean
    categoryId?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "price" | "stock" | "sortOrder" | "categoryId" | "authorId" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    author?: boolean | AuthorDefaultArgs<ExtArgs>
    images?: boolean | Product$imagesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    author?: boolean | AuthorDefaultArgs<ExtArgs>
  }
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    author?: boolean | AuthorDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs>
      author: Prisma.$AuthorPayload<ExtArgs>
      images: Prisma.$ProductImagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      description: string | null
      price: number
      stock: number
      sortOrder: number
      categoryId: number
      authorId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    author<T extends AuthorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthorDefaultArgs<ExtArgs>>): Prisma__AuthorClient<$Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    images<T extends Product$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Product$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'Int'>
    readonly title: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly price: FieldRef<"Product", 'Float'>
    readonly stock: FieldRef<"Product", 'Int'>
    readonly sortOrder: FieldRef<"Product", 'Int'>
    readonly categoryId: FieldRef<"Product", 'Int'>
    readonly authorId: FieldRef<"Product", 'Int'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.images
   */
  export type Product$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    where?: ProductImageWhereInput
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    cursor?: ProductImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductImageScalarFieldEnum | ProductImageScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model ProductImage
   */

  export type AggregateProductImage = {
    _count: ProductImageCountAggregateOutputType | null
    _avg: ProductImageAvgAggregateOutputType | null
    _sum: ProductImageSumAggregateOutputType | null
    _min: ProductImageMinAggregateOutputType | null
    _max: ProductImageMaxAggregateOutputType | null
  }

  export type ProductImageAvgAggregateOutputType = {
    id: number | null
    order: number | null
    productId: number | null
  }

  export type ProductImageSumAggregateOutputType = {
    id: number | null
    order: number | null
    productId: number | null
  }

  export type ProductImageMinAggregateOutputType = {
    id: number | null
    url: string | null
    publicId: string | null
    order: number | null
    productId: number | null
  }

  export type ProductImageMaxAggregateOutputType = {
    id: number | null
    url: string | null
    publicId: string | null
    order: number | null
    productId: number | null
  }

  export type ProductImageCountAggregateOutputType = {
    id: number
    url: number
    publicId: number
    order: number
    productId: number
    _all: number
  }


  export type ProductImageAvgAggregateInputType = {
    id?: true
    order?: true
    productId?: true
  }

  export type ProductImageSumAggregateInputType = {
    id?: true
    order?: true
    productId?: true
  }

  export type ProductImageMinAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    order?: true
    productId?: true
  }

  export type ProductImageMaxAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    order?: true
    productId?: true
  }

  export type ProductImageCountAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    order?: true
    productId?: true
    _all?: true
  }

  export type ProductImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductImage to aggregate.
     */
    where?: ProductImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductImages
    **/
    _count?: true | ProductImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductImageMaxAggregateInputType
  }

  export type GetProductImageAggregateType<T extends ProductImageAggregateArgs> = {
        [P in keyof T & keyof AggregateProductImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductImage[P]>
      : GetScalarType<T[P], AggregateProductImage[P]>
  }




  export type ProductImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductImageWhereInput
    orderBy?: ProductImageOrderByWithAggregationInput | ProductImageOrderByWithAggregationInput[]
    by: ProductImageScalarFieldEnum[] | ProductImageScalarFieldEnum
    having?: ProductImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductImageCountAggregateInputType | true
    _avg?: ProductImageAvgAggregateInputType
    _sum?: ProductImageSumAggregateInputType
    _min?: ProductImageMinAggregateInputType
    _max?: ProductImageMaxAggregateInputType
  }

  export type ProductImageGroupByOutputType = {
    id: number
    url: string
    publicId: string
    order: number
    productId: number
    _count: ProductImageCountAggregateOutputType | null
    _avg: ProductImageAvgAggregateOutputType | null
    _sum: ProductImageSumAggregateOutputType | null
    _min: ProductImageMinAggregateOutputType | null
    _max: ProductImageMaxAggregateOutputType | null
  }

  type GetProductImageGroupByPayload<T extends ProductImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductImageGroupByOutputType[P]>
            : GetScalarType<T[P], ProductImageGroupByOutputType[P]>
        }
      >
    >


  export type ProductImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    order?: boolean
    productId?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productImage"]>

  export type ProductImageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    order?: boolean
    productId?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productImage"]>

  export type ProductImageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    order?: boolean
    productId?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productImage"]>

  export type ProductImageSelectScalar = {
    id?: boolean
    url?: boolean
    publicId?: boolean
    order?: boolean
    productId?: boolean
  }

  export type ProductImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "publicId" | "order" | "productId", ExtArgs["result"]["productImage"]>
  export type ProductImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductImageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductImageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductImage"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      url: string
      publicId: string
      order: number
      productId: number
    }, ExtArgs["result"]["productImage"]>
    composites: {}
  }

  type ProductImageGetPayload<S extends boolean | null | undefined | ProductImageDefaultArgs> = $Result.GetResult<Prisma.$ProductImagePayload, S>

  type ProductImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductImageCountAggregateInputType | true
    }

  export interface ProductImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductImage'], meta: { name: 'ProductImage' } }
    /**
     * Find zero or one ProductImage that matches the filter.
     * @param {ProductImageFindUniqueArgs} args - Arguments to find a ProductImage
     * @example
     * // Get one ProductImage
     * const productImage = await prisma.productImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductImageFindUniqueArgs>(args: SelectSubset<T, ProductImageFindUniqueArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductImageFindUniqueOrThrowArgs} args - Arguments to find a ProductImage
     * @example
     * // Get one ProductImage
     * const productImage = await prisma.productImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductImageFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageFindFirstArgs} args - Arguments to find a ProductImage
     * @example
     * // Get one ProductImage
     * const productImage = await prisma.productImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductImageFindFirstArgs>(args?: SelectSubset<T, ProductImageFindFirstArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageFindFirstOrThrowArgs} args - Arguments to find a ProductImage
     * @example
     * // Get one ProductImage
     * const productImage = await prisma.productImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductImageFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductImages
     * const productImages = await prisma.productImage.findMany()
     * 
     * // Get first 10 ProductImages
     * const productImages = await prisma.productImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productImageWithIdOnly = await prisma.productImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductImageFindManyArgs>(args?: SelectSubset<T, ProductImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductImage.
     * @param {ProductImageCreateArgs} args - Arguments to create a ProductImage.
     * @example
     * // Create one ProductImage
     * const ProductImage = await prisma.productImage.create({
     *   data: {
     *     // ... data to create a ProductImage
     *   }
     * })
     * 
     */
    create<T extends ProductImageCreateArgs>(args: SelectSubset<T, ProductImageCreateArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductImages.
     * @param {ProductImageCreateManyArgs} args - Arguments to create many ProductImages.
     * @example
     * // Create many ProductImages
     * const productImage = await prisma.productImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductImageCreateManyArgs>(args?: SelectSubset<T, ProductImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductImages and returns the data saved in the database.
     * @param {ProductImageCreateManyAndReturnArgs} args - Arguments to create many ProductImages.
     * @example
     * // Create many ProductImages
     * const productImage = await prisma.productImage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductImages and only return the `id`
     * const productImageWithIdOnly = await prisma.productImage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductImageCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductImage.
     * @param {ProductImageDeleteArgs} args - Arguments to delete one ProductImage.
     * @example
     * // Delete one ProductImage
     * const ProductImage = await prisma.productImage.delete({
     *   where: {
     *     // ... filter to delete one ProductImage
     *   }
     * })
     * 
     */
    delete<T extends ProductImageDeleteArgs>(args: SelectSubset<T, ProductImageDeleteArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductImage.
     * @param {ProductImageUpdateArgs} args - Arguments to update one ProductImage.
     * @example
     * // Update one ProductImage
     * const productImage = await prisma.productImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductImageUpdateArgs>(args: SelectSubset<T, ProductImageUpdateArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductImages.
     * @param {ProductImageDeleteManyArgs} args - Arguments to filter ProductImages to delete.
     * @example
     * // Delete a few ProductImages
     * const { count } = await prisma.productImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductImageDeleteManyArgs>(args?: SelectSubset<T, ProductImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductImages
     * const productImage = await prisma.productImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductImageUpdateManyArgs>(args: SelectSubset<T, ProductImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductImages and returns the data updated in the database.
     * @param {ProductImageUpdateManyAndReturnArgs} args - Arguments to update many ProductImages.
     * @example
     * // Update many ProductImages
     * const productImage = await prisma.productImage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductImages and only return the `id`
     * const productImageWithIdOnly = await prisma.productImage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductImageUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductImage.
     * @param {ProductImageUpsertArgs} args - Arguments to update or create a ProductImage.
     * @example
     * // Update or create a ProductImage
     * const productImage = await prisma.productImage.upsert({
     *   create: {
     *     // ... data to create a ProductImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductImage we want to update
     *   }
     * })
     */
    upsert<T extends ProductImageUpsertArgs>(args: SelectSubset<T, ProductImageUpsertArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageCountArgs} args - Arguments to filter ProductImages to count.
     * @example
     * // Count the number of ProductImages
     * const count = await prisma.productImage.count({
     *   where: {
     *     // ... the filter for the ProductImages we want to count
     *   }
     * })
    **/
    count<T extends ProductImageCountArgs>(
      args?: Subset<T, ProductImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductImageAggregateArgs>(args: Subset<T, ProductImageAggregateArgs>): Prisma.PrismaPromise<GetProductImageAggregateType<T>>

    /**
     * Group by ProductImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductImageGroupByArgs['orderBy'] }
        : { orderBy?: ProductImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductImage model
   */
  readonly fields: ProductImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductImage model
   */
  interface ProductImageFieldRefs {
    readonly id: FieldRef<"ProductImage", 'Int'>
    readonly url: FieldRef<"ProductImage", 'String'>
    readonly publicId: FieldRef<"ProductImage", 'String'>
    readonly order: FieldRef<"ProductImage", 'Int'>
    readonly productId: FieldRef<"ProductImage", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ProductImage findUnique
   */
  export type ProductImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImage to fetch.
     */
    where: ProductImageWhereUniqueInput
  }

  /**
   * ProductImage findUniqueOrThrow
   */
  export type ProductImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImage to fetch.
     */
    where: ProductImageWhereUniqueInput
  }

  /**
   * ProductImage findFirst
   */
  export type ProductImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImage to fetch.
     */
    where?: ProductImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductImages.
     */
    cursor?: ProductImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductImages.
     */
    distinct?: ProductImageScalarFieldEnum | ProductImageScalarFieldEnum[]
  }

  /**
   * ProductImage findFirstOrThrow
   */
  export type ProductImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImage to fetch.
     */
    where?: ProductImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductImages.
     */
    cursor?: ProductImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductImages.
     */
    distinct?: ProductImageScalarFieldEnum | ProductImageScalarFieldEnum[]
  }

  /**
   * ProductImage findMany
   */
  export type ProductImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImages to fetch.
     */
    where?: ProductImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductImages.
     */
    cursor?: ProductImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductImages.
     */
    distinct?: ProductImageScalarFieldEnum | ProductImageScalarFieldEnum[]
  }

  /**
   * ProductImage create
   */
  export type ProductImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductImage.
     */
    data: XOR<ProductImageCreateInput, ProductImageUncheckedCreateInput>
  }

  /**
   * ProductImage createMany
   */
  export type ProductImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductImages.
     */
    data: ProductImageCreateManyInput | ProductImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductImage createManyAndReturn
   */
  export type ProductImageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * The data used to create many ProductImages.
     */
    data: ProductImageCreateManyInput | ProductImageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductImage update
   */
  export type ProductImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductImage.
     */
    data: XOR<ProductImageUpdateInput, ProductImageUncheckedUpdateInput>
    /**
     * Choose, which ProductImage to update.
     */
    where: ProductImageWhereUniqueInput
  }

  /**
   * ProductImage updateMany
   */
  export type ProductImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductImages.
     */
    data: XOR<ProductImageUpdateManyMutationInput, ProductImageUncheckedUpdateManyInput>
    /**
     * Filter which ProductImages to update
     */
    where?: ProductImageWhereInput
    /**
     * Limit how many ProductImages to update.
     */
    limit?: number
  }

  /**
   * ProductImage updateManyAndReturn
   */
  export type ProductImageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * The data used to update ProductImages.
     */
    data: XOR<ProductImageUpdateManyMutationInput, ProductImageUncheckedUpdateManyInput>
    /**
     * Filter which ProductImages to update
     */
    where?: ProductImageWhereInput
    /**
     * Limit how many ProductImages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductImage upsert
   */
  export type ProductImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductImage to update in case it exists.
     */
    where: ProductImageWhereUniqueInput
    /**
     * In case the ProductImage found by the `where` argument doesn't exist, create a new ProductImage with this data.
     */
    create: XOR<ProductImageCreateInput, ProductImageUncheckedCreateInput>
    /**
     * In case the ProductImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductImageUpdateInput, ProductImageUncheckedUpdateInput>
  }

  /**
   * ProductImage delete
   */
  export type ProductImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter which ProductImage to delete.
     */
    where: ProductImageWhereUniqueInput
  }

  /**
   * ProductImage deleteMany
   */
  export type ProductImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductImages to delete
     */
    where?: ProductImageWhereInput
    /**
     * Limit how many ProductImages to delete.
     */
    limit?: number
  }

  /**
   * ProductImage without action
   */
  export type ProductImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
  }


  /**
   * Model GalleryPost
   */

  export type AggregateGalleryPost = {
    _count: GalleryPostCountAggregateOutputType | null
    _avg: GalleryPostAvgAggregateOutputType | null
    _sum: GalleryPostSumAggregateOutputType | null
    _min: GalleryPostMinAggregateOutputType | null
    _max: GalleryPostMaxAggregateOutputType | null
  }

  export type GalleryPostAvgAggregateOutputType = {
    id: number | null
  }

  export type GalleryPostSumAggregateOutputType = {
    id: number | null
  }

  export type GalleryPostMinAggregateOutputType = {
    id: number | null
    title: string | null
    content: string | null
    coverUrl: string | null
    coverPublicId: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GalleryPostMaxAggregateOutputType = {
    id: number | null
    title: string | null
    content: string | null
    coverUrl: string | null
    coverPublicId: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GalleryPostCountAggregateOutputType = {
    id: number
    title: number
    content: number
    coverUrl: number
    coverPublicId: number
    date: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GalleryPostAvgAggregateInputType = {
    id?: true
  }

  export type GalleryPostSumAggregateInputType = {
    id?: true
  }

  export type GalleryPostMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    coverUrl?: true
    coverPublicId?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GalleryPostMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    coverUrl?: true
    coverPublicId?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GalleryPostCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    coverUrl?: true
    coverPublicId?: true
    date?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GalleryPostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GalleryPost to aggregate.
     */
    where?: GalleryPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryPosts to fetch.
     */
    orderBy?: GalleryPostOrderByWithRelationInput | GalleryPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GalleryPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GalleryPosts
    **/
    _count?: true | GalleryPostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GalleryPostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GalleryPostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GalleryPostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GalleryPostMaxAggregateInputType
  }

  export type GetGalleryPostAggregateType<T extends GalleryPostAggregateArgs> = {
        [P in keyof T & keyof AggregateGalleryPost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGalleryPost[P]>
      : GetScalarType<T[P], AggregateGalleryPost[P]>
  }




  export type GalleryPostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryPostWhereInput
    orderBy?: GalleryPostOrderByWithAggregationInput | GalleryPostOrderByWithAggregationInput[]
    by: GalleryPostScalarFieldEnum[] | GalleryPostScalarFieldEnum
    having?: GalleryPostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GalleryPostCountAggregateInputType | true
    _avg?: GalleryPostAvgAggregateInputType
    _sum?: GalleryPostSumAggregateInputType
    _min?: GalleryPostMinAggregateInputType
    _max?: GalleryPostMaxAggregateInputType
  }

  export type GalleryPostGroupByOutputType = {
    id: number
    title: string
    content: string
    coverUrl: string | null
    coverPublicId: string
    date: Date | null
    createdAt: Date
    updatedAt: Date
    _count: GalleryPostCountAggregateOutputType | null
    _avg: GalleryPostAvgAggregateOutputType | null
    _sum: GalleryPostSumAggregateOutputType | null
    _min: GalleryPostMinAggregateOutputType | null
    _max: GalleryPostMaxAggregateOutputType | null
  }

  type GetGalleryPostGroupByPayload<T extends GalleryPostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GalleryPostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GalleryPostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GalleryPostGroupByOutputType[P]>
            : GetScalarType<T[P], GalleryPostGroupByOutputType[P]>
        }
      >
    >


  export type GalleryPostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    coverUrl?: boolean
    coverPublicId?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    media?: boolean | GalleryPost$mediaArgs<ExtArgs>
    _count?: boolean | GalleryPostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["galleryPost"]>

  export type GalleryPostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    coverUrl?: boolean
    coverPublicId?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["galleryPost"]>

  export type GalleryPostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    coverUrl?: boolean
    coverPublicId?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["galleryPost"]>

  export type GalleryPostSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    coverUrl?: boolean
    coverPublicId?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GalleryPostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "coverUrl" | "coverPublicId" | "date" | "createdAt" | "updatedAt", ExtArgs["result"]["galleryPost"]>
  export type GalleryPostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | GalleryPost$mediaArgs<ExtArgs>
    _count?: boolean | GalleryPostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GalleryPostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GalleryPostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GalleryPostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GalleryPost"
    objects: {
      media: Prisma.$GalleryPostMediaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      content: string
      coverUrl: string | null
      coverPublicId: string
      date: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["galleryPost"]>
    composites: {}
  }

  type GalleryPostGetPayload<S extends boolean | null | undefined | GalleryPostDefaultArgs> = $Result.GetResult<Prisma.$GalleryPostPayload, S>

  type GalleryPostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GalleryPostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GalleryPostCountAggregateInputType | true
    }

  export interface GalleryPostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GalleryPost'], meta: { name: 'GalleryPost' } }
    /**
     * Find zero or one GalleryPost that matches the filter.
     * @param {GalleryPostFindUniqueArgs} args - Arguments to find a GalleryPost
     * @example
     * // Get one GalleryPost
     * const galleryPost = await prisma.galleryPost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GalleryPostFindUniqueArgs>(args: SelectSubset<T, GalleryPostFindUniqueArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GalleryPost that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GalleryPostFindUniqueOrThrowArgs} args - Arguments to find a GalleryPost
     * @example
     * // Get one GalleryPost
     * const galleryPost = await prisma.galleryPost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GalleryPostFindUniqueOrThrowArgs>(args: SelectSubset<T, GalleryPostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GalleryPost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostFindFirstArgs} args - Arguments to find a GalleryPost
     * @example
     * // Get one GalleryPost
     * const galleryPost = await prisma.galleryPost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GalleryPostFindFirstArgs>(args?: SelectSubset<T, GalleryPostFindFirstArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GalleryPost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostFindFirstOrThrowArgs} args - Arguments to find a GalleryPost
     * @example
     * // Get one GalleryPost
     * const galleryPost = await prisma.galleryPost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GalleryPostFindFirstOrThrowArgs>(args?: SelectSubset<T, GalleryPostFindFirstOrThrowArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GalleryPosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GalleryPosts
     * const galleryPosts = await prisma.galleryPost.findMany()
     * 
     * // Get first 10 GalleryPosts
     * const galleryPosts = await prisma.galleryPost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const galleryPostWithIdOnly = await prisma.galleryPost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GalleryPostFindManyArgs>(args?: SelectSubset<T, GalleryPostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GalleryPost.
     * @param {GalleryPostCreateArgs} args - Arguments to create a GalleryPost.
     * @example
     * // Create one GalleryPost
     * const GalleryPost = await prisma.galleryPost.create({
     *   data: {
     *     // ... data to create a GalleryPost
     *   }
     * })
     * 
     */
    create<T extends GalleryPostCreateArgs>(args: SelectSubset<T, GalleryPostCreateArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GalleryPosts.
     * @param {GalleryPostCreateManyArgs} args - Arguments to create many GalleryPosts.
     * @example
     * // Create many GalleryPosts
     * const galleryPost = await prisma.galleryPost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GalleryPostCreateManyArgs>(args?: SelectSubset<T, GalleryPostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GalleryPosts and returns the data saved in the database.
     * @param {GalleryPostCreateManyAndReturnArgs} args - Arguments to create many GalleryPosts.
     * @example
     * // Create many GalleryPosts
     * const galleryPost = await prisma.galleryPost.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GalleryPosts and only return the `id`
     * const galleryPostWithIdOnly = await prisma.galleryPost.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GalleryPostCreateManyAndReturnArgs>(args?: SelectSubset<T, GalleryPostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GalleryPost.
     * @param {GalleryPostDeleteArgs} args - Arguments to delete one GalleryPost.
     * @example
     * // Delete one GalleryPost
     * const GalleryPost = await prisma.galleryPost.delete({
     *   where: {
     *     // ... filter to delete one GalleryPost
     *   }
     * })
     * 
     */
    delete<T extends GalleryPostDeleteArgs>(args: SelectSubset<T, GalleryPostDeleteArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GalleryPost.
     * @param {GalleryPostUpdateArgs} args - Arguments to update one GalleryPost.
     * @example
     * // Update one GalleryPost
     * const galleryPost = await prisma.galleryPost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GalleryPostUpdateArgs>(args: SelectSubset<T, GalleryPostUpdateArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GalleryPosts.
     * @param {GalleryPostDeleteManyArgs} args - Arguments to filter GalleryPosts to delete.
     * @example
     * // Delete a few GalleryPosts
     * const { count } = await prisma.galleryPost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GalleryPostDeleteManyArgs>(args?: SelectSubset<T, GalleryPostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GalleryPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GalleryPosts
     * const galleryPost = await prisma.galleryPost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GalleryPostUpdateManyArgs>(args: SelectSubset<T, GalleryPostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GalleryPosts and returns the data updated in the database.
     * @param {GalleryPostUpdateManyAndReturnArgs} args - Arguments to update many GalleryPosts.
     * @example
     * // Update many GalleryPosts
     * const galleryPost = await prisma.galleryPost.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GalleryPosts and only return the `id`
     * const galleryPostWithIdOnly = await prisma.galleryPost.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GalleryPostUpdateManyAndReturnArgs>(args: SelectSubset<T, GalleryPostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GalleryPost.
     * @param {GalleryPostUpsertArgs} args - Arguments to update or create a GalleryPost.
     * @example
     * // Update or create a GalleryPost
     * const galleryPost = await prisma.galleryPost.upsert({
     *   create: {
     *     // ... data to create a GalleryPost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GalleryPost we want to update
     *   }
     * })
     */
    upsert<T extends GalleryPostUpsertArgs>(args: SelectSubset<T, GalleryPostUpsertArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GalleryPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostCountArgs} args - Arguments to filter GalleryPosts to count.
     * @example
     * // Count the number of GalleryPosts
     * const count = await prisma.galleryPost.count({
     *   where: {
     *     // ... the filter for the GalleryPosts we want to count
     *   }
     * })
    **/
    count<T extends GalleryPostCountArgs>(
      args?: Subset<T, GalleryPostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GalleryPostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GalleryPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GalleryPostAggregateArgs>(args: Subset<T, GalleryPostAggregateArgs>): Prisma.PrismaPromise<GetGalleryPostAggregateType<T>>

    /**
     * Group by GalleryPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GalleryPostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GalleryPostGroupByArgs['orderBy'] }
        : { orderBy?: GalleryPostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GalleryPostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGalleryPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GalleryPost model
   */
  readonly fields: GalleryPostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GalleryPost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GalleryPostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    media<T extends GalleryPost$mediaArgs<ExtArgs> = {}>(args?: Subset<T, GalleryPost$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GalleryPost model
   */
  interface GalleryPostFieldRefs {
    readonly id: FieldRef<"GalleryPost", 'Int'>
    readonly title: FieldRef<"GalleryPost", 'String'>
    readonly content: FieldRef<"GalleryPost", 'String'>
    readonly coverUrl: FieldRef<"GalleryPost", 'String'>
    readonly coverPublicId: FieldRef<"GalleryPost", 'String'>
    readonly date: FieldRef<"GalleryPost", 'DateTime'>
    readonly createdAt: FieldRef<"GalleryPost", 'DateTime'>
    readonly updatedAt: FieldRef<"GalleryPost", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GalleryPost findUnique
   */
  export type GalleryPostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPost to fetch.
     */
    where: GalleryPostWhereUniqueInput
  }

  /**
   * GalleryPost findUniqueOrThrow
   */
  export type GalleryPostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPost to fetch.
     */
    where: GalleryPostWhereUniqueInput
  }

  /**
   * GalleryPost findFirst
   */
  export type GalleryPostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPost to fetch.
     */
    where?: GalleryPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryPosts to fetch.
     */
    orderBy?: GalleryPostOrderByWithRelationInput | GalleryPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GalleryPosts.
     */
    cursor?: GalleryPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GalleryPosts.
     */
    distinct?: GalleryPostScalarFieldEnum | GalleryPostScalarFieldEnum[]
  }

  /**
   * GalleryPost findFirstOrThrow
   */
  export type GalleryPostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPost to fetch.
     */
    where?: GalleryPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryPosts to fetch.
     */
    orderBy?: GalleryPostOrderByWithRelationInput | GalleryPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GalleryPosts.
     */
    cursor?: GalleryPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GalleryPosts.
     */
    distinct?: GalleryPostScalarFieldEnum | GalleryPostScalarFieldEnum[]
  }

  /**
   * GalleryPost findMany
   */
  export type GalleryPostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPosts to fetch.
     */
    where?: GalleryPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryPosts to fetch.
     */
    orderBy?: GalleryPostOrderByWithRelationInput | GalleryPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GalleryPosts.
     */
    cursor?: GalleryPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GalleryPosts.
     */
    distinct?: GalleryPostScalarFieldEnum | GalleryPostScalarFieldEnum[]
  }

  /**
   * GalleryPost create
   */
  export type GalleryPostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * The data needed to create a GalleryPost.
     */
    data: XOR<GalleryPostCreateInput, GalleryPostUncheckedCreateInput>
  }

  /**
   * GalleryPost createMany
   */
  export type GalleryPostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GalleryPosts.
     */
    data: GalleryPostCreateManyInput | GalleryPostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GalleryPost createManyAndReturn
   */
  export type GalleryPostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * The data used to create many GalleryPosts.
     */
    data: GalleryPostCreateManyInput | GalleryPostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GalleryPost update
   */
  export type GalleryPostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * The data needed to update a GalleryPost.
     */
    data: XOR<GalleryPostUpdateInput, GalleryPostUncheckedUpdateInput>
    /**
     * Choose, which GalleryPost to update.
     */
    where: GalleryPostWhereUniqueInput
  }

  /**
   * GalleryPost updateMany
   */
  export type GalleryPostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GalleryPosts.
     */
    data: XOR<GalleryPostUpdateManyMutationInput, GalleryPostUncheckedUpdateManyInput>
    /**
     * Filter which GalleryPosts to update
     */
    where?: GalleryPostWhereInput
    /**
     * Limit how many GalleryPosts to update.
     */
    limit?: number
  }

  /**
   * GalleryPost updateManyAndReturn
   */
  export type GalleryPostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * The data used to update GalleryPosts.
     */
    data: XOR<GalleryPostUpdateManyMutationInput, GalleryPostUncheckedUpdateManyInput>
    /**
     * Filter which GalleryPosts to update
     */
    where?: GalleryPostWhereInput
    /**
     * Limit how many GalleryPosts to update.
     */
    limit?: number
  }

  /**
   * GalleryPost upsert
   */
  export type GalleryPostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * The filter to search for the GalleryPost to update in case it exists.
     */
    where: GalleryPostWhereUniqueInput
    /**
     * In case the GalleryPost found by the `where` argument doesn't exist, create a new GalleryPost with this data.
     */
    create: XOR<GalleryPostCreateInput, GalleryPostUncheckedCreateInput>
    /**
     * In case the GalleryPost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GalleryPostUpdateInput, GalleryPostUncheckedUpdateInput>
  }

  /**
   * GalleryPost delete
   */
  export type GalleryPostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
    /**
     * Filter which GalleryPost to delete.
     */
    where: GalleryPostWhereUniqueInput
  }

  /**
   * GalleryPost deleteMany
   */
  export type GalleryPostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GalleryPosts to delete
     */
    where?: GalleryPostWhereInput
    /**
     * Limit how many GalleryPosts to delete.
     */
    limit?: number
  }

  /**
   * GalleryPost.media
   */
  export type GalleryPost$mediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    where?: GalleryPostMediaWhereInput
    orderBy?: GalleryPostMediaOrderByWithRelationInput | GalleryPostMediaOrderByWithRelationInput[]
    cursor?: GalleryPostMediaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GalleryPostMediaScalarFieldEnum | GalleryPostMediaScalarFieldEnum[]
  }

  /**
   * GalleryPost without action
   */
  export type GalleryPostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPost
     */
    select?: GalleryPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPost
     */
    omit?: GalleryPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostInclude<ExtArgs> | null
  }


  /**
   * Model GalleryPostMedia
   */

  export type AggregateGalleryPostMedia = {
    _count: GalleryPostMediaCountAggregateOutputType | null
    _avg: GalleryPostMediaAvgAggregateOutputType | null
    _sum: GalleryPostMediaSumAggregateOutputType | null
    _min: GalleryPostMediaMinAggregateOutputType | null
    _max: GalleryPostMediaMaxAggregateOutputType | null
  }

  export type GalleryPostMediaAvgAggregateOutputType = {
    id: number | null
    order: number | null
    postId: number | null
  }

  export type GalleryPostMediaSumAggregateOutputType = {
    id: number | null
    order: number | null
    postId: number | null
  }

  export type GalleryPostMediaMinAggregateOutputType = {
    id: number | null
    url: string | null
    publicId: string | null
    type: $Enums.MediaType | null
    order: number | null
    postId: number | null
  }

  export type GalleryPostMediaMaxAggregateOutputType = {
    id: number | null
    url: string | null
    publicId: string | null
    type: $Enums.MediaType | null
    order: number | null
    postId: number | null
  }

  export type GalleryPostMediaCountAggregateOutputType = {
    id: number
    url: number
    publicId: number
    type: number
    order: number
    postId: number
    _all: number
  }


  export type GalleryPostMediaAvgAggregateInputType = {
    id?: true
    order?: true
    postId?: true
  }

  export type GalleryPostMediaSumAggregateInputType = {
    id?: true
    order?: true
    postId?: true
  }

  export type GalleryPostMediaMinAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    type?: true
    order?: true
    postId?: true
  }

  export type GalleryPostMediaMaxAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    type?: true
    order?: true
    postId?: true
  }

  export type GalleryPostMediaCountAggregateInputType = {
    id?: true
    url?: true
    publicId?: true
    type?: true
    order?: true
    postId?: true
    _all?: true
  }

  export type GalleryPostMediaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GalleryPostMedia to aggregate.
     */
    where?: GalleryPostMediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryPostMedias to fetch.
     */
    orderBy?: GalleryPostMediaOrderByWithRelationInput | GalleryPostMediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GalleryPostMediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryPostMedias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryPostMedias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GalleryPostMedias
    **/
    _count?: true | GalleryPostMediaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GalleryPostMediaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GalleryPostMediaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GalleryPostMediaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GalleryPostMediaMaxAggregateInputType
  }

  export type GetGalleryPostMediaAggregateType<T extends GalleryPostMediaAggregateArgs> = {
        [P in keyof T & keyof AggregateGalleryPostMedia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGalleryPostMedia[P]>
      : GetScalarType<T[P], AggregateGalleryPostMedia[P]>
  }




  export type GalleryPostMediaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryPostMediaWhereInput
    orderBy?: GalleryPostMediaOrderByWithAggregationInput | GalleryPostMediaOrderByWithAggregationInput[]
    by: GalleryPostMediaScalarFieldEnum[] | GalleryPostMediaScalarFieldEnum
    having?: GalleryPostMediaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GalleryPostMediaCountAggregateInputType | true
    _avg?: GalleryPostMediaAvgAggregateInputType
    _sum?: GalleryPostMediaSumAggregateInputType
    _min?: GalleryPostMediaMinAggregateInputType
    _max?: GalleryPostMediaMaxAggregateInputType
  }

  export type GalleryPostMediaGroupByOutputType = {
    id: number
    url: string
    publicId: string
    type: $Enums.MediaType
    order: number
    postId: number
    _count: GalleryPostMediaCountAggregateOutputType | null
    _avg: GalleryPostMediaAvgAggregateOutputType | null
    _sum: GalleryPostMediaSumAggregateOutputType | null
    _min: GalleryPostMediaMinAggregateOutputType | null
    _max: GalleryPostMediaMaxAggregateOutputType | null
  }

  type GetGalleryPostMediaGroupByPayload<T extends GalleryPostMediaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GalleryPostMediaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GalleryPostMediaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GalleryPostMediaGroupByOutputType[P]>
            : GetScalarType<T[P], GalleryPostMediaGroupByOutputType[P]>
        }
      >
    >


  export type GalleryPostMediaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    type?: boolean
    order?: boolean
    postId?: boolean
    post?: boolean | GalleryPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["galleryPostMedia"]>

  export type GalleryPostMediaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    type?: boolean
    order?: boolean
    postId?: boolean
    post?: boolean | GalleryPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["galleryPostMedia"]>

  export type GalleryPostMediaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    publicId?: boolean
    type?: boolean
    order?: boolean
    postId?: boolean
    post?: boolean | GalleryPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["galleryPostMedia"]>

  export type GalleryPostMediaSelectScalar = {
    id?: boolean
    url?: boolean
    publicId?: boolean
    type?: boolean
    order?: boolean
    postId?: boolean
  }

  export type GalleryPostMediaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "publicId" | "type" | "order" | "postId", ExtArgs["result"]["galleryPostMedia"]>
  export type GalleryPostMediaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | GalleryPostDefaultArgs<ExtArgs>
  }
  export type GalleryPostMediaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | GalleryPostDefaultArgs<ExtArgs>
  }
  export type GalleryPostMediaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | GalleryPostDefaultArgs<ExtArgs>
  }

  export type $GalleryPostMediaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GalleryPostMedia"
    objects: {
      post: Prisma.$GalleryPostPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      url: string
      publicId: string
      type: $Enums.MediaType
      order: number
      postId: number
    }, ExtArgs["result"]["galleryPostMedia"]>
    composites: {}
  }

  type GalleryPostMediaGetPayload<S extends boolean | null | undefined | GalleryPostMediaDefaultArgs> = $Result.GetResult<Prisma.$GalleryPostMediaPayload, S>

  type GalleryPostMediaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GalleryPostMediaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GalleryPostMediaCountAggregateInputType | true
    }

  export interface GalleryPostMediaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GalleryPostMedia'], meta: { name: 'GalleryPostMedia' } }
    /**
     * Find zero or one GalleryPostMedia that matches the filter.
     * @param {GalleryPostMediaFindUniqueArgs} args - Arguments to find a GalleryPostMedia
     * @example
     * // Get one GalleryPostMedia
     * const galleryPostMedia = await prisma.galleryPostMedia.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GalleryPostMediaFindUniqueArgs>(args: SelectSubset<T, GalleryPostMediaFindUniqueArgs<ExtArgs>>): Prisma__GalleryPostMediaClient<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GalleryPostMedia that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GalleryPostMediaFindUniqueOrThrowArgs} args - Arguments to find a GalleryPostMedia
     * @example
     * // Get one GalleryPostMedia
     * const galleryPostMedia = await prisma.galleryPostMedia.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GalleryPostMediaFindUniqueOrThrowArgs>(args: SelectSubset<T, GalleryPostMediaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GalleryPostMediaClient<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GalleryPostMedia that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostMediaFindFirstArgs} args - Arguments to find a GalleryPostMedia
     * @example
     * // Get one GalleryPostMedia
     * const galleryPostMedia = await prisma.galleryPostMedia.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GalleryPostMediaFindFirstArgs>(args?: SelectSubset<T, GalleryPostMediaFindFirstArgs<ExtArgs>>): Prisma__GalleryPostMediaClient<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GalleryPostMedia that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostMediaFindFirstOrThrowArgs} args - Arguments to find a GalleryPostMedia
     * @example
     * // Get one GalleryPostMedia
     * const galleryPostMedia = await prisma.galleryPostMedia.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GalleryPostMediaFindFirstOrThrowArgs>(args?: SelectSubset<T, GalleryPostMediaFindFirstOrThrowArgs<ExtArgs>>): Prisma__GalleryPostMediaClient<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GalleryPostMedias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostMediaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GalleryPostMedias
     * const galleryPostMedias = await prisma.galleryPostMedia.findMany()
     * 
     * // Get first 10 GalleryPostMedias
     * const galleryPostMedias = await prisma.galleryPostMedia.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const galleryPostMediaWithIdOnly = await prisma.galleryPostMedia.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GalleryPostMediaFindManyArgs>(args?: SelectSubset<T, GalleryPostMediaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GalleryPostMedia.
     * @param {GalleryPostMediaCreateArgs} args - Arguments to create a GalleryPostMedia.
     * @example
     * // Create one GalleryPostMedia
     * const GalleryPostMedia = await prisma.galleryPostMedia.create({
     *   data: {
     *     // ... data to create a GalleryPostMedia
     *   }
     * })
     * 
     */
    create<T extends GalleryPostMediaCreateArgs>(args: SelectSubset<T, GalleryPostMediaCreateArgs<ExtArgs>>): Prisma__GalleryPostMediaClient<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GalleryPostMedias.
     * @param {GalleryPostMediaCreateManyArgs} args - Arguments to create many GalleryPostMedias.
     * @example
     * // Create many GalleryPostMedias
     * const galleryPostMedia = await prisma.galleryPostMedia.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GalleryPostMediaCreateManyArgs>(args?: SelectSubset<T, GalleryPostMediaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GalleryPostMedias and returns the data saved in the database.
     * @param {GalleryPostMediaCreateManyAndReturnArgs} args - Arguments to create many GalleryPostMedias.
     * @example
     * // Create many GalleryPostMedias
     * const galleryPostMedia = await prisma.galleryPostMedia.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GalleryPostMedias and only return the `id`
     * const galleryPostMediaWithIdOnly = await prisma.galleryPostMedia.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GalleryPostMediaCreateManyAndReturnArgs>(args?: SelectSubset<T, GalleryPostMediaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GalleryPostMedia.
     * @param {GalleryPostMediaDeleteArgs} args - Arguments to delete one GalleryPostMedia.
     * @example
     * // Delete one GalleryPostMedia
     * const GalleryPostMedia = await prisma.galleryPostMedia.delete({
     *   where: {
     *     // ... filter to delete one GalleryPostMedia
     *   }
     * })
     * 
     */
    delete<T extends GalleryPostMediaDeleteArgs>(args: SelectSubset<T, GalleryPostMediaDeleteArgs<ExtArgs>>): Prisma__GalleryPostMediaClient<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GalleryPostMedia.
     * @param {GalleryPostMediaUpdateArgs} args - Arguments to update one GalleryPostMedia.
     * @example
     * // Update one GalleryPostMedia
     * const galleryPostMedia = await prisma.galleryPostMedia.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GalleryPostMediaUpdateArgs>(args: SelectSubset<T, GalleryPostMediaUpdateArgs<ExtArgs>>): Prisma__GalleryPostMediaClient<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GalleryPostMedias.
     * @param {GalleryPostMediaDeleteManyArgs} args - Arguments to filter GalleryPostMedias to delete.
     * @example
     * // Delete a few GalleryPostMedias
     * const { count } = await prisma.galleryPostMedia.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GalleryPostMediaDeleteManyArgs>(args?: SelectSubset<T, GalleryPostMediaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GalleryPostMedias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostMediaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GalleryPostMedias
     * const galleryPostMedia = await prisma.galleryPostMedia.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GalleryPostMediaUpdateManyArgs>(args: SelectSubset<T, GalleryPostMediaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GalleryPostMedias and returns the data updated in the database.
     * @param {GalleryPostMediaUpdateManyAndReturnArgs} args - Arguments to update many GalleryPostMedias.
     * @example
     * // Update many GalleryPostMedias
     * const galleryPostMedia = await prisma.galleryPostMedia.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GalleryPostMedias and only return the `id`
     * const galleryPostMediaWithIdOnly = await prisma.galleryPostMedia.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GalleryPostMediaUpdateManyAndReturnArgs>(args: SelectSubset<T, GalleryPostMediaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GalleryPostMedia.
     * @param {GalleryPostMediaUpsertArgs} args - Arguments to update or create a GalleryPostMedia.
     * @example
     * // Update or create a GalleryPostMedia
     * const galleryPostMedia = await prisma.galleryPostMedia.upsert({
     *   create: {
     *     // ... data to create a GalleryPostMedia
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GalleryPostMedia we want to update
     *   }
     * })
     */
    upsert<T extends GalleryPostMediaUpsertArgs>(args: SelectSubset<T, GalleryPostMediaUpsertArgs<ExtArgs>>): Prisma__GalleryPostMediaClient<$Result.GetResult<Prisma.$GalleryPostMediaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GalleryPostMedias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostMediaCountArgs} args - Arguments to filter GalleryPostMedias to count.
     * @example
     * // Count the number of GalleryPostMedias
     * const count = await prisma.galleryPostMedia.count({
     *   where: {
     *     // ... the filter for the GalleryPostMedias we want to count
     *   }
     * })
    **/
    count<T extends GalleryPostMediaCountArgs>(
      args?: Subset<T, GalleryPostMediaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GalleryPostMediaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GalleryPostMedia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostMediaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GalleryPostMediaAggregateArgs>(args: Subset<T, GalleryPostMediaAggregateArgs>): Prisma.PrismaPromise<GetGalleryPostMediaAggregateType<T>>

    /**
     * Group by GalleryPostMedia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryPostMediaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GalleryPostMediaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GalleryPostMediaGroupByArgs['orderBy'] }
        : { orderBy?: GalleryPostMediaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GalleryPostMediaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGalleryPostMediaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GalleryPostMedia model
   */
  readonly fields: GalleryPostMediaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GalleryPostMedia.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GalleryPostMediaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends GalleryPostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GalleryPostDefaultArgs<ExtArgs>>): Prisma__GalleryPostClient<$Result.GetResult<Prisma.$GalleryPostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GalleryPostMedia model
   */
  interface GalleryPostMediaFieldRefs {
    readonly id: FieldRef<"GalleryPostMedia", 'Int'>
    readonly url: FieldRef<"GalleryPostMedia", 'String'>
    readonly publicId: FieldRef<"GalleryPostMedia", 'String'>
    readonly type: FieldRef<"GalleryPostMedia", 'MediaType'>
    readonly order: FieldRef<"GalleryPostMedia", 'Int'>
    readonly postId: FieldRef<"GalleryPostMedia", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * GalleryPostMedia findUnique
   */
  export type GalleryPostMediaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPostMedia to fetch.
     */
    where: GalleryPostMediaWhereUniqueInput
  }

  /**
   * GalleryPostMedia findUniqueOrThrow
   */
  export type GalleryPostMediaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPostMedia to fetch.
     */
    where: GalleryPostMediaWhereUniqueInput
  }

  /**
   * GalleryPostMedia findFirst
   */
  export type GalleryPostMediaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPostMedia to fetch.
     */
    where?: GalleryPostMediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryPostMedias to fetch.
     */
    orderBy?: GalleryPostMediaOrderByWithRelationInput | GalleryPostMediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GalleryPostMedias.
     */
    cursor?: GalleryPostMediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryPostMedias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryPostMedias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GalleryPostMedias.
     */
    distinct?: GalleryPostMediaScalarFieldEnum | GalleryPostMediaScalarFieldEnum[]
  }

  /**
   * GalleryPostMedia findFirstOrThrow
   */
  export type GalleryPostMediaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPostMedia to fetch.
     */
    where?: GalleryPostMediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryPostMedias to fetch.
     */
    orderBy?: GalleryPostMediaOrderByWithRelationInput | GalleryPostMediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GalleryPostMedias.
     */
    cursor?: GalleryPostMediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryPostMedias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryPostMedias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GalleryPostMedias.
     */
    distinct?: GalleryPostMediaScalarFieldEnum | GalleryPostMediaScalarFieldEnum[]
  }

  /**
   * GalleryPostMedia findMany
   */
  export type GalleryPostMediaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * Filter, which GalleryPostMedias to fetch.
     */
    where?: GalleryPostMediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryPostMedias to fetch.
     */
    orderBy?: GalleryPostMediaOrderByWithRelationInput | GalleryPostMediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GalleryPostMedias.
     */
    cursor?: GalleryPostMediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryPostMedias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryPostMedias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GalleryPostMedias.
     */
    distinct?: GalleryPostMediaScalarFieldEnum | GalleryPostMediaScalarFieldEnum[]
  }

  /**
   * GalleryPostMedia create
   */
  export type GalleryPostMediaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * The data needed to create a GalleryPostMedia.
     */
    data: XOR<GalleryPostMediaCreateInput, GalleryPostMediaUncheckedCreateInput>
  }

  /**
   * GalleryPostMedia createMany
   */
  export type GalleryPostMediaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GalleryPostMedias.
     */
    data: GalleryPostMediaCreateManyInput | GalleryPostMediaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GalleryPostMedia createManyAndReturn
   */
  export type GalleryPostMediaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * The data used to create many GalleryPostMedias.
     */
    data: GalleryPostMediaCreateManyInput | GalleryPostMediaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GalleryPostMedia update
   */
  export type GalleryPostMediaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * The data needed to update a GalleryPostMedia.
     */
    data: XOR<GalleryPostMediaUpdateInput, GalleryPostMediaUncheckedUpdateInput>
    /**
     * Choose, which GalleryPostMedia to update.
     */
    where: GalleryPostMediaWhereUniqueInput
  }

  /**
   * GalleryPostMedia updateMany
   */
  export type GalleryPostMediaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GalleryPostMedias.
     */
    data: XOR<GalleryPostMediaUpdateManyMutationInput, GalleryPostMediaUncheckedUpdateManyInput>
    /**
     * Filter which GalleryPostMedias to update
     */
    where?: GalleryPostMediaWhereInput
    /**
     * Limit how many GalleryPostMedias to update.
     */
    limit?: number
  }

  /**
   * GalleryPostMedia updateManyAndReturn
   */
  export type GalleryPostMediaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * The data used to update GalleryPostMedias.
     */
    data: XOR<GalleryPostMediaUpdateManyMutationInput, GalleryPostMediaUncheckedUpdateManyInput>
    /**
     * Filter which GalleryPostMedias to update
     */
    where?: GalleryPostMediaWhereInput
    /**
     * Limit how many GalleryPostMedias to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GalleryPostMedia upsert
   */
  export type GalleryPostMediaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * The filter to search for the GalleryPostMedia to update in case it exists.
     */
    where: GalleryPostMediaWhereUniqueInput
    /**
     * In case the GalleryPostMedia found by the `where` argument doesn't exist, create a new GalleryPostMedia with this data.
     */
    create: XOR<GalleryPostMediaCreateInput, GalleryPostMediaUncheckedCreateInput>
    /**
     * In case the GalleryPostMedia was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GalleryPostMediaUpdateInput, GalleryPostMediaUncheckedUpdateInput>
  }

  /**
   * GalleryPostMedia delete
   */
  export type GalleryPostMediaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
    /**
     * Filter which GalleryPostMedia to delete.
     */
    where: GalleryPostMediaWhereUniqueInput
  }

  /**
   * GalleryPostMedia deleteMany
   */
  export type GalleryPostMediaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GalleryPostMedias to delete
     */
    where?: GalleryPostMediaWhereInput
    /**
     * Limit how many GalleryPostMedias to delete.
     */
    limit?: number
  }

  /**
   * GalleryPostMedia without action
   */
  export type GalleryPostMediaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryPostMedia
     */
    select?: GalleryPostMediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryPostMedia
     */
    omit?: GalleryPostMediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryPostMediaInclude<ExtArgs> | null
  }


  /**
   * Model AdminUser
   */

  export type AggregateAdminUser = {
    _count: AdminUserCountAggregateOutputType | null
    _min: AdminUserMinAggregateOutputType | null
    _max: AdminUserMaxAggregateOutputType | null
  }

  export type AdminUserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminUserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminUserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminUserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminUserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminUserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminUser to aggregate.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminUsers
    **/
    _count?: true | AdminUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminUserMaxAggregateInputType
  }

  export type GetAdminUserAggregateType<T extends AdminUserAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminUser[P]>
      : GetScalarType<T[P], AggregateAdminUser[P]>
  }




  export type AdminUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminUserWhereInput
    orderBy?: AdminUserOrderByWithAggregationInput | AdminUserOrderByWithAggregationInput[]
    by: AdminUserScalarFieldEnum[] | AdminUserScalarFieldEnum
    having?: AdminUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminUserCountAggregateInputType | true
    _min?: AdminUserMinAggregateInputType
    _max?: AdminUserMaxAggregateInputType
  }

  export type AdminUserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
    _count: AdminUserCountAggregateOutputType | null
    _min: AdminUserMinAggregateOutputType | null
    _max: AdminUserMaxAggregateOutputType | null
  }

  type GetAdminUserGroupByPayload<T extends AdminUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminUserGroupByOutputType[P]>
            : GetScalarType<T[P], AdminUserGroupByOutputType[P]>
        }
      >
    >


  export type AdminUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AdminUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "createdAt" | "updatedAt", ExtArgs["result"]["adminUser"]>

  export type $AdminUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["adminUser"]>
    composites: {}
  }

  type AdminUserGetPayload<S extends boolean | null | undefined | AdminUserDefaultArgs> = $Result.GetResult<Prisma.$AdminUserPayload, S>

  type AdminUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminUserCountAggregateInputType | true
    }

  export interface AdminUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminUser'], meta: { name: 'AdminUser' } }
    /**
     * Find zero or one AdminUser that matches the filter.
     * @param {AdminUserFindUniqueArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminUserFindUniqueArgs>(args: SelectSubset<T, AdminUserFindUniqueArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdminUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminUserFindUniqueOrThrowArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminUserFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindFirstArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminUserFindFirstArgs>(args?: SelectSubset<T, AdminUserFindFirstArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindFirstOrThrowArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminUserFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminUsers
     * const adminUsers = await prisma.adminUser.findMany()
     * 
     * // Get first 10 AdminUsers
     * const adminUsers = await prisma.adminUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminUserFindManyArgs>(args?: SelectSubset<T, AdminUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdminUser.
     * @param {AdminUserCreateArgs} args - Arguments to create a AdminUser.
     * @example
     * // Create one AdminUser
     * const AdminUser = await prisma.adminUser.create({
     *   data: {
     *     // ... data to create a AdminUser
     *   }
     * })
     * 
     */
    create<T extends AdminUserCreateArgs>(args: SelectSubset<T, AdminUserCreateArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdminUsers.
     * @param {AdminUserCreateManyArgs} args - Arguments to create many AdminUsers.
     * @example
     * // Create many AdminUsers
     * const adminUser = await prisma.adminUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminUserCreateManyArgs>(args?: SelectSubset<T, AdminUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminUsers and returns the data saved in the database.
     * @param {AdminUserCreateManyAndReturnArgs} args - Arguments to create many AdminUsers.
     * @example
     * // Create many AdminUsers
     * const adminUser = await prisma.adminUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminUsers and only return the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminUserCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AdminUser.
     * @param {AdminUserDeleteArgs} args - Arguments to delete one AdminUser.
     * @example
     * // Delete one AdminUser
     * const AdminUser = await prisma.adminUser.delete({
     *   where: {
     *     // ... filter to delete one AdminUser
     *   }
     * })
     * 
     */
    delete<T extends AdminUserDeleteArgs>(args: SelectSubset<T, AdminUserDeleteArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdminUser.
     * @param {AdminUserUpdateArgs} args - Arguments to update one AdminUser.
     * @example
     * // Update one AdminUser
     * const adminUser = await prisma.adminUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUserUpdateArgs>(args: SelectSubset<T, AdminUserUpdateArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdminUsers.
     * @param {AdminUserDeleteManyArgs} args - Arguments to filter AdminUsers to delete.
     * @example
     * // Delete a few AdminUsers
     * const { count } = await prisma.adminUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminUserDeleteManyArgs>(args?: SelectSubset<T, AdminUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminUsers
     * const adminUser = await prisma.adminUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUserUpdateManyArgs>(args: SelectSubset<T, AdminUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminUsers and returns the data updated in the database.
     * @param {AdminUserUpdateManyAndReturnArgs} args - Arguments to update many AdminUsers.
     * @example
     * // Update many AdminUsers
     * const adminUser = await prisma.adminUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AdminUsers and only return the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminUserUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AdminUser.
     * @param {AdminUserUpsertArgs} args - Arguments to update or create a AdminUser.
     * @example
     * // Update or create a AdminUser
     * const adminUser = await prisma.adminUser.upsert({
     *   create: {
     *     // ... data to create a AdminUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminUser we want to update
     *   }
     * })
     */
    upsert<T extends AdminUserUpsertArgs>(args: SelectSubset<T, AdminUserUpsertArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserCountArgs} args - Arguments to filter AdminUsers to count.
     * @example
     * // Count the number of AdminUsers
     * const count = await prisma.adminUser.count({
     *   where: {
     *     // ... the filter for the AdminUsers we want to count
     *   }
     * })
    **/
    count<T extends AdminUserCountArgs>(
      args?: Subset<T, AdminUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminUserAggregateArgs>(args: Subset<T, AdminUserAggregateArgs>): Prisma.PrismaPromise<GetAdminUserAggregateType<T>>

    /**
     * Group by AdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminUserGroupByArgs['orderBy'] }
        : { orderBy?: AdminUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminUser model
   */
  readonly fields: AdminUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminUser model
   */
  interface AdminUserFieldRefs {
    readonly id: FieldRef<"AdminUser", 'String'>
    readonly email: FieldRef<"AdminUser", 'String'>
    readonly passwordHash: FieldRef<"AdminUser", 'String'>
    readonly createdAt: FieldRef<"AdminUser", 'DateTime'>
    readonly updatedAt: FieldRef<"AdminUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminUser findUnique
   */
  export type AdminUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser findUniqueOrThrow
   */
  export type AdminUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser findFirst
   */
  export type AdminUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser findFirstOrThrow
   */
  export type AdminUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser findMany
   */
  export type AdminUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUsers to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser create
   */
  export type AdminUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data needed to create a AdminUser.
     */
    data: XOR<AdminUserCreateInput, AdminUserUncheckedCreateInput>
  }

  /**
   * AdminUser createMany
   */
  export type AdminUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminUsers.
     */
    data: AdminUserCreateManyInput | AdminUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminUser createManyAndReturn
   */
  export type AdminUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data used to create many AdminUsers.
     */
    data: AdminUserCreateManyInput | AdminUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminUser update
   */
  export type AdminUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data needed to update a AdminUser.
     */
    data: XOR<AdminUserUpdateInput, AdminUserUncheckedUpdateInput>
    /**
     * Choose, which AdminUser to update.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser updateMany
   */
  export type AdminUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminUsers.
     */
    data: XOR<AdminUserUpdateManyMutationInput, AdminUserUncheckedUpdateManyInput>
    /**
     * Filter which AdminUsers to update
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to update.
     */
    limit?: number
  }

  /**
   * AdminUser updateManyAndReturn
   */
  export type AdminUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data used to update AdminUsers.
     */
    data: XOR<AdminUserUpdateManyMutationInput, AdminUserUncheckedUpdateManyInput>
    /**
     * Filter which AdminUsers to update
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to update.
     */
    limit?: number
  }

  /**
   * AdminUser upsert
   */
  export type AdminUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The filter to search for the AdminUser to update in case it exists.
     */
    where: AdminUserWhereUniqueInput
    /**
     * In case the AdminUser found by the `where` argument doesn't exist, create a new AdminUser with this data.
     */
    create: XOR<AdminUserCreateInput, AdminUserUncheckedCreateInput>
    /**
     * In case the AdminUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUserUpdateInput, AdminUserUncheckedUpdateInput>
  }

  /**
   * AdminUser delete
   */
  export type AdminUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter which AdminUser to delete.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser deleteMany
   */
  export type AdminUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminUsers to delete
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to delete.
     */
    limit?: number
  }

  /**
   * AdminUser without action
   */
  export type AdminUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AuthorScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    bio: 'bio',
    photoUrl: 'photoUrl',
    photoPublicId: 'photoPublicId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthorScalarFieldEnum = (typeof AuthorScalarFieldEnum)[keyof typeof AuthorScalarFieldEnum]


  export const CollectionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    coverPhotoUrl: 'coverPhotoUrl',
    coverPhotoPublicId: 'coverPhotoPublicId',
    authorId: 'authorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CollectionScalarFieldEnum = (typeof CollectionScalarFieldEnum)[keyof typeof CollectionScalarFieldEnum]


  export const PaintingScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    coverUrl: 'coverUrl',
    coverPublicId: 'coverPublicId',
    hasNeon: 'hasNeon',
    isForSale: 'isForSale',
    sortOrder: 'sortOrder',
    year: 'year',
    authorId: 'authorId',
    collectionId: 'collectionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PaintingScalarFieldEnum = (typeof PaintingScalarFieldEnum)[keyof typeof PaintingScalarFieldEnum]


  export const PaintingMediaScalarFieldEnum: {
    id: 'id',
    url: 'url',
    publicId: 'publicId',
    isNeon: 'isNeon',
    order: 'order',
    type: 'type',
    paintingId: 'paintingId'
  };

  export type PaintingMediaScalarFieldEnum = (typeof PaintingMediaScalarFieldEnum)[keyof typeof PaintingMediaScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    price: 'price',
    stock: 'stock',
    sortOrder: 'sortOrder',
    categoryId: 'categoryId',
    authorId: 'authorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ProductImageScalarFieldEnum: {
    id: 'id',
    url: 'url',
    publicId: 'publicId',
    order: 'order',
    productId: 'productId'
  };

  export type ProductImageScalarFieldEnum = (typeof ProductImageScalarFieldEnum)[keyof typeof ProductImageScalarFieldEnum]


  export const GalleryPostScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    coverUrl: 'coverUrl',
    coverPublicId: 'coverPublicId',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GalleryPostScalarFieldEnum = (typeof GalleryPostScalarFieldEnum)[keyof typeof GalleryPostScalarFieldEnum]


  export const GalleryPostMediaScalarFieldEnum: {
    id: 'id',
    url: 'url',
    publicId: 'publicId',
    type: 'type',
    order: 'order',
    postId: 'postId'
  };

  export type GalleryPostMediaScalarFieldEnum = (typeof GalleryPostMediaScalarFieldEnum)[keyof typeof GalleryPostMediaScalarFieldEnum]


  export const AdminUserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AdminUserScalarFieldEnum = (typeof AdminUserScalarFieldEnum)[keyof typeof AdminUserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'MediaType'
   */
  export type EnumMediaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MediaType'>
    


  /**
   * Reference to a field of type 'MediaType[]'
   */
  export type ListEnumMediaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MediaType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AuthorWhereInput = {
    AND?: AuthorWhereInput | AuthorWhereInput[]
    OR?: AuthorWhereInput[]
    NOT?: AuthorWhereInput | AuthorWhereInput[]
    id?: IntFilter<"Author"> | number
    firstName?: StringFilter<"Author"> | string
    lastName?: StringFilter<"Author"> | string
    bio?: StringNullableFilter<"Author"> | string | null
    photoUrl?: StringNullableFilter<"Author"> | string | null
    photoPublicId?: StringFilter<"Author"> | string
    createdAt?: DateTimeFilter<"Author"> | Date | string
    updatedAt?: DateTimeFilter<"Author"> | Date | string
    paintings?: PaintingListRelationFilter
    collections?: CollectionListRelationFilter
    products?: ProductListRelationFilter
  }

  export type AuthorOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    photoPublicId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paintings?: PaintingOrderByRelationAggregateInput
    collections?: CollectionOrderByRelationAggregateInput
    products?: ProductOrderByRelationAggregateInput
  }

  export type AuthorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AuthorWhereInput | AuthorWhereInput[]
    OR?: AuthorWhereInput[]
    NOT?: AuthorWhereInput | AuthorWhereInput[]
    firstName?: StringFilter<"Author"> | string
    lastName?: StringFilter<"Author"> | string
    bio?: StringNullableFilter<"Author"> | string | null
    photoUrl?: StringNullableFilter<"Author"> | string | null
    photoPublicId?: StringFilter<"Author"> | string
    createdAt?: DateTimeFilter<"Author"> | Date | string
    updatedAt?: DateTimeFilter<"Author"> | Date | string
    paintings?: PaintingListRelationFilter
    collections?: CollectionListRelationFilter
    products?: ProductListRelationFilter
  }, "id">

  export type AuthorOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    photoPublicId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthorCountOrderByAggregateInput
    _avg?: AuthorAvgOrderByAggregateInput
    _max?: AuthorMaxOrderByAggregateInput
    _min?: AuthorMinOrderByAggregateInput
    _sum?: AuthorSumOrderByAggregateInput
  }

  export type AuthorScalarWhereWithAggregatesInput = {
    AND?: AuthorScalarWhereWithAggregatesInput | AuthorScalarWhereWithAggregatesInput[]
    OR?: AuthorScalarWhereWithAggregatesInput[]
    NOT?: AuthorScalarWhereWithAggregatesInput | AuthorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Author"> | number
    firstName?: StringWithAggregatesFilter<"Author"> | string
    lastName?: StringWithAggregatesFilter<"Author"> | string
    bio?: StringNullableWithAggregatesFilter<"Author"> | string | null
    photoUrl?: StringNullableWithAggregatesFilter<"Author"> | string | null
    photoPublicId?: StringWithAggregatesFilter<"Author"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Author"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Author"> | Date | string
  }

  export type CollectionWhereInput = {
    AND?: CollectionWhereInput | CollectionWhereInput[]
    OR?: CollectionWhereInput[]
    NOT?: CollectionWhereInput | CollectionWhereInput[]
    id?: IntFilter<"Collection"> | number
    title?: StringFilter<"Collection"> | string
    coverPhotoUrl?: StringNullableFilter<"Collection"> | string | null
    coverPhotoPublicId?: StringFilter<"Collection"> | string
    authorId?: IntFilter<"Collection"> | number
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
    author?: XOR<AuthorScalarRelationFilter, AuthorWhereInput>
    paintings?: PaintingListRelationFilter
  }

  export type CollectionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    coverPhotoUrl?: SortOrderInput | SortOrder
    coverPhotoPublicId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    author?: AuthorOrderByWithRelationInput
    paintings?: PaintingOrderByRelationAggregateInput
  }

  export type CollectionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CollectionWhereInput | CollectionWhereInput[]
    OR?: CollectionWhereInput[]
    NOT?: CollectionWhereInput | CollectionWhereInput[]
    title?: StringFilter<"Collection"> | string
    coverPhotoUrl?: StringNullableFilter<"Collection"> | string | null
    coverPhotoPublicId?: StringFilter<"Collection"> | string
    authorId?: IntFilter<"Collection"> | number
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
    author?: XOR<AuthorScalarRelationFilter, AuthorWhereInput>
    paintings?: PaintingListRelationFilter
  }, "id">

  export type CollectionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    coverPhotoUrl?: SortOrderInput | SortOrder
    coverPhotoPublicId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CollectionCountOrderByAggregateInput
    _avg?: CollectionAvgOrderByAggregateInput
    _max?: CollectionMaxOrderByAggregateInput
    _min?: CollectionMinOrderByAggregateInput
    _sum?: CollectionSumOrderByAggregateInput
  }

  export type CollectionScalarWhereWithAggregatesInput = {
    AND?: CollectionScalarWhereWithAggregatesInput | CollectionScalarWhereWithAggregatesInput[]
    OR?: CollectionScalarWhereWithAggregatesInput[]
    NOT?: CollectionScalarWhereWithAggregatesInput | CollectionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Collection"> | number
    title?: StringWithAggregatesFilter<"Collection"> | string
    coverPhotoUrl?: StringNullableWithAggregatesFilter<"Collection"> | string | null
    coverPhotoPublicId?: StringWithAggregatesFilter<"Collection"> | string
    authorId?: IntWithAggregatesFilter<"Collection"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Collection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Collection"> | Date | string
  }

  export type PaintingWhereInput = {
    AND?: PaintingWhereInput | PaintingWhereInput[]
    OR?: PaintingWhereInput[]
    NOT?: PaintingWhereInput | PaintingWhereInput[]
    id?: IntFilter<"Painting"> | number
    title?: StringFilter<"Painting"> | string
    description?: StringNullableFilter<"Painting"> | string | null
    coverUrl?: StringFilter<"Painting"> | string
    coverPublicId?: StringFilter<"Painting"> | string
    hasNeon?: BoolFilter<"Painting"> | boolean
    isForSale?: BoolFilter<"Painting"> | boolean
    sortOrder?: IntFilter<"Painting"> | number
    year?: IntNullableFilter<"Painting"> | number | null
    authorId?: IntFilter<"Painting"> | number
    collectionId?: IntNullableFilter<"Painting"> | number | null
    createdAt?: DateTimeFilter<"Painting"> | Date | string
    updatedAt?: DateTimeFilter<"Painting"> | Date | string
    author?: XOR<AuthorScalarRelationFilter, AuthorWhereInput>
    collection?: XOR<CollectionNullableScalarRelationFilter, CollectionWhereInput> | null
    media?: PaintingMediaListRelationFilter
  }

  export type PaintingOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    coverUrl?: SortOrder
    coverPublicId?: SortOrder
    hasNeon?: SortOrder
    isForSale?: SortOrder
    sortOrder?: SortOrder
    year?: SortOrderInput | SortOrder
    authorId?: SortOrder
    collectionId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    author?: AuthorOrderByWithRelationInput
    collection?: CollectionOrderByWithRelationInput
    media?: PaintingMediaOrderByRelationAggregateInput
  }

  export type PaintingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PaintingWhereInput | PaintingWhereInput[]
    OR?: PaintingWhereInput[]
    NOT?: PaintingWhereInput | PaintingWhereInput[]
    title?: StringFilter<"Painting"> | string
    description?: StringNullableFilter<"Painting"> | string | null
    coverUrl?: StringFilter<"Painting"> | string
    coverPublicId?: StringFilter<"Painting"> | string
    hasNeon?: BoolFilter<"Painting"> | boolean
    isForSale?: BoolFilter<"Painting"> | boolean
    sortOrder?: IntFilter<"Painting"> | number
    year?: IntNullableFilter<"Painting"> | number | null
    authorId?: IntFilter<"Painting"> | number
    collectionId?: IntNullableFilter<"Painting"> | number | null
    createdAt?: DateTimeFilter<"Painting"> | Date | string
    updatedAt?: DateTimeFilter<"Painting"> | Date | string
    author?: XOR<AuthorScalarRelationFilter, AuthorWhereInput>
    collection?: XOR<CollectionNullableScalarRelationFilter, CollectionWhereInput> | null
    media?: PaintingMediaListRelationFilter
  }, "id">

  export type PaintingOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    coverUrl?: SortOrder
    coverPublicId?: SortOrder
    hasNeon?: SortOrder
    isForSale?: SortOrder
    sortOrder?: SortOrder
    year?: SortOrderInput | SortOrder
    authorId?: SortOrder
    collectionId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaintingCountOrderByAggregateInput
    _avg?: PaintingAvgOrderByAggregateInput
    _max?: PaintingMaxOrderByAggregateInput
    _min?: PaintingMinOrderByAggregateInput
    _sum?: PaintingSumOrderByAggregateInput
  }

  export type PaintingScalarWhereWithAggregatesInput = {
    AND?: PaintingScalarWhereWithAggregatesInput | PaintingScalarWhereWithAggregatesInput[]
    OR?: PaintingScalarWhereWithAggregatesInput[]
    NOT?: PaintingScalarWhereWithAggregatesInput | PaintingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Painting"> | number
    title?: StringWithAggregatesFilter<"Painting"> | string
    description?: StringNullableWithAggregatesFilter<"Painting"> | string | null
    coverUrl?: StringWithAggregatesFilter<"Painting"> | string
    coverPublicId?: StringWithAggregatesFilter<"Painting"> | string
    hasNeon?: BoolWithAggregatesFilter<"Painting"> | boolean
    isForSale?: BoolWithAggregatesFilter<"Painting"> | boolean
    sortOrder?: IntWithAggregatesFilter<"Painting"> | number
    year?: IntNullableWithAggregatesFilter<"Painting"> | number | null
    authorId?: IntWithAggregatesFilter<"Painting"> | number
    collectionId?: IntNullableWithAggregatesFilter<"Painting"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Painting"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Painting"> | Date | string
  }

  export type PaintingMediaWhereInput = {
    AND?: PaintingMediaWhereInput | PaintingMediaWhereInput[]
    OR?: PaintingMediaWhereInput[]
    NOT?: PaintingMediaWhereInput | PaintingMediaWhereInput[]
    id?: IntFilter<"PaintingMedia"> | number
    url?: StringFilter<"PaintingMedia"> | string
    publicId?: StringFilter<"PaintingMedia"> | string
    isNeon?: BoolFilter<"PaintingMedia"> | boolean
    order?: IntFilter<"PaintingMedia"> | number
    type?: EnumMediaTypeFilter<"PaintingMedia"> | $Enums.MediaType
    paintingId?: IntFilter<"PaintingMedia"> | number
    painting?: XOR<PaintingScalarRelationFilter, PaintingWhereInput>
  }

  export type PaintingMediaOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    isNeon?: SortOrder
    order?: SortOrder
    type?: SortOrder
    paintingId?: SortOrder
    painting?: PaintingOrderByWithRelationInput
  }

  export type PaintingMediaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PaintingMediaWhereInput | PaintingMediaWhereInput[]
    OR?: PaintingMediaWhereInput[]
    NOT?: PaintingMediaWhereInput | PaintingMediaWhereInput[]
    url?: StringFilter<"PaintingMedia"> | string
    publicId?: StringFilter<"PaintingMedia"> | string
    isNeon?: BoolFilter<"PaintingMedia"> | boolean
    order?: IntFilter<"PaintingMedia"> | number
    type?: EnumMediaTypeFilter<"PaintingMedia"> | $Enums.MediaType
    paintingId?: IntFilter<"PaintingMedia"> | number
    painting?: XOR<PaintingScalarRelationFilter, PaintingWhereInput>
  }, "id">

  export type PaintingMediaOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    isNeon?: SortOrder
    order?: SortOrder
    type?: SortOrder
    paintingId?: SortOrder
    _count?: PaintingMediaCountOrderByAggregateInput
    _avg?: PaintingMediaAvgOrderByAggregateInput
    _max?: PaintingMediaMaxOrderByAggregateInput
    _min?: PaintingMediaMinOrderByAggregateInput
    _sum?: PaintingMediaSumOrderByAggregateInput
  }

  export type PaintingMediaScalarWhereWithAggregatesInput = {
    AND?: PaintingMediaScalarWhereWithAggregatesInput | PaintingMediaScalarWhereWithAggregatesInput[]
    OR?: PaintingMediaScalarWhereWithAggregatesInput[]
    NOT?: PaintingMediaScalarWhereWithAggregatesInput | PaintingMediaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PaintingMedia"> | number
    url?: StringWithAggregatesFilter<"PaintingMedia"> | string
    publicId?: StringWithAggregatesFilter<"PaintingMedia"> | string
    isNeon?: BoolWithAggregatesFilter<"PaintingMedia"> | boolean
    order?: IntWithAggregatesFilter<"PaintingMedia"> | number
    type?: EnumMediaTypeWithAggregatesFilter<"PaintingMedia"> | $Enums.MediaType
    paintingId?: IntWithAggregatesFilter<"PaintingMedia"> | number
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    products?: ProductListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    products?: ProductOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    slug?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    products?: ProductListRelationFilter
  }, "id" | "name" | "slug">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
    slug?: StringWithAggregatesFilter<"Category"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: IntFilter<"Product"> | number
    title?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    price?: FloatFilter<"Product"> | number
    stock?: IntFilter<"Product"> | number
    sortOrder?: IntFilter<"Product"> | number
    categoryId?: IntFilter<"Product"> | number
    authorId?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
    author?: XOR<AuthorScalarRelationFilter, AuthorWhereInput>
    images?: ProductImageListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    stock?: SortOrder
    sortOrder?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: CategoryOrderByWithRelationInput
    author?: AuthorOrderByWithRelationInput
    images?: ProductImageOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    title?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    price?: FloatFilter<"Product"> | number
    stock?: IntFilter<"Product"> | number
    sortOrder?: IntFilter<"Product"> | number
    categoryId?: IntFilter<"Product"> | number
    authorId?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
    author?: XOR<AuthorScalarRelationFilter, AuthorWhereInput>
    images?: ProductImageListRelationFilter
  }, "id">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    stock?: SortOrder
    sortOrder?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Product"> | number
    title?: StringWithAggregatesFilter<"Product"> | string
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    price?: FloatWithAggregatesFilter<"Product"> | number
    stock?: IntWithAggregatesFilter<"Product"> | number
    sortOrder?: IntWithAggregatesFilter<"Product"> | number
    categoryId?: IntWithAggregatesFilter<"Product"> | number
    authorId?: IntWithAggregatesFilter<"Product"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type ProductImageWhereInput = {
    AND?: ProductImageWhereInput | ProductImageWhereInput[]
    OR?: ProductImageWhereInput[]
    NOT?: ProductImageWhereInput | ProductImageWhereInput[]
    id?: IntFilter<"ProductImage"> | number
    url?: StringFilter<"ProductImage"> | string
    publicId?: StringFilter<"ProductImage"> | string
    order?: IntFilter<"ProductImage"> | number
    productId?: IntFilter<"ProductImage"> | number
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type ProductImageOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    order?: SortOrder
    productId?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type ProductImageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ProductImageWhereInput | ProductImageWhereInput[]
    OR?: ProductImageWhereInput[]
    NOT?: ProductImageWhereInput | ProductImageWhereInput[]
    url?: StringFilter<"ProductImage"> | string
    publicId?: StringFilter<"ProductImage"> | string
    order?: IntFilter<"ProductImage"> | number
    productId?: IntFilter<"ProductImage"> | number
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type ProductImageOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    order?: SortOrder
    productId?: SortOrder
    _count?: ProductImageCountOrderByAggregateInput
    _avg?: ProductImageAvgOrderByAggregateInput
    _max?: ProductImageMaxOrderByAggregateInput
    _min?: ProductImageMinOrderByAggregateInput
    _sum?: ProductImageSumOrderByAggregateInput
  }

  export type ProductImageScalarWhereWithAggregatesInput = {
    AND?: ProductImageScalarWhereWithAggregatesInput | ProductImageScalarWhereWithAggregatesInput[]
    OR?: ProductImageScalarWhereWithAggregatesInput[]
    NOT?: ProductImageScalarWhereWithAggregatesInput | ProductImageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProductImage"> | number
    url?: StringWithAggregatesFilter<"ProductImage"> | string
    publicId?: StringWithAggregatesFilter<"ProductImage"> | string
    order?: IntWithAggregatesFilter<"ProductImage"> | number
    productId?: IntWithAggregatesFilter<"ProductImage"> | number
  }

  export type GalleryPostWhereInput = {
    AND?: GalleryPostWhereInput | GalleryPostWhereInput[]
    OR?: GalleryPostWhereInput[]
    NOT?: GalleryPostWhereInput | GalleryPostWhereInput[]
    id?: IntFilter<"GalleryPost"> | number
    title?: StringFilter<"GalleryPost"> | string
    content?: StringFilter<"GalleryPost"> | string
    coverUrl?: StringNullableFilter<"GalleryPost"> | string | null
    coverPublicId?: StringFilter<"GalleryPost"> | string
    date?: DateTimeNullableFilter<"GalleryPost"> | Date | string | null
    createdAt?: DateTimeFilter<"GalleryPost"> | Date | string
    updatedAt?: DateTimeFilter<"GalleryPost"> | Date | string
    media?: GalleryPostMediaListRelationFilter
  }

  export type GalleryPostOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    coverUrl?: SortOrderInput | SortOrder
    coverPublicId?: SortOrder
    date?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    media?: GalleryPostMediaOrderByRelationAggregateInput
  }

  export type GalleryPostWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GalleryPostWhereInput | GalleryPostWhereInput[]
    OR?: GalleryPostWhereInput[]
    NOT?: GalleryPostWhereInput | GalleryPostWhereInput[]
    title?: StringFilter<"GalleryPost"> | string
    content?: StringFilter<"GalleryPost"> | string
    coverUrl?: StringNullableFilter<"GalleryPost"> | string | null
    coverPublicId?: StringFilter<"GalleryPost"> | string
    date?: DateTimeNullableFilter<"GalleryPost"> | Date | string | null
    createdAt?: DateTimeFilter<"GalleryPost"> | Date | string
    updatedAt?: DateTimeFilter<"GalleryPost"> | Date | string
    media?: GalleryPostMediaListRelationFilter
  }, "id">

  export type GalleryPostOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    coverUrl?: SortOrderInput | SortOrder
    coverPublicId?: SortOrder
    date?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GalleryPostCountOrderByAggregateInput
    _avg?: GalleryPostAvgOrderByAggregateInput
    _max?: GalleryPostMaxOrderByAggregateInput
    _min?: GalleryPostMinOrderByAggregateInput
    _sum?: GalleryPostSumOrderByAggregateInput
  }

  export type GalleryPostScalarWhereWithAggregatesInput = {
    AND?: GalleryPostScalarWhereWithAggregatesInput | GalleryPostScalarWhereWithAggregatesInput[]
    OR?: GalleryPostScalarWhereWithAggregatesInput[]
    NOT?: GalleryPostScalarWhereWithAggregatesInput | GalleryPostScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GalleryPost"> | number
    title?: StringWithAggregatesFilter<"GalleryPost"> | string
    content?: StringWithAggregatesFilter<"GalleryPost"> | string
    coverUrl?: StringNullableWithAggregatesFilter<"GalleryPost"> | string | null
    coverPublicId?: StringWithAggregatesFilter<"GalleryPost"> | string
    date?: DateTimeNullableWithAggregatesFilter<"GalleryPost"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GalleryPost"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GalleryPost"> | Date | string
  }

  export type GalleryPostMediaWhereInput = {
    AND?: GalleryPostMediaWhereInput | GalleryPostMediaWhereInput[]
    OR?: GalleryPostMediaWhereInput[]
    NOT?: GalleryPostMediaWhereInput | GalleryPostMediaWhereInput[]
    id?: IntFilter<"GalleryPostMedia"> | number
    url?: StringFilter<"GalleryPostMedia"> | string
    publicId?: StringFilter<"GalleryPostMedia"> | string
    type?: EnumMediaTypeFilter<"GalleryPostMedia"> | $Enums.MediaType
    order?: IntFilter<"GalleryPostMedia"> | number
    postId?: IntFilter<"GalleryPostMedia"> | number
    post?: XOR<GalleryPostScalarRelationFilter, GalleryPostWhereInput>
  }

  export type GalleryPostMediaOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    postId?: SortOrder
    post?: GalleryPostOrderByWithRelationInput
  }

  export type GalleryPostMediaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GalleryPostMediaWhereInput | GalleryPostMediaWhereInput[]
    OR?: GalleryPostMediaWhereInput[]
    NOT?: GalleryPostMediaWhereInput | GalleryPostMediaWhereInput[]
    url?: StringFilter<"GalleryPostMedia"> | string
    publicId?: StringFilter<"GalleryPostMedia"> | string
    type?: EnumMediaTypeFilter<"GalleryPostMedia"> | $Enums.MediaType
    order?: IntFilter<"GalleryPostMedia"> | number
    postId?: IntFilter<"GalleryPostMedia"> | number
    post?: XOR<GalleryPostScalarRelationFilter, GalleryPostWhereInput>
  }, "id">

  export type GalleryPostMediaOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    postId?: SortOrder
    _count?: GalleryPostMediaCountOrderByAggregateInput
    _avg?: GalleryPostMediaAvgOrderByAggregateInput
    _max?: GalleryPostMediaMaxOrderByAggregateInput
    _min?: GalleryPostMediaMinOrderByAggregateInput
    _sum?: GalleryPostMediaSumOrderByAggregateInput
  }

  export type GalleryPostMediaScalarWhereWithAggregatesInput = {
    AND?: GalleryPostMediaScalarWhereWithAggregatesInput | GalleryPostMediaScalarWhereWithAggregatesInput[]
    OR?: GalleryPostMediaScalarWhereWithAggregatesInput[]
    NOT?: GalleryPostMediaScalarWhereWithAggregatesInput | GalleryPostMediaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GalleryPostMedia"> | number
    url?: StringWithAggregatesFilter<"GalleryPostMedia"> | string
    publicId?: StringWithAggregatesFilter<"GalleryPostMedia"> | string
    type?: EnumMediaTypeWithAggregatesFilter<"GalleryPostMedia"> | $Enums.MediaType
    order?: IntWithAggregatesFilter<"GalleryPostMedia"> | number
    postId?: IntWithAggregatesFilter<"GalleryPostMedia"> | number
  }

  export type AdminUserWhereInput = {
    AND?: AdminUserWhereInput | AdminUserWhereInput[]
    OR?: AdminUserWhereInput[]
    NOT?: AdminUserWhereInput | AdminUserWhereInput[]
    id?: StringFilter<"AdminUser"> | string
    email?: StringFilter<"AdminUser"> | string
    passwordHash?: StringFilter<"AdminUser"> | string
    createdAt?: DateTimeFilter<"AdminUser"> | Date | string
    updatedAt?: DateTimeFilter<"AdminUser"> | Date | string
  }

  export type AdminUserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AdminUserWhereInput | AdminUserWhereInput[]
    OR?: AdminUserWhereInput[]
    NOT?: AdminUserWhereInput | AdminUserWhereInput[]
    passwordHash?: StringFilter<"AdminUser"> | string
    createdAt?: DateTimeFilter<"AdminUser"> | Date | string
    updatedAt?: DateTimeFilter<"AdminUser"> | Date | string
  }, "id" | "email">

  export type AdminUserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminUserCountOrderByAggregateInput
    _max?: AdminUserMaxOrderByAggregateInput
    _min?: AdminUserMinOrderByAggregateInput
  }

  export type AdminUserScalarWhereWithAggregatesInput = {
    AND?: AdminUserScalarWhereWithAggregatesInput | AdminUserScalarWhereWithAggregatesInput[]
    OR?: AdminUserScalarWhereWithAggregatesInput[]
    NOT?: AdminUserScalarWhereWithAggregatesInput | AdminUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminUser"> | string
    email?: StringWithAggregatesFilter<"AdminUser"> | string
    passwordHash?: StringWithAggregatesFilter<"AdminUser"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AdminUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AdminUser"> | Date | string
  }

  export type AuthorCreateInput = {
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingCreateNestedManyWithoutAuthorInput
    collections?: CollectionCreateNestedManyWithoutAuthorInput
    products?: ProductCreateNestedManyWithoutAuthorInput
  }

  export type AuthorUncheckedCreateInput = {
    id?: number
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingUncheckedCreateNestedManyWithoutAuthorInput
    collections?: CollectionUncheckedCreateNestedManyWithoutAuthorInput
    products?: ProductUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type AuthorUpdateInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUpdateManyWithoutAuthorNestedInput
    collections?: CollectionUpdateManyWithoutAuthorNestedInput
    products?: ProductUpdateManyWithoutAuthorNestedInput
  }

  export type AuthorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUncheckedUpdateManyWithoutAuthorNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutAuthorNestedInput
    products?: ProductUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type AuthorCreateManyInput = {
    id?: number
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthorUpdateManyMutationInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCreateInput = {
    title: string
    coverPhotoUrl?: string | null
    coverPhotoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    author: AuthorCreateNestedOneWithoutCollectionsInput
    paintings?: PaintingCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateInput = {
    id?: number
    title: string
    coverPhotoUrl?: string | null
    coverPhotoPublicId?: string
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: AuthorUpdateOneRequiredWithoutCollectionsNestedInput
    paintings?: PaintingUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionCreateManyInput = {
    id?: number
    title: string
    coverPhotoUrl?: string | null
    coverPhotoPublicId?: string
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollectionUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaintingCreateInput = {
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: AuthorCreateNestedOneWithoutPaintingsInput
    collection?: CollectionCreateNestedOneWithoutPaintingsInput
    media?: PaintingMediaCreateNestedManyWithoutPaintingInput
  }

  export type PaintingUncheckedCreateInput = {
    id?: number
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    authorId: number
    collectionId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: PaintingMediaUncheckedCreateNestedManyWithoutPaintingInput
  }

  export type PaintingUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: AuthorUpdateOneRequiredWithoutPaintingsNestedInput
    collection?: CollectionUpdateOneWithoutPaintingsNestedInput
    media?: PaintingMediaUpdateManyWithoutPaintingNestedInput
  }

  export type PaintingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    authorId?: IntFieldUpdateOperationsInput | number
    collectionId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: PaintingMediaUncheckedUpdateManyWithoutPaintingNestedInput
  }

  export type PaintingCreateManyInput = {
    id?: number
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    authorId: number
    collectionId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaintingUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaintingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    authorId?: IntFieldUpdateOperationsInput | number
    collectionId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaintingMediaCreateInput = {
    url: string
    publicId?: string
    isNeon?: boolean
    order?: number
    type?: $Enums.MediaType
    painting: PaintingCreateNestedOneWithoutMediaInput
  }

  export type PaintingMediaUncheckedCreateInput = {
    id?: number
    url: string
    publicId?: string
    isNeon?: boolean
    order?: number
    type?: $Enums.MediaType
    paintingId: number
  }

  export type PaintingMediaUpdateInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    isNeon?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    painting?: PaintingUpdateOneRequiredWithoutMediaNestedInput
  }

  export type PaintingMediaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    isNeon?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    paintingId?: IntFieldUpdateOperationsInput | number
  }

  export type PaintingMediaCreateManyInput = {
    id?: number
    url: string
    publicId?: string
    isNeon?: boolean
    order?: number
    type?: $Enums.MediaType
    paintingId: number
  }

  export type PaintingMediaUpdateManyMutationInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    isNeon?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
  }

  export type PaintingMediaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    isNeon?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    paintingId?: IntFieldUpdateOperationsInput | number
  }

  export type CategoryCreateInput = {
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    category: CategoryCreateNestedOneWithoutProductsInput
    author: AuthorCreateNestedOneWithoutProductsInput
    images?: ProductImageCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: number
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    categoryId: number
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ProductImageUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutProductsNestedInput
    author?: AuthorUpdateOneRequiredWithoutProductsNestedInput
    images?: ProductImageUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ProductImageUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: number
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    categoryId: number
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImageCreateInput = {
    url: string
    publicId?: string
    order?: number
    product: ProductCreateNestedOneWithoutImagesInput
  }

  export type ProductImageUncheckedCreateInput = {
    id?: number
    url: string
    publicId?: string
    order?: number
    productId: number
  }

  export type ProductImageUpdateInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    product?: ProductUpdateOneRequiredWithoutImagesNestedInput
  }

  export type ProductImageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
  }

  export type ProductImageCreateManyInput = {
    id?: number
    url: string
    publicId?: string
    order?: number
    productId: number
  }

  export type ProductImageUpdateManyMutationInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type ProductImageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
  }

  export type GalleryPostCreateInput = {
    title: string
    content: string
    coverUrl?: string | null
    coverPublicId?: string
    date?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: GalleryPostMediaCreateNestedManyWithoutPostInput
  }

  export type GalleryPostUncheckedCreateInput = {
    id?: number
    title: string
    content: string
    coverUrl?: string | null
    coverPublicId?: string
    date?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: GalleryPostMediaUncheckedCreateNestedManyWithoutPostInput
  }

  export type GalleryPostUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPublicId?: StringFieldUpdateOperationsInput | string
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: GalleryPostMediaUpdateManyWithoutPostNestedInput
  }

  export type GalleryPostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPublicId?: StringFieldUpdateOperationsInput | string
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: GalleryPostMediaUncheckedUpdateManyWithoutPostNestedInput
  }

  export type GalleryPostCreateManyInput = {
    id?: number
    title: string
    content: string
    coverUrl?: string | null
    coverPublicId?: string
    date?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GalleryPostUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPublicId?: StringFieldUpdateOperationsInput | string
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryPostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPublicId?: StringFieldUpdateOperationsInput | string
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryPostMediaCreateInput = {
    url: string
    publicId?: string
    type?: $Enums.MediaType
    order?: number
    post: GalleryPostCreateNestedOneWithoutMediaInput
  }

  export type GalleryPostMediaUncheckedCreateInput = {
    id?: number
    url: string
    publicId?: string
    type?: $Enums.MediaType
    order?: number
    postId: number
  }

  export type GalleryPostMediaUpdateInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    order?: IntFieldUpdateOperationsInput | number
    post?: GalleryPostUpdateOneRequiredWithoutMediaNestedInput
  }

  export type GalleryPostMediaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    order?: IntFieldUpdateOperationsInput | number
    postId?: IntFieldUpdateOperationsInput | number
  }

  export type GalleryPostMediaCreateManyInput = {
    id?: number
    url: string
    publicId?: string
    type?: $Enums.MediaType
    order?: number
    postId: number
  }

  export type GalleryPostMediaUpdateManyMutationInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GalleryPostMediaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    order?: IntFieldUpdateOperationsInput | number
    postId?: IntFieldUpdateOperationsInput | number
  }

  export type AdminUserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PaintingListRelationFilter = {
    every?: PaintingWhereInput
    some?: PaintingWhereInput
    none?: PaintingWhereInput
  }

  export type CollectionListRelationFilter = {
    every?: CollectionWhereInput
    some?: CollectionWhereInput
    none?: CollectionWhereInput
  }

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PaintingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CollectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthorCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrder
    photoUrl?: SortOrder
    photoPublicId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthorAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AuthorMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrder
    photoUrl?: SortOrder
    photoPublicId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthorMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrder
    photoUrl?: SortOrder
    photoPublicId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthorSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AuthorScalarRelationFilter = {
    is?: AuthorWhereInput
    isNot?: AuthorWhereInput
  }

  export type CollectionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    coverPhotoUrl?: SortOrder
    coverPhotoPublicId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectionAvgOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
  }

  export type CollectionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    coverPhotoUrl?: SortOrder
    coverPhotoPublicId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    coverPhotoUrl?: SortOrder
    coverPhotoPublicId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectionSumOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type CollectionNullableScalarRelationFilter = {
    is?: CollectionWhereInput | null
    isNot?: CollectionWhereInput | null
  }

  export type PaintingMediaListRelationFilter = {
    every?: PaintingMediaWhereInput
    some?: PaintingMediaWhereInput
    none?: PaintingMediaWhereInput
  }

  export type PaintingMediaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaintingCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    coverUrl?: SortOrder
    coverPublicId?: SortOrder
    hasNeon?: SortOrder
    isForSale?: SortOrder
    sortOrder?: SortOrder
    year?: SortOrder
    authorId?: SortOrder
    collectionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaintingAvgOrderByAggregateInput = {
    id?: SortOrder
    sortOrder?: SortOrder
    year?: SortOrder
    authorId?: SortOrder
    collectionId?: SortOrder
  }

  export type PaintingMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    coverUrl?: SortOrder
    coverPublicId?: SortOrder
    hasNeon?: SortOrder
    isForSale?: SortOrder
    sortOrder?: SortOrder
    year?: SortOrder
    authorId?: SortOrder
    collectionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaintingMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    coverUrl?: SortOrder
    coverPublicId?: SortOrder
    hasNeon?: SortOrder
    isForSale?: SortOrder
    sortOrder?: SortOrder
    year?: SortOrder
    authorId?: SortOrder
    collectionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaintingSumOrderByAggregateInput = {
    id?: SortOrder
    sortOrder?: SortOrder
    year?: SortOrder
    authorId?: SortOrder
    collectionId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumMediaTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MediaType | EnumMediaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMediaTypeFilter<$PrismaModel> | $Enums.MediaType
  }

  export type PaintingScalarRelationFilter = {
    is?: PaintingWhereInput
    isNot?: PaintingWhereInput
  }

  export type PaintingMediaCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    isNeon?: SortOrder
    order?: SortOrder
    type?: SortOrder
    paintingId?: SortOrder
  }

  export type PaintingMediaAvgOrderByAggregateInput = {
    id?: SortOrder
    order?: SortOrder
    paintingId?: SortOrder
  }

  export type PaintingMediaMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    isNeon?: SortOrder
    order?: SortOrder
    type?: SortOrder
    paintingId?: SortOrder
  }

  export type PaintingMediaMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    isNeon?: SortOrder
    order?: SortOrder
    type?: SortOrder
    paintingId?: SortOrder
  }

  export type PaintingMediaSumOrderByAggregateInput = {
    id?: SortOrder
    order?: SortOrder
    paintingId?: SortOrder
  }

  export type EnumMediaTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MediaType | EnumMediaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMediaTypeWithAggregatesFilter<$PrismaModel> | $Enums.MediaType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMediaTypeFilter<$PrismaModel>
    _max?: NestedEnumMediaTypeFilter<$PrismaModel>
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CategoryScalarRelationFilter = {
    is?: CategoryWhereInput
    isNot?: CategoryWhereInput
  }

  export type ProductImageListRelationFilter = {
    every?: ProductImageWhereInput
    some?: ProductImageWhereInput
    none?: ProductImageWhereInput
  }

  export type ProductImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    sortOrder?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    sortOrder?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    sortOrder?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    sortOrder?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    sortOrder?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type ProductImageCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    order?: SortOrder
    productId?: SortOrder
  }

  export type ProductImageAvgOrderByAggregateInput = {
    id?: SortOrder
    order?: SortOrder
    productId?: SortOrder
  }

  export type ProductImageMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    order?: SortOrder
    productId?: SortOrder
  }

  export type ProductImageMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    order?: SortOrder
    productId?: SortOrder
  }

  export type ProductImageSumOrderByAggregateInput = {
    id?: SortOrder
    order?: SortOrder
    productId?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type GalleryPostMediaListRelationFilter = {
    every?: GalleryPostMediaWhereInput
    some?: GalleryPostMediaWhereInput
    none?: GalleryPostMediaWhereInput
  }

  export type GalleryPostMediaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GalleryPostCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    coverUrl?: SortOrder
    coverPublicId?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GalleryPostAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type GalleryPostMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    coverUrl?: SortOrder
    coverPublicId?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GalleryPostMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    coverUrl?: SortOrder
    coverPublicId?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GalleryPostSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type GalleryPostScalarRelationFilter = {
    is?: GalleryPostWhereInput
    isNot?: GalleryPostWhereInput
  }

  export type GalleryPostMediaCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    postId?: SortOrder
  }

  export type GalleryPostMediaAvgOrderByAggregateInput = {
    id?: SortOrder
    order?: SortOrder
    postId?: SortOrder
  }

  export type GalleryPostMediaMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    postId?: SortOrder
  }

  export type GalleryPostMediaMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    postId?: SortOrder
  }

  export type GalleryPostMediaSumOrderByAggregateInput = {
    id?: SortOrder
    order?: SortOrder
    postId?: SortOrder
  }

  export type AdminUserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaintingCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PaintingCreateWithoutAuthorInput, PaintingUncheckedCreateWithoutAuthorInput> | PaintingCreateWithoutAuthorInput[] | PaintingUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PaintingCreateOrConnectWithoutAuthorInput | PaintingCreateOrConnectWithoutAuthorInput[]
    createMany?: PaintingCreateManyAuthorInputEnvelope
    connect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
  }

  export type CollectionCreateNestedManyWithoutAuthorInput = {
    create?: XOR<CollectionCreateWithoutAuthorInput, CollectionUncheckedCreateWithoutAuthorInput> | CollectionCreateWithoutAuthorInput[] | CollectionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutAuthorInput | CollectionCreateOrConnectWithoutAuthorInput[]
    createMany?: CollectionCreateManyAuthorInputEnvelope
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
  }

  export type ProductCreateNestedManyWithoutAuthorInput = {
    create?: XOR<ProductCreateWithoutAuthorInput, ProductUncheckedCreateWithoutAuthorInput> | ProductCreateWithoutAuthorInput[] | ProductUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutAuthorInput | ProductCreateOrConnectWithoutAuthorInput[]
    createMany?: ProductCreateManyAuthorInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type PaintingUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PaintingCreateWithoutAuthorInput, PaintingUncheckedCreateWithoutAuthorInput> | PaintingCreateWithoutAuthorInput[] | PaintingUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PaintingCreateOrConnectWithoutAuthorInput | PaintingCreateOrConnectWithoutAuthorInput[]
    createMany?: PaintingCreateManyAuthorInputEnvelope
    connect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
  }

  export type CollectionUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<CollectionCreateWithoutAuthorInput, CollectionUncheckedCreateWithoutAuthorInput> | CollectionCreateWithoutAuthorInput[] | CollectionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutAuthorInput | CollectionCreateOrConnectWithoutAuthorInput[]
    createMany?: CollectionCreateManyAuthorInputEnvelope
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<ProductCreateWithoutAuthorInput, ProductUncheckedCreateWithoutAuthorInput> | ProductCreateWithoutAuthorInput[] | ProductUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutAuthorInput | ProductCreateOrConnectWithoutAuthorInput[]
    createMany?: ProductCreateManyAuthorInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PaintingUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PaintingCreateWithoutAuthorInput, PaintingUncheckedCreateWithoutAuthorInput> | PaintingCreateWithoutAuthorInput[] | PaintingUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PaintingCreateOrConnectWithoutAuthorInput | PaintingCreateOrConnectWithoutAuthorInput[]
    upsert?: PaintingUpsertWithWhereUniqueWithoutAuthorInput | PaintingUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PaintingCreateManyAuthorInputEnvelope
    set?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    disconnect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    delete?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    connect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    update?: PaintingUpdateWithWhereUniqueWithoutAuthorInput | PaintingUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PaintingUpdateManyWithWhereWithoutAuthorInput | PaintingUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PaintingScalarWhereInput | PaintingScalarWhereInput[]
  }

  export type CollectionUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<CollectionCreateWithoutAuthorInput, CollectionUncheckedCreateWithoutAuthorInput> | CollectionCreateWithoutAuthorInput[] | CollectionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutAuthorInput | CollectionCreateOrConnectWithoutAuthorInput[]
    upsert?: CollectionUpsertWithWhereUniqueWithoutAuthorInput | CollectionUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: CollectionCreateManyAuthorInputEnvelope
    set?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    disconnect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    delete?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    update?: CollectionUpdateWithWhereUniqueWithoutAuthorInput | CollectionUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: CollectionUpdateManyWithWhereWithoutAuthorInput | CollectionUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
  }

  export type ProductUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<ProductCreateWithoutAuthorInput, ProductUncheckedCreateWithoutAuthorInput> | ProductCreateWithoutAuthorInput[] | ProductUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutAuthorInput | ProductCreateOrConnectWithoutAuthorInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutAuthorInput | ProductUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: ProductCreateManyAuthorInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutAuthorInput | ProductUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutAuthorInput | ProductUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PaintingUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PaintingCreateWithoutAuthorInput, PaintingUncheckedCreateWithoutAuthorInput> | PaintingCreateWithoutAuthorInput[] | PaintingUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PaintingCreateOrConnectWithoutAuthorInput | PaintingCreateOrConnectWithoutAuthorInput[]
    upsert?: PaintingUpsertWithWhereUniqueWithoutAuthorInput | PaintingUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PaintingCreateManyAuthorInputEnvelope
    set?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    disconnect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    delete?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    connect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    update?: PaintingUpdateWithWhereUniqueWithoutAuthorInput | PaintingUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PaintingUpdateManyWithWhereWithoutAuthorInput | PaintingUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PaintingScalarWhereInput | PaintingScalarWhereInput[]
  }

  export type CollectionUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<CollectionCreateWithoutAuthorInput, CollectionUncheckedCreateWithoutAuthorInput> | CollectionCreateWithoutAuthorInput[] | CollectionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutAuthorInput | CollectionCreateOrConnectWithoutAuthorInput[]
    upsert?: CollectionUpsertWithWhereUniqueWithoutAuthorInput | CollectionUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: CollectionCreateManyAuthorInputEnvelope
    set?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    disconnect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    delete?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    update?: CollectionUpdateWithWhereUniqueWithoutAuthorInput | CollectionUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: CollectionUpdateManyWithWhereWithoutAuthorInput | CollectionUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<ProductCreateWithoutAuthorInput, ProductUncheckedCreateWithoutAuthorInput> | ProductCreateWithoutAuthorInput[] | ProductUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutAuthorInput | ProductCreateOrConnectWithoutAuthorInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutAuthorInput | ProductUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: ProductCreateManyAuthorInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutAuthorInput | ProductUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutAuthorInput | ProductUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type AuthorCreateNestedOneWithoutCollectionsInput = {
    create?: XOR<AuthorCreateWithoutCollectionsInput, AuthorUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: AuthorCreateOrConnectWithoutCollectionsInput
    connect?: AuthorWhereUniqueInput
  }

  export type PaintingCreateNestedManyWithoutCollectionInput = {
    create?: XOR<PaintingCreateWithoutCollectionInput, PaintingUncheckedCreateWithoutCollectionInput> | PaintingCreateWithoutCollectionInput[] | PaintingUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: PaintingCreateOrConnectWithoutCollectionInput | PaintingCreateOrConnectWithoutCollectionInput[]
    createMany?: PaintingCreateManyCollectionInputEnvelope
    connect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
  }

  export type PaintingUncheckedCreateNestedManyWithoutCollectionInput = {
    create?: XOR<PaintingCreateWithoutCollectionInput, PaintingUncheckedCreateWithoutCollectionInput> | PaintingCreateWithoutCollectionInput[] | PaintingUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: PaintingCreateOrConnectWithoutCollectionInput | PaintingCreateOrConnectWithoutCollectionInput[]
    createMany?: PaintingCreateManyCollectionInputEnvelope
    connect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
  }

  export type AuthorUpdateOneRequiredWithoutCollectionsNestedInput = {
    create?: XOR<AuthorCreateWithoutCollectionsInput, AuthorUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: AuthorCreateOrConnectWithoutCollectionsInput
    upsert?: AuthorUpsertWithoutCollectionsInput
    connect?: AuthorWhereUniqueInput
    update?: XOR<XOR<AuthorUpdateToOneWithWhereWithoutCollectionsInput, AuthorUpdateWithoutCollectionsInput>, AuthorUncheckedUpdateWithoutCollectionsInput>
  }

  export type PaintingUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<PaintingCreateWithoutCollectionInput, PaintingUncheckedCreateWithoutCollectionInput> | PaintingCreateWithoutCollectionInput[] | PaintingUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: PaintingCreateOrConnectWithoutCollectionInput | PaintingCreateOrConnectWithoutCollectionInput[]
    upsert?: PaintingUpsertWithWhereUniqueWithoutCollectionInput | PaintingUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: PaintingCreateManyCollectionInputEnvelope
    set?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    disconnect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    delete?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    connect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    update?: PaintingUpdateWithWhereUniqueWithoutCollectionInput | PaintingUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: PaintingUpdateManyWithWhereWithoutCollectionInput | PaintingUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: PaintingScalarWhereInput | PaintingScalarWhereInput[]
  }

  export type PaintingUncheckedUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<PaintingCreateWithoutCollectionInput, PaintingUncheckedCreateWithoutCollectionInput> | PaintingCreateWithoutCollectionInput[] | PaintingUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: PaintingCreateOrConnectWithoutCollectionInput | PaintingCreateOrConnectWithoutCollectionInput[]
    upsert?: PaintingUpsertWithWhereUniqueWithoutCollectionInput | PaintingUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: PaintingCreateManyCollectionInputEnvelope
    set?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    disconnect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    delete?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    connect?: PaintingWhereUniqueInput | PaintingWhereUniqueInput[]
    update?: PaintingUpdateWithWhereUniqueWithoutCollectionInput | PaintingUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: PaintingUpdateManyWithWhereWithoutCollectionInput | PaintingUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: PaintingScalarWhereInput | PaintingScalarWhereInput[]
  }

  export type AuthorCreateNestedOneWithoutPaintingsInput = {
    create?: XOR<AuthorCreateWithoutPaintingsInput, AuthorUncheckedCreateWithoutPaintingsInput>
    connectOrCreate?: AuthorCreateOrConnectWithoutPaintingsInput
    connect?: AuthorWhereUniqueInput
  }

  export type CollectionCreateNestedOneWithoutPaintingsInput = {
    create?: XOR<CollectionCreateWithoutPaintingsInput, CollectionUncheckedCreateWithoutPaintingsInput>
    connectOrCreate?: CollectionCreateOrConnectWithoutPaintingsInput
    connect?: CollectionWhereUniqueInput
  }

  export type PaintingMediaCreateNestedManyWithoutPaintingInput = {
    create?: XOR<PaintingMediaCreateWithoutPaintingInput, PaintingMediaUncheckedCreateWithoutPaintingInput> | PaintingMediaCreateWithoutPaintingInput[] | PaintingMediaUncheckedCreateWithoutPaintingInput[]
    connectOrCreate?: PaintingMediaCreateOrConnectWithoutPaintingInput | PaintingMediaCreateOrConnectWithoutPaintingInput[]
    createMany?: PaintingMediaCreateManyPaintingInputEnvelope
    connect?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
  }

  export type PaintingMediaUncheckedCreateNestedManyWithoutPaintingInput = {
    create?: XOR<PaintingMediaCreateWithoutPaintingInput, PaintingMediaUncheckedCreateWithoutPaintingInput> | PaintingMediaCreateWithoutPaintingInput[] | PaintingMediaUncheckedCreateWithoutPaintingInput[]
    connectOrCreate?: PaintingMediaCreateOrConnectWithoutPaintingInput | PaintingMediaCreateOrConnectWithoutPaintingInput[]
    createMany?: PaintingMediaCreateManyPaintingInputEnvelope
    connect?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AuthorUpdateOneRequiredWithoutPaintingsNestedInput = {
    create?: XOR<AuthorCreateWithoutPaintingsInput, AuthorUncheckedCreateWithoutPaintingsInput>
    connectOrCreate?: AuthorCreateOrConnectWithoutPaintingsInput
    upsert?: AuthorUpsertWithoutPaintingsInput
    connect?: AuthorWhereUniqueInput
    update?: XOR<XOR<AuthorUpdateToOneWithWhereWithoutPaintingsInput, AuthorUpdateWithoutPaintingsInput>, AuthorUncheckedUpdateWithoutPaintingsInput>
  }

  export type CollectionUpdateOneWithoutPaintingsNestedInput = {
    create?: XOR<CollectionCreateWithoutPaintingsInput, CollectionUncheckedCreateWithoutPaintingsInput>
    connectOrCreate?: CollectionCreateOrConnectWithoutPaintingsInput
    upsert?: CollectionUpsertWithoutPaintingsInput
    disconnect?: CollectionWhereInput | boolean
    delete?: CollectionWhereInput | boolean
    connect?: CollectionWhereUniqueInput
    update?: XOR<XOR<CollectionUpdateToOneWithWhereWithoutPaintingsInput, CollectionUpdateWithoutPaintingsInput>, CollectionUncheckedUpdateWithoutPaintingsInput>
  }

  export type PaintingMediaUpdateManyWithoutPaintingNestedInput = {
    create?: XOR<PaintingMediaCreateWithoutPaintingInput, PaintingMediaUncheckedCreateWithoutPaintingInput> | PaintingMediaCreateWithoutPaintingInput[] | PaintingMediaUncheckedCreateWithoutPaintingInput[]
    connectOrCreate?: PaintingMediaCreateOrConnectWithoutPaintingInput | PaintingMediaCreateOrConnectWithoutPaintingInput[]
    upsert?: PaintingMediaUpsertWithWhereUniqueWithoutPaintingInput | PaintingMediaUpsertWithWhereUniqueWithoutPaintingInput[]
    createMany?: PaintingMediaCreateManyPaintingInputEnvelope
    set?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
    disconnect?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
    delete?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
    connect?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
    update?: PaintingMediaUpdateWithWhereUniqueWithoutPaintingInput | PaintingMediaUpdateWithWhereUniqueWithoutPaintingInput[]
    updateMany?: PaintingMediaUpdateManyWithWhereWithoutPaintingInput | PaintingMediaUpdateManyWithWhereWithoutPaintingInput[]
    deleteMany?: PaintingMediaScalarWhereInput | PaintingMediaScalarWhereInput[]
  }

  export type PaintingMediaUncheckedUpdateManyWithoutPaintingNestedInput = {
    create?: XOR<PaintingMediaCreateWithoutPaintingInput, PaintingMediaUncheckedCreateWithoutPaintingInput> | PaintingMediaCreateWithoutPaintingInput[] | PaintingMediaUncheckedCreateWithoutPaintingInput[]
    connectOrCreate?: PaintingMediaCreateOrConnectWithoutPaintingInput | PaintingMediaCreateOrConnectWithoutPaintingInput[]
    upsert?: PaintingMediaUpsertWithWhereUniqueWithoutPaintingInput | PaintingMediaUpsertWithWhereUniqueWithoutPaintingInput[]
    createMany?: PaintingMediaCreateManyPaintingInputEnvelope
    set?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
    disconnect?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
    delete?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
    connect?: PaintingMediaWhereUniqueInput | PaintingMediaWhereUniqueInput[]
    update?: PaintingMediaUpdateWithWhereUniqueWithoutPaintingInput | PaintingMediaUpdateWithWhereUniqueWithoutPaintingInput[]
    updateMany?: PaintingMediaUpdateManyWithWhereWithoutPaintingInput | PaintingMediaUpdateManyWithWhereWithoutPaintingInput[]
    deleteMany?: PaintingMediaScalarWhereInput | PaintingMediaScalarWhereInput[]
  }

  export type PaintingCreateNestedOneWithoutMediaInput = {
    create?: XOR<PaintingCreateWithoutMediaInput, PaintingUncheckedCreateWithoutMediaInput>
    connectOrCreate?: PaintingCreateOrConnectWithoutMediaInput
    connect?: PaintingWhereUniqueInput
  }

  export type EnumMediaTypeFieldUpdateOperationsInput = {
    set?: $Enums.MediaType
  }

  export type PaintingUpdateOneRequiredWithoutMediaNestedInput = {
    create?: XOR<PaintingCreateWithoutMediaInput, PaintingUncheckedCreateWithoutMediaInput>
    connectOrCreate?: PaintingCreateOrConnectWithoutMediaInput
    upsert?: PaintingUpsertWithoutMediaInput
    connect?: PaintingWhereUniqueInput
    update?: XOR<XOR<PaintingUpdateToOneWithWhereWithoutMediaInput, PaintingUpdateWithoutMediaInput>, PaintingUncheckedUpdateWithoutMediaInput>
  }

  export type ProductCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type CategoryCreateNestedOneWithoutProductsInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    connect?: CategoryWhereUniqueInput
  }

  export type AuthorCreateNestedOneWithoutProductsInput = {
    create?: XOR<AuthorCreateWithoutProductsInput, AuthorUncheckedCreateWithoutProductsInput>
    connectOrCreate?: AuthorCreateOrConnectWithoutProductsInput
    connect?: AuthorWhereUniqueInput
  }

  export type ProductImageCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput> | ProductImageCreateWithoutProductInput[] | ProductImageUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImageCreateOrConnectWithoutProductInput | ProductImageCreateOrConnectWithoutProductInput[]
    createMany?: ProductImageCreateManyProductInputEnvelope
    connect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
  }

  export type ProductImageUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput> | ProductImageCreateWithoutProductInput[] | ProductImageUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImageCreateOrConnectWithoutProductInput | ProductImageCreateOrConnectWithoutProductInput[]
    createMany?: ProductImageCreateManyProductInputEnvelope
    connect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CategoryUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    upsert?: CategoryUpsertWithoutProductsInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutProductsInput, CategoryUpdateWithoutProductsInput>, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type AuthorUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<AuthorCreateWithoutProductsInput, AuthorUncheckedCreateWithoutProductsInput>
    connectOrCreate?: AuthorCreateOrConnectWithoutProductsInput
    upsert?: AuthorUpsertWithoutProductsInput
    connect?: AuthorWhereUniqueInput
    update?: XOR<XOR<AuthorUpdateToOneWithWhereWithoutProductsInput, AuthorUpdateWithoutProductsInput>, AuthorUncheckedUpdateWithoutProductsInput>
  }

  export type ProductImageUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput> | ProductImageCreateWithoutProductInput[] | ProductImageUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImageCreateOrConnectWithoutProductInput | ProductImageCreateOrConnectWithoutProductInput[]
    upsert?: ProductImageUpsertWithWhereUniqueWithoutProductInput | ProductImageUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductImageCreateManyProductInputEnvelope
    set?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    disconnect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    delete?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    connect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    update?: ProductImageUpdateWithWhereUniqueWithoutProductInput | ProductImageUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductImageUpdateManyWithWhereWithoutProductInput | ProductImageUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductImageScalarWhereInput | ProductImageScalarWhereInput[]
  }

  export type ProductImageUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput> | ProductImageCreateWithoutProductInput[] | ProductImageUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImageCreateOrConnectWithoutProductInput | ProductImageCreateOrConnectWithoutProductInput[]
    upsert?: ProductImageUpsertWithWhereUniqueWithoutProductInput | ProductImageUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductImageCreateManyProductInputEnvelope
    set?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    disconnect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    delete?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    connect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    update?: ProductImageUpdateWithWhereUniqueWithoutProductInput | ProductImageUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductImageUpdateManyWithWhereWithoutProductInput | ProductImageUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductImageScalarWhereInput | ProductImageScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutImagesInput = {
    create?: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutImagesInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutImagesInput
    upsert?: ProductUpsertWithoutImagesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutImagesInput, ProductUpdateWithoutImagesInput>, ProductUncheckedUpdateWithoutImagesInput>
  }

  export type GalleryPostMediaCreateNestedManyWithoutPostInput = {
    create?: XOR<GalleryPostMediaCreateWithoutPostInput, GalleryPostMediaUncheckedCreateWithoutPostInput> | GalleryPostMediaCreateWithoutPostInput[] | GalleryPostMediaUncheckedCreateWithoutPostInput[]
    connectOrCreate?: GalleryPostMediaCreateOrConnectWithoutPostInput | GalleryPostMediaCreateOrConnectWithoutPostInput[]
    createMany?: GalleryPostMediaCreateManyPostInputEnvelope
    connect?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
  }

  export type GalleryPostMediaUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<GalleryPostMediaCreateWithoutPostInput, GalleryPostMediaUncheckedCreateWithoutPostInput> | GalleryPostMediaCreateWithoutPostInput[] | GalleryPostMediaUncheckedCreateWithoutPostInput[]
    connectOrCreate?: GalleryPostMediaCreateOrConnectWithoutPostInput | GalleryPostMediaCreateOrConnectWithoutPostInput[]
    createMany?: GalleryPostMediaCreateManyPostInputEnvelope
    connect?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type GalleryPostMediaUpdateManyWithoutPostNestedInput = {
    create?: XOR<GalleryPostMediaCreateWithoutPostInput, GalleryPostMediaUncheckedCreateWithoutPostInput> | GalleryPostMediaCreateWithoutPostInput[] | GalleryPostMediaUncheckedCreateWithoutPostInput[]
    connectOrCreate?: GalleryPostMediaCreateOrConnectWithoutPostInput | GalleryPostMediaCreateOrConnectWithoutPostInput[]
    upsert?: GalleryPostMediaUpsertWithWhereUniqueWithoutPostInput | GalleryPostMediaUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: GalleryPostMediaCreateManyPostInputEnvelope
    set?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
    disconnect?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
    delete?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
    connect?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
    update?: GalleryPostMediaUpdateWithWhereUniqueWithoutPostInput | GalleryPostMediaUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: GalleryPostMediaUpdateManyWithWhereWithoutPostInput | GalleryPostMediaUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: GalleryPostMediaScalarWhereInput | GalleryPostMediaScalarWhereInput[]
  }

  export type GalleryPostMediaUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<GalleryPostMediaCreateWithoutPostInput, GalleryPostMediaUncheckedCreateWithoutPostInput> | GalleryPostMediaCreateWithoutPostInput[] | GalleryPostMediaUncheckedCreateWithoutPostInput[]
    connectOrCreate?: GalleryPostMediaCreateOrConnectWithoutPostInput | GalleryPostMediaCreateOrConnectWithoutPostInput[]
    upsert?: GalleryPostMediaUpsertWithWhereUniqueWithoutPostInput | GalleryPostMediaUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: GalleryPostMediaCreateManyPostInputEnvelope
    set?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
    disconnect?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
    delete?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
    connect?: GalleryPostMediaWhereUniqueInput | GalleryPostMediaWhereUniqueInput[]
    update?: GalleryPostMediaUpdateWithWhereUniqueWithoutPostInput | GalleryPostMediaUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: GalleryPostMediaUpdateManyWithWhereWithoutPostInput | GalleryPostMediaUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: GalleryPostMediaScalarWhereInput | GalleryPostMediaScalarWhereInput[]
  }

  export type GalleryPostCreateNestedOneWithoutMediaInput = {
    create?: XOR<GalleryPostCreateWithoutMediaInput, GalleryPostUncheckedCreateWithoutMediaInput>
    connectOrCreate?: GalleryPostCreateOrConnectWithoutMediaInput
    connect?: GalleryPostWhereUniqueInput
  }

  export type GalleryPostUpdateOneRequiredWithoutMediaNestedInput = {
    create?: XOR<GalleryPostCreateWithoutMediaInput, GalleryPostUncheckedCreateWithoutMediaInput>
    connectOrCreate?: GalleryPostCreateOrConnectWithoutMediaInput
    upsert?: GalleryPostUpsertWithoutMediaInput
    connect?: GalleryPostWhereUniqueInput
    update?: XOR<XOR<GalleryPostUpdateToOneWithWhereWithoutMediaInput, GalleryPostUpdateWithoutMediaInput>, GalleryPostUncheckedUpdateWithoutMediaInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumMediaTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MediaType | EnumMediaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMediaTypeFilter<$PrismaModel> | $Enums.MediaType
  }

  export type NestedEnumMediaTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MediaType | EnumMediaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMediaTypeWithAggregatesFilter<$PrismaModel> | $Enums.MediaType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMediaTypeFilter<$PrismaModel>
    _max?: NestedEnumMediaTypeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PaintingCreateWithoutAuthorInput = {
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collection?: CollectionCreateNestedOneWithoutPaintingsInput
    media?: PaintingMediaCreateNestedManyWithoutPaintingInput
  }

  export type PaintingUncheckedCreateWithoutAuthorInput = {
    id?: number
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    collectionId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: PaintingMediaUncheckedCreateNestedManyWithoutPaintingInput
  }

  export type PaintingCreateOrConnectWithoutAuthorInput = {
    where: PaintingWhereUniqueInput
    create: XOR<PaintingCreateWithoutAuthorInput, PaintingUncheckedCreateWithoutAuthorInput>
  }

  export type PaintingCreateManyAuthorInputEnvelope = {
    data: PaintingCreateManyAuthorInput | PaintingCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type CollectionCreateWithoutAuthorInput = {
    title: string
    coverPhotoUrl?: string | null
    coverPhotoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateWithoutAuthorInput = {
    id?: number
    title: string
    coverPhotoUrl?: string | null
    coverPhotoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionCreateOrConnectWithoutAuthorInput = {
    where: CollectionWhereUniqueInput
    create: XOR<CollectionCreateWithoutAuthorInput, CollectionUncheckedCreateWithoutAuthorInput>
  }

  export type CollectionCreateManyAuthorInputEnvelope = {
    data: CollectionCreateManyAuthorInput | CollectionCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type ProductCreateWithoutAuthorInput = {
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    category: CategoryCreateNestedOneWithoutProductsInput
    images?: ProductImageCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutAuthorInput = {
    id?: number
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    categoryId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ProductImageUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutAuthorInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutAuthorInput, ProductUncheckedCreateWithoutAuthorInput>
  }

  export type ProductCreateManyAuthorInputEnvelope = {
    data: ProductCreateManyAuthorInput | ProductCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type PaintingUpsertWithWhereUniqueWithoutAuthorInput = {
    where: PaintingWhereUniqueInput
    update: XOR<PaintingUpdateWithoutAuthorInput, PaintingUncheckedUpdateWithoutAuthorInput>
    create: XOR<PaintingCreateWithoutAuthorInput, PaintingUncheckedCreateWithoutAuthorInput>
  }

  export type PaintingUpdateWithWhereUniqueWithoutAuthorInput = {
    where: PaintingWhereUniqueInput
    data: XOR<PaintingUpdateWithoutAuthorInput, PaintingUncheckedUpdateWithoutAuthorInput>
  }

  export type PaintingUpdateManyWithWhereWithoutAuthorInput = {
    where: PaintingScalarWhereInput
    data: XOR<PaintingUpdateManyMutationInput, PaintingUncheckedUpdateManyWithoutAuthorInput>
  }

  export type PaintingScalarWhereInput = {
    AND?: PaintingScalarWhereInput | PaintingScalarWhereInput[]
    OR?: PaintingScalarWhereInput[]
    NOT?: PaintingScalarWhereInput | PaintingScalarWhereInput[]
    id?: IntFilter<"Painting"> | number
    title?: StringFilter<"Painting"> | string
    description?: StringNullableFilter<"Painting"> | string | null
    coverUrl?: StringFilter<"Painting"> | string
    coverPublicId?: StringFilter<"Painting"> | string
    hasNeon?: BoolFilter<"Painting"> | boolean
    isForSale?: BoolFilter<"Painting"> | boolean
    sortOrder?: IntFilter<"Painting"> | number
    year?: IntNullableFilter<"Painting"> | number | null
    authorId?: IntFilter<"Painting"> | number
    collectionId?: IntNullableFilter<"Painting"> | number | null
    createdAt?: DateTimeFilter<"Painting"> | Date | string
    updatedAt?: DateTimeFilter<"Painting"> | Date | string
  }

  export type CollectionUpsertWithWhereUniqueWithoutAuthorInput = {
    where: CollectionWhereUniqueInput
    update: XOR<CollectionUpdateWithoutAuthorInput, CollectionUncheckedUpdateWithoutAuthorInput>
    create: XOR<CollectionCreateWithoutAuthorInput, CollectionUncheckedCreateWithoutAuthorInput>
  }

  export type CollectionUpdateWithWhereUniqueWithoutAuthorInput = {
    where: CollectionWhereUniqueInput
    data: XOR<CollectionUpdateWithoutAuthorInput, CollectionUncheckedUpdateWithoutAuthorInput>
  }

  export type CollectionUpdateManyWithWhereWithoutAuthorInput = {
    where: CollectionScalarWhereInput
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyWithoutAuthorInput>
  }

  export type CollectionScalarWhereInput = {
    AND?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
    OR?: CollectionScalarWhereInput[]
    NOT?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
    id?: IntFilter<"Collection"> | number
    title?: StringFilter<"Collection"> | string
    coverPhotoUrl?: StringNullableFilter<"Collection"> | string | null
    coverPhotoPublicId?: StringFilter<"Collection"> | string
    authorId?: IntFilter<"Collection"> | number
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
  }

  export type ProductUpsertWithWhereUniqueWithoutAuthorInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutAuthorInput, ProductUncheckedUpdateWithoutAuthorInput>
    create: XOR<ProductCreateWithoutAuthorInput, ProductUncheckedCreateWithoutAuthorInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutAuthorInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutAuthorInput, ProductUncheckedUpdateWithoutAuthorInput>
  }

  export type ProductUpdateManyWithWhereWithoutAuthorInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutAuthorInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: IntFilter<"Product"> | number
    title?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    price?: FloatFilter<"Product"> | number
    stock?: IntFilter<"Product"> | number
    sortOrder?: IntFilter<"Product"> | number
    categoryId?: IntFilter<"Product"> | number
    authorId?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
  }

  export type AuthorCreateWithoutCollectionsInput = {
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingCreateNestedManyWithoutAuthorInput
    products?: ProductCreateNestedManyWithoutAuthorInput
  }

  export type AuthorUncheckedCreateWithoutCollectionsInput = {
    id?: number
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingUncheckedCreateNestedManyWithoutAuthorInput
    products?: ProductUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type AuthorCreateOrConnectWithoutCollectionsInput = {
    where: AuthorWhereUniqueInput
    create: XOR<AuthorCreateWithoutCollectionsInput, AuthorUncheckedCreateWithoutCollectionsInput>
  }

  export type PaintingCreateWithoutCollectionInput = {
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: AuthorCreateNestedOneWithoutPaintingsInput
    media?: PaintingMediaCreateNestedManyWithoutPaintingInput
  }

  export type PaintingUncheckedCreateWithoutCollectionInput = {
    id?: number
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: PaintingMediaUncheckedCreateNestedManyWithoutPaintingInput
  }

  export type PaintingCreateOrConnectWithoutCollectionInput = {
    where: PaintingWhereUniqueInput
    create: XOR<PaintingCreateWithoutCollectionInput, PaintingUncheckedCreateWithoutCollectionInput>
  }

  export type PaintingCreateManyCollectionInputEnvelope = {
    data: PaintingCreateManyCollectionInput | PaintingCreateManyCollectionInput[]
    skipDuplicates?: boolean
  }

  export type AuthorUpsertWithoutCollectionsInput = {
    update: XOR<AuthorUpdateWithoutCollectionsInput, AuthorUncheckedUpdateWithoutCollectionsInput>
    create: XOR<AuthorCreateWithoutCollectionsInput, AuthorUncheckedCreateWithoutCollectionsInput>
    where?: AuthorWhereInput
  }

  export type AuthorUpdateToOneWithWhereWithoutCollectionsInput = {
    where?: AuthorWhereInput
    data: XOR<AuthorUpdateWithoutCollectionsInput, AuthorUncheckedUpdateWithoutCollectionsInput>
  }

  export type AuthorUpdateWithoutCollectionsInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUpdateManyWithoutAuthorNestedInput
    products?: ProductUpdateManyWithoutAuthorNestedInput
  }

  export type AuthorUncheckedUpdateWithoutCollectionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUncheckedUpdateManyWithoutAuthorNestedInput
    products?: ProductUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type PaintingUpsertWithWhereUniqueWithoutCollectionInput = {
    where: PaintingWhereUniqueInput
    update: XOR<PaintingUpdateWithoutCollectionInput, PaintingUncheckedUpdateWithoutCollectionInput>
    create: XOR<PaintingCreateWithoutCollectionInput, PaintingUncheckedCreateWithoutCollectionInput>
  }

  export type PaintingUpdateWithWhereUniqueWithoutCollectionInput = {
    where: PaintingWhereUniqueInput
    data: XOR<PaintingUpdateWithoutCollectionInput, PaintingUncheckedUpdateWithoutCollectionInput>
  }

  export type PaintingUpdateManyWithWhereWithoutCollectionInput = {
    where: PaintingScalarWhereInput
    data: XOR<PaintingUpdateManyMutationInput, PaintingUncheckedUpdateManyWithoutCollectionInput>
  }

  export type AuthorCreateWithoutPaintingsInput = {
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionCreateNestedManyWithoutAuthorInput
    products?: ProductCreateNestedManyWithoutAuthorInput
  }

  export type AuthorUncheckedCreateWithoutPaintingsInput = {
    id?: number
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutAuthorInput
    products?: ProductUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type AuthorCreateOrConnectWithoutPaintingsInput = {
    where: AuthorWhereUniqueInput
    create: XOR<AuthorCreateWithoutPaintingsInput, AuthorUncheckedCreateWithoutPaintingsInput>
  }

  export type CollectionCreateWithoutPaintingsInput = {
    title: string
    coverPhotoUrl?: string | null
    coverPhotoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    author: AuthorCreateNestedOneWithoutCollectionsInput
  }

  export type CollectionUncheckedCreateWithoutPaintingsInput = {
    id?: number
    title: string
    coverPhotoUrl?: string | null
    coverPhotoPublicId?: string
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollectionCreateOrConnectWithoutPaintingsInput = {
    where: CollectionWhereUniqueInput
    create: XOR<CollectionCreateWithoutPaintingsInput, CollectionUncheckedCreateWithoutPaintingsInput>
  }

  export type PaintingMediaCreateWithoutPaintingInput = {
    url: string
    publicId?: string
    isNeon?: boolean
    order?: number
    type?: $Enums.MediaType
  }

  export type PaintingMediaUncheckedCreateWithoutPaintingInput = {
    id?: number
    url: string
    publicId?: string
    isNeon?: boolean
    order?: number
    type?: $Enums.MediaType
  }

  export type PaintingMediaCreateOrConnectWithoutPaintingInput = {
    where: PaintingMediaWhereUniqueInput
    create: XOR<PaintingMediaCreateWithoutPaintingInput, PaintingMediaUncheckedCreateWithoutPaintingInput>
  }

  export type PaintingMediaCreateManyPaintingInputEnvelope = {
    data: PaintingMediaCreateManyPaintingInput | PaintingMediaCreateManyPaintingInput[]
    skipDuplicates?: boolean
  }

  export type AuthorUpsertWithoutPaintingsInput = {
    update: XOR<AuthorUpdateWithoutPaintingsInput, AuthorUncheckedUpdateWithoutPaintingsInput>
    create: XOR<AuthorCreateWithoutPaintingsInput, AuthorUncheckedCreateWithoutPaintingsInput>
    where?: AuthorWhereInput
  }

  export type AuthorUpdateToOneWithWhereWithoutPaintingsInput = {
    where?: AuthorWhereInput
    data: XOR<AuthorUpdateWithoutPaintingsInput, AuthorUncheckedUpdateWithoutPaintingsInput>
  }

  export type AuthorUpdateWithoutPaintingsInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUpdateManyWithoutAuthorNestedInput
    products?: ProductUpdateManyWithoutAuthorNestedInput
  }

  export type AuthorUncheckedUpdateWithoutPaintingsInput = {
    id?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutAuthorNestedInput
    products?: ProductUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type CollectionUpsertWithoutPaintingsInput = {
    update: XOR<CollectionUpdateWithoutPaintingsInput, CollectionUncheckedUpdateWithoutPaintingsInput>
    create: XOR<CollectionCreateWithoutPaintingsInput, CollectionUncheckedCreateWithoutPaintingsInput>
    where?: CollectionWhereInput
  }

  export type CollectionUpdateToOneWithWhereWithoutPaintingsInput = {
    where?: CollectionWhereInput
    data: XOR<CollectionUpdateWithoutPaintingsInput, CollectionUncheckedUpdateWithoutPaintingsInput>
  }

  export type CollectionUpdateWithoutPaintingsInput = {
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: AuthorUpdateOneRequiredWithoutCollectionsNestedInput
  }

  export type CollectionUncheckedUpdateWithoutPaintingsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaintingMediaUpsertWithWhereUniqueWithoutPaintingInput = {
    where: PaintingMediaWhereUniqueInput
    update: XOR<PaintingMediaUpdateWithoutPaintingInput, PaintingMediaUncheckedUpdateWithoutPaintingInput>
    create: XOR<PaintingMediaCreateWithoutPaintingInput, PaintingMediaUncheckedCreateWithoutPaintingInput>
  }

  export type PaintingMediaUpdateWithWhereUniqueWithoutPaintingInput = {
    where: PaintingMediaWhereUniqueInput
    data: XOR<PaintingMediaUpdateWithoutPaintingInput, PaintingMediaUncheckedUpdateWithoutPaintingInput>
  }

  export type PaintingMediaUpdateManyWithWhereWithoutPaintingInput = {
    where: PaintingMediaScalarWhereInput
    data: XOR<PaintingMediaUpdateManyMutationInput, PaintingMediaUncheckedUpdateManyWithoutPaintingInput>
  }

  export type PaintingMediaScalarWhereInput = {
    AND?: PaintingMediaScalarWhereInput | PaintingMediaScalarWhereInput[]
    OR?: PaintingMediaScalarWhereInput[]
    NOT?: PaintingMediaScalarWhereInput | PaintingMediaScalarWhereInput[]
    id?: IntFilter<"PaintingMedia"> | number
    url?: StringFilter<"PaintingMedia"> | string
    publicId?: StringFilter<"PaintingMedia"> | string
    isNeon?: BoolFilter<"PaintingMedia"> | boolean
    order?: IntFilter<"PaintingMedia"> | number
    type?: EnumMediaTypeFilter<"PaintingMedia"> | $Enums.MediaType
    paintingId?: IntFilter<"PaintingMedia"> | number
  }

  export type PaintingCreateWithoutMediaInput = {
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: AuthorCreateNestedOneWithoutPaintingsInput
    collection?: CollectionCreateNestedOneWithoutPaintingsInput
  }

  export type PaintingUncheckedCreateWithoutMediaInput = {
    id?: number
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    authorId: number
    collectionId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaintingCreateOrConnectWithoutMediaInput = {
    where: PaintingWhereUniqueInput
    create: XOR<PaintingCreateWithoutMediaInput, PaintingUncheckedCreateWithoutMediaInput>
  }

  export type PaintingUpsertWithoutMediaInput = {
    update: XOR<PaintingUpdateWithoutMediaInput, PaintingUncheckedUpdateWithoutMediaInput>
    create: XOR<PaintingCreateWithoutMediaInput, PaintingUncheckedCreateWithoutMediaInput>
    where?: PaintingWhereInput
  }

  export type PaintingUpdateToOneWithWhereWithoutMediaInput = {
    where?: PaintingWhereInput
    data: XOR<PaintingUpdateWithoutMediaInput, PaintingUncheckedUpdateWithoutMediaInput>
  }

  export type PaintingUpdateWithoutMediaInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: AuthorUpdateOneRequiredWithoutPaintingsNestedInput
    collection?: CollectionUpdateOneWithoutPaintingsNestedInput
  }

  export type PaintingUncheckedUpdateWithoutMediaInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    authorId?: IntFieldUpdateOperationsInput | number
    collectionId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateWithoutCategoryInput = {
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    author: AuthorCreateNestedOneWithoutProductsInput
    images?: ProductImageCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutCategoryInput = {
    id?: number
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ProductImageUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductCreateManyCategoryInputEnvelope = {
    data: ProductCreateManyCategoryInput | ProductCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
  }

  export type ProductUpdateManyWithWhereWithoutCategoryInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutCategoryInput>
  }

  export type CategoryCreateWithoutProductsInput = {
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUncheckedCreateWithoutProductsInput = {
    id?: number
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryCreateOrConnectWithoutProductsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
  }

  export type AuthorCreateWithoutProductsInput = {
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingCreateNestedManyWithoutAuthorInput
    collections?: CollectionCreateNestedManyWithoutAuthorInput
  }

  export type AuthorUncheckedCreateWithoutProductsInput = {
    id?: number
    firstName: string
    lastName: string
    bio?: string | null
    photoUrl?: string | null
    photoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paintings?: PaintingUncheckedCreateNestedManyWithoutAuthorInput
    collections?: CollectionUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type AuthorCreateOrConnectWithoutProductsInput = {
    where: AuthorWhereUniqueInput
    create: XOR<AuthorCreateWithoutProductsInput, AuthorUncheckedCreateWithoutProductsInput>
  }

  export type ProductImageCreateWithoutProductInput = {
    url: string
    publicId?: string
    order?: number
  }

  export type ProductImageUncheckedCreateWithoutProductInput = {
    id?: number
    url: string
    publicId?: string
    order?: number
  }

  export type ProductImageCreateOrConnectWithoutProductInput = {
    where: ProductImageWhereUniqueInput
    create: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput>
  }

  export type ProductImageCreateManyProductInputEnvelope = {
    data: ProductImageCreateManyProductInput | ProductImageCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type CategoryUpsertWithoutProductsInput = {
    update: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutProductsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type CategoryUpdateWithoutProductsInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthorUpsertWithoutProductsInput = {
    update: XOR<AuthorUpdateWithoutProductsInput, AuthorUncheckedUpdateWithoutProductsInput>
    create: XOR<AuthorCreateWithoutProductsInput, AuthorUncheckedCreateWithoutProductsInput>
    where?: AuthorWhereInput
  }

  export type AuthorUpdateToOneWithWhereWithoutProductsInput = {
    where?: AuthorWhereInput
    data: XOR<AuthorUpdateWithoutProductsInput, AuthorUncheckedUpdateWithoutProductsInput>
  }

  export type AuthorUpdateWithoutProductsInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUpdateManyWithoutAuthorNestedInput
    collections?: CollectionUpdateManyWithoutAuthorNestedInput
  }

  export type AuthorUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    photoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUncheckedUpdateManyWithoutAuthorNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type ProductImageUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductImageWhereUniqueInput
    update: XOR<ProductImageUpdateWithoutProductInput, ProductImageUncheckedUpdateWithoutProductInput>
    create: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput>
  }

  export type ProductImageUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductImageWhereUniqueInput
    data: XOR<ProductImageUpdateWithoutProductInput, ProductImageUncheckedUpdateWithoutProductInput>
  }

  export type ProductImageUpdateManyWithWhereWithoutProductInput = {
    where: ProductImageScalarWhereInput
    data: XOR<ProductImageUpdateManyMutationInput, ProductImageUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductImageScalarWhereInput = {
    AND?: ProductImageScalarWhereInput | ProductImageScalarWhereInput[]
    OR?: ProductImageScalarWhereInput[]
    NOT?: ProductImageScalarWhereInput | ProductImageScalarWhereInput[]
    id?: IntFilter<"ProductImage"> | number
    url?: StringFilter<"ProductImage"> | string
    publicId?: StringFilter<"ProductImage"> | string
    order?: IntFilter<"ProductImage"> | number
    productId?: IntFilter<"ProductImage"> | number
  }

  export type ProductCreateWithoutImagesInput = {
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    category: CategoryCreateNestedOneWithoutProductsInput
    author: AuthorCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutImagesInput = {
    id?: number
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    categoryId: number
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductCreateOrConnectWithoutImagesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
  }

  export type ProductUpsertWithoutImagesInput = {
    update: XOR<ProductUpdateWithoutImagesInput, ProductUncheckedUpdateWithoutImagesInput>
    create: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutImagesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutImagesInput, ProductUncheckedUpdateWithoutImagesInput>
  }

  export type ProductUpdateWithoutImagesInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutProductsNestedInput
    author?: AuthorUpdateOneRequiredWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutImagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryPostMediaCreateWithoutPostInput = {
    url: string
    publicId?: string
    type?: $Enums.MediaType
    order?: number
  }

  export type GalleryPostMediaUncheckedCreateWithoutPostInput = {
    id?: number
    url: string
    publicId?: string
    type?: $Enums.MediaType
    order?: number
  }

  export type GalleryPostMediaCreateOrConnectWithoutPostInput = {
    where: GalleryPostMediaWhereUniqueInput
    create: XOR<GalleryPostMediaCreateWithoutPostInput, GalleryPostMediaUncheckedCreateWithoutPostInput>
  }

  export type GalleryPostMediaCreateManyPostInputEnvelope = {
    data: GalleryPostMediaCreateManyPostInput | GalleryPostMediaCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type GalleryPostMediaUpsertWithWhereUniqueWithoutPostInput = {
    where: GalleryPostMediaWhereUniqueInput
    update: XOR<GalleryPostMediaUpdateWithoutPostInput, GalleryPostMediaUncheckedUpdateWithoutPostInput>
    create: XOR<GalleryPostMediaCreateWithoutPostInput, GalleryPostMediaUncheckedCreateWithoutPostInput>
  }

  export type GalleryPostMediaUpdateWithWhereUniqueWithoutPostInput = {
    where: GalleryPostMediaWhereUniqueInput
    data: XOR<GalleryPostMediaUpdateWithoutPostInput, GalleryPostMediaUncheckedUpdateWithoutPostInput>
  }

  export type GalleryPostMediaUpdateManyWithWhereWithoutPostInput = {
    where: GalleryPostMediaScalarWhereInput
    data: XOR<GalleryPostMediaUpdateManyMutationInput, GalleryPostMediaUncheckedUpdateManyWithoutPostInput>
  }

  export type GalleryPostMediaScalarWhereInput = {
    AND?: GalleryPostMediaScalarWhereInput | GalleryPostMediaScalarWhereInput[]
    OR?: GalleryPostMediaScalarWhereInput[]
    NOT?: GalleryPostMediaScalarWhereInput | GalleryPostMediaScalarWhereInput[]
    id?: IntFilter<"GalleryPostMedia"> | number
    url?: StringFilter<"GalleryPostMedia"> | string
    publicId?: StringFilter<"GalleryPostMedia"> | string
    type?: EnumMediaTypeFilter<"GalleryPostMedia"> | $Enums.MediaType
    order?: IntFilter<"GalleryPostMedia"> | number
    postId?: IntFilter<"GalleryPostMedia"> | number
  }

  export type GalleryPostCreateWithoutMediaInput = {
    title: string
    content: string
    coverUrl?: string | null
    coverPublicId?: string
    date?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GalleryPostUncheckedCreateWithoutMediaInput = {
    id?: number
    title: string
    content: string
    coverUrl?: string | null
    coverPublicId?: string
    date?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GalleryPostCreateOrConnectWithoutMediaInput = {
    where: GalleryPostWhereUniqueInput
    create: XOR<GalleryPostCreateWithoutMediaInput, GalleryPostUncheckedCreateWithoutMediaInput>
  }

  export type GalleryPostUpsertWithoutMediaInput = {
    update: XOR<GalleryPostUpdateWithoutMediaInput, GalleryPostUncheckedUpdateWithoutMediaInput>
    create: XOR<GalleryPostCreateWithoutMediaInput, GalleryPostUncheckedCreateWithoutMediaInput>
    where?: GalleryPostWhereInput
  }

  export type GalleryPostUpdateToOneWithWhereWithoutMediaInput = {
    where?: GalleryPostWhereInput
    data: XOR<GalleryPostUpdateWithoutMediaInput, GalleryPostUncheckedUpdateWithoutMediaInput>
  }

  export type GalleryPostUpdateWithoutMediaInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPublicId?: StringFieldUpdateOperationsInput | string
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryPostUncheckedUpdateWithoutMediaInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPublicId?: StringFieldUpdateOperationsInput | string
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaintingCreateManyAuthorInput = {
    id?: number
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    collectionId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollectionCreateManyAuthorInput = {
    id?: number
    title: string
    coverPhotoUrl?: string | null
    coverPhotoPublicId?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductCreateManyAuthorInput = {
    id?: number
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    categoryId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaintingUpdateWithoutAuthorInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection?: CollectionUpdateOneWithoutPaintingsNestedInput
    media?: PaintingMediaUpdateManyWithoutPaintingNestedInput
  }

  export type PaintingUncheckedUpdateWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    collectionId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: PaintingMediaUncheckedUpdateManyWithoutPaintingNestedInput
  }

  export type PaintingUncheckedUpdateManyWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    collectionId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionUpdateWithoutAuthorInput = {
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paintings?: PaintingUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateManyWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    coverPhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPhotoPublicId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUpdateWithoutAuthorInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutProductsNestedInput
    images?: ProductImageUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ProductImageUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaintingCreateManyCollectionInput = {
    id?: number
    title: string
    description?: string | null
    coverUrl: string
    coverPublicId?: string
    hasNeon?: boolean
    isForSale?: boolean
    sortOrder?: number
    year?: number | null
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaintingUpdateWithoutCollectionInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: AuthorUpdateOneRequiredWithoutPaintingsNestedInput
    media?: PaintingMediaUpdateManyWithoutPaintingNestedInput
  }

  export type PaintingUncheckedUpdateWithoutCollectionInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: PaintingMediaUncheckedUpdateManyWithoutPaintingNestedInput
  }

  export type PaintingUncheckedUpdateManyWithoutCollectionInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverPublicId?: StringFieldUpdateOperationsInput | string
    hasNeon?: BoolFieldUpdateOperationsInput | boolean
    isForSale?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaintingMediaCreateManyPaintingInput = {
    id?: number
    url: string
    publicId?: string
    isNeon?: boolean
    order?: number
    type?: $Enums.MediaType
  }

  export type PaintingMediaUpdateWithoutPaintingInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    isNeon?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
  }

  export type PaintingMediaUncheckedUpdateWithoutPaintingInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    isNeon?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
  }

  export type PaintingMediaUncheckedUpdateManyWithoutPaintingInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    isNeon?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
  }

  export type ProductCreateManyCategoryInput = {
    id?: number
    title: string
    description?: string | null
    price: number
    stock?: number
    sortOrder?: number
    authorId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateWithoutCategoryInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: AuthorUpdateOneRequiredWithoutProductsNestedInput
    images?: ProductImageUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ProductImageUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    authorId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImageCreateManyProductInput = {
    id?: number
    url: string
    publicId?: string
    order?: number
  }

  export type ProductImageUpdateWithoutProductInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type ProductImageUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type ProductImageUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GalleryPostMediaCreateManyPostInput = {
    id?: number
    url: string
    publicId?: string
    type?: $Enums.MediaType
    order?: number
  }

  export type GalleryPostMediaUpdateWithoutPostInput = {
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GalleryPostMediaUncheckedUpdateWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GalleryPostMediaUncheckedUpdateManyWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    type?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    order?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}