import mongoose from 'mongoose'
import { expect } from 'chai'
import config from '../../src/config/config.js'
import CartDao from '../../src/dao/carts.dao.js'
import ProductDao from '../../src/dao/products.dao.js'

describe('Test de modulo CartDao usando chai', function() {
  before(async function() {
    await mongoose.connect(config.mongo_uri_test);
  })
    
  beforeEach(async function() {
    await mongoose.connection.collections.products.drop();
    await mongoose.connection.collections.carts.drop();
  })
    
  after(async function () {
    await mongoose.connection.close();
  })

  it('Debe crear un carrito', async function() { 
    const cart = await CartDao.create()

    expect(cart).to.be.ok
    expect(cart).to.be.a('object')
    expect(cart).to.have.property('createdAt')
    expect(cart.products).to.be.deep.equal([])
  })

  it('Debe obtener un carrito por ID', async function() { 
    const cart = await CartDao.create()
    const result = await CartDao.getById(cart._id)
  
    expect(result).to.be.ok
    expect(result).to.be.a('object')
    expect(result).to.have.property('createdAt')
    expect(result.products).to.be.deep.equal([])
    expect(result._id).to.be.deep.equal(cart._id)
  })

  it('Debe agregar productos a un carrito', async function() {
    const product_data = {
        title: 'Test P1',
        description: 'Test de creación de producto',
        code: 'T1',
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test'
    }
    const product = await ProductDao.create(product_data)
    const cart = await CartDao.create()
    const result = await CartDao.addProducts(cart._id, product._id, 3)

    expect(result).to.be.ok
    expect(result).to.be.a('object')
    expect(Array.isArray(result.products)).to.be.ok;
    expect(result.products).to.have.lengthOf(1)
  }) 

  it('Debe eliminar todos los productos de un carrito', async function() {
    const product_data1 = {
        title: 'Test P1',
        description: 'Test de creación de producto',
        code: 'T1',
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test'
    }
    const product_data2 = {
        title: 'Test P2',
        description: 'Test de creación de producto',
        code: 'T2',
        price: 200,
        status: 'Disponible',
        stock: 24,
        category: 'Test'
    }
    const cart = await CartDao.create()

    const product1 = await ProductDao.create(product_data1)
    const product2 = await ProductDao.create(product_data2)
    await CartDao.addProducts(cart._id, product1._id, 3)
    await CartDao.addProducts(cart._id, product2._id, 5)
    const result = await CartDao.delete(cart._id)

    expect(result).to.be.ok
    expect(result).to.be.a('object')
    expect(result).to.have.property('acknowledged')
    expect(result).to.have.property('modifiedCount')
    expect(result.acknowledged).to.be.equal(true);
    expect(result.modifiedCount).to.be.above(0)
  }) 

  it('Debe eliminar un producto de un carrito', async function() {
    const product_data1 = {
        title: 'Test P1',
        description: 'Test de creación de producto',
        code: 'T1',
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test'
    }
    const product_data2 = {
        title: 'Test P2',
        description: 'Test de creación de producto',
        code: 'T2',
        price: 200,
        status: 'Disponible',
        stock: 24,
        category: 'Test'
    }
    const cart = await CartDao.create()

    const product1 = await ProductDao.create(product_data1)
    const product2 = await ProductDao.create(product_data2)
    await CartDao.addProducts(cart._id, product1._id, 3)
    await CartDao.addProducts(cart._id, product2._id, 5)
    const result = await CartDao.deleteProducts(cart._id, product1._id)

    expect(result).to.be.ok
    expect(result).to.be.a('object')
    expect(Array.isArray(result.products)).to.be.ok
    expect(result.products).to.have.lengthOf(1)
  }) 

})