import { taskEither } from 'fp-ts'
import { flow, pipe } from 'fp-ts/function'
import { Option } from 'fp-ts/Option'
import { TaskEither } from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { ObjectId } from 'mongodb'
import { IdOf } from '../../../../../../src/domain/entity'
import { ProductRepository as IProductRepository } from '../../../components/order/application/repositories/ProductRepository'
import { Product, ProductC } from '../../../components/order/domain/entities/Product'
import { MongoDbRepositoryAdapter } from './MongoDbRepositoryAdapter'

export class ProductRepository extends MongoDbRepositoryAdapter<Product> implements IProductRepository {
  protected collectionName: string = 'products'

  readManyById(ids: ReadonlyArray<IdOf<Product>>): TaskEither<Error, ReadonlyArray<Product>> {
    return pipe(
      this.client,
      taskEither.chain(connection =>
        taskEither.tryCatch(
          async () => await Promise.resolve([{ id: new ObjectId('602cf58400f4c67f28ddcc0c') }]),
          // await connection
          //   .db()
          //   .collection(this.collectionName)
          //   .find({ _id: ids.map(i => i.toRaw()) }),
          e => new Error(`Unable to read user: ${JSON.stringify(e)}`),
        ),
      ),
      taskEither.chainEitherKW(flow(t.readonlyArray(ProductC).decode)),
      taskEither.map(x => x as any),
      taskEither.mapLeft(e => new Error(e as any)),
      taskEither.chainFirstW(() => this.close()),
    )
  }

  readOneById(id: IdOf<Product>): TaskEither<Error, Option<Product>> {
    throw new Error('Method not implemented')
  }

  upsertMany(entities: ReadonlyArray<Product>): TaskEither<Error, ReadonlyArray<Product>> {
    throw new Error('Method not implemented')
  }

  upsertOne(entity: Product): TaskEither<Error, Product> {
    throw new Error('Method not implemented')
  }
}