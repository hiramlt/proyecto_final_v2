import mongoose from 'mongoose'
import Assert from 'assert'
import config from '../../src/config/config.js'
import ProductDao from '../../src/dao/products.dao.js'

const assert = Assert.strict;

describe('Test de modulo ProductDao', function() {
  before(async function() {
    await mongoose.connect(config.mongo_uri_test);
  });

  beforeEach(async function() {
    await mongoose.connection.collections.products.drop();
  })

  after(async function () {
    await mongoose.connection.close();
  });

  it('Debe crear un producto', async function() { 
    const data = {
      title: 'Test P1',
      description: 'Test de creación de producto',
      code: 'T1',
      price: 100,
      status: 'Disponible',
      stock: 10,
      category: 'Test'
    }
    const result = await ProductDao.create(data)
    assert.ok(result)
    assert.ok(result.createdAt)
    assert.strictEqual(typeof result, 'object')
    assert.strictEqual(typeof result._id, 'object')
    assert.strictEqual(result.owner, 'adminCoder@coder.com');
  })

  it('Debe obtener un producto por código', async function() { 
    const data = {
        title: 'Test P1',
        description: 'Test de creación de producto',
        code: 'T1',
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test'
    }
    await ProductDao.create(data)
    const result = await ProductDao.getByCode(data.code)

    assert.ok(result)
    assert.ok(result.createdAt)
    assert.strictEqual(typeof result, 'object')
    assert.strictEqual(data.code, result.code)
  })

  it('Debe actualizar un producto por ID', async function() { 
    const data = {
        title: 'Test P1',
        description: 'Test de creación de producto',
        code: 'T1',
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test'
    }
    const updateData = {
        title: 'Test P2',
        description: 'Test de creación de producto (Actualizado)',
        stock: 6,
    }

    const product = await ProductDao.create(data)
    const result = await ProductDao.update(product._id, updateData)

    assert.ok(result)
    assert.strictEqual(typeof result, 'object')
    assert.strictEqual(result.acknowledged, true)
    assert.strictEqual(result.modifiedCount, 1)
  })

  it('Debe eliminar un producto por ID', async function() { 
    const data = {
        title: 'Test P1',
        description: 'Test de creación de producto',
        code: 'T1',
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test'
    }
    const product = await ProductDao.create(data)
    const result = await ProductDao.delete(product._id)

    assert.ok(result)
    assert.strictEqual(typeof result, 'object')
    assert.strictEqual(result.acknowledged, true)
    assert.strictEqual(result.deletedCount, 1)
  })

  it('Debe obtener la lista de productos páginados', async function() { 
    const result = await ProductDao.get()
    assert.ok(result)
    assert.strictEqual(Array.isArray(result.docs), true)
    assert.ok(result.hasOwnProperty('page'));
    assert.ok(result.hasOwnProperty('hasPrevPage'));
    assert.ok(result.hasOwnProperty('hasNextPage'));
  })  
})