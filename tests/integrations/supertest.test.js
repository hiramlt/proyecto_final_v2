import { expect } from 'chai'
import supertest from 'supertest'
import config from '../../src/config/config.js'

const requester = supertest(`http://localhost:${config.port}`)

const data = {
  cookie: {},
  user_id: '',
  cart_id: '',
  email: '',
}

describe('Ecommerce App Test', function () {
  describe('Auth test', function () {
    it('Deberia registrar un usuario de forma exitosa', async function () {
      data.email = `test${Date.now()}@example.com`

      const testUserData = {
        first_name: 'UserName',
        last_name: 'Test',
        email: data.email,
        password: 'TestPassw',
        age: 22,
      }

      const { statusCode, ok, _body } = await requester
        .post('/api/auth/register')
        .send(testUserData)

      expect(statusCode).to.be.equal(302)
      expect(_body).to.be.equal(undefined)
    })

    it('Deberia iniciar sesión de forma exitosa', async function () {
      const { headers, statusCode, ok, _body } = await requester
        .post('/api/auth/login')
        .send({ email: data.email, password: 'TestPassw' })

      expect(statusCode).to.be.equal(302)
      expect(_body).to.be.equal(undefined)

      const [key, value] = headers['set-cookie'][0].split('=')
      data.cookie.key = key
      data.cookie.value = value
    })

    it('Deberia obtener los datos del usuario', async function () {
      const { statusCode, ok, _body } = await requester
        .get('/api/auth/me')
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      expect(statusCode).to.be.equal(200)
      expect(ok).to.be.equal(true)
      expect(_body).to.be.a('object')
      expect(_body).to.have.property('id')
      expect(_body.email).to.be.equal(data.email)
      expect(_body.role).to.be.equal('user')

      data.user_id = _body.id
      data.cart_id = _body.cart
    })

    it('Deberia actualizar el rol del usuario a premium', async function () {
      const { statusCode, ok, _body } = await requester
        .post(`/api/users/premium/${data.user_id}`)
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      expect(statusCode).to.be.equal(200)
      expect(ok).to.be.equal(true)
      expect(_body).to.be.a('object')
      expect(_body).to.have.property('_id')
      expect(_body.email).to.be.equal(data.email)
      expect(_body.role).to.be.equal('premium')
    })
  })

  describe('Products test', function () {
    it('Deberia registrar un producto de forma exitosa', async function () {
      const productData = {
        title: 'TestProd',
        description: 'Test de creación de producto',
        code: Date.now(),
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test',
        owner: data.email,
      }

      const { statusCode, ok, _body } = await requester
        .post('/api/products')
        .send(productData)
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      expect(statusCode).to.be.equal(201)
      expect(ok).to.be.equal(true)
      expect(_body).to.be.a('object')
      expect(_body).to.have.property('_id')
      expect(_body).to.have.property('createdAt')
      expect(_body.owner).to.be.ok
    })

    it('Deberia fallar al obtener eliminar un producto con diferente creador', async function () {
      const productData = {
        title: 'TestProd',
        description:
          'Test de creación de producto con diferente creador (default)',
        code: Date.now(),
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test',
      }

      const res = await requester
        .post('/api/products')
        .send(productData)
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      const { statusCode, ok } = await requester
        .del(`/api/products/${res._body._id}`)
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      expect(statusCode).to.be.equal(403)
      expect(ok).to.be.equal(false)
    })
  })

  describe('Carts test', function () {
    it('Deberia agregar un producto a un carrito de forma exitosa', async function () {
      const productData = {
        title: 'TestProd',
        description: 'Test de creación de producto',
        code: Date.now(),
        price: 100,
        status: 'Disponible',
        stock: 10,
        category: 'Test',
      }

      const res = await requester
        .post('/api/products')
        .send(productData)
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      const { statusCode, ok, _body } = await requester
        .post(`/api/carts/${data.cart_id}/product/${res._body._id}`)
        .send({ quantity: 6 })
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      expect(statusCode).to.be.equal(200)
      expect(ok).to.be.equal(true)
      expect(_body).to.be.a('object')
      expect(_body).to.have.property('_id')
      expect(Array.isArray(_body.products)).to.be.ok
      expect(_body.products).to.have.lengthOf(1)
    })

    it('Deberia comprar un producto de forma exitosa', async function () {
      const { statusCode, ok, _body } = await requester
        .post(`/api/carts/${data.cart_id}/purchase`)
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      expect(statusCode).to.be.equal(200)
      expect(ok).to.be.equal(true)
      expect(_body).to.be.a('object')

      if (_body.hasOwnProperty('ticket')) {
        expect(_body.ticket).to.be.a('object')
        expect(_body.ticket).to.have.property('id')
        expect(_body.ticket).to.have.property('purchaser')
        expect(_body.ticket.purchaser).to.be.equal(data.email)
        expect(_body).to.have.property('unavailableProducts')
        expect(Array.isArray(_body.unavailableProducts)).to.be.ok
        return
      }

      expect(_body).to.have.property('id')
      expect(_body).to.have.property('purchaser')
      expect(_body.purchaser).to.be.equal(data.email)
    })

    it('Deberia vaciar un carrito de forma exitosa', async function () {
      const { statusCode, ok } = await requester
        .del(`/api/carts/${data.cart_id}`)
        .set('Cookie', [`${data.cookie.key}=${data.cookie.value}`])

      expect(statusCode).to.be.equal(204)
      expect(ok).to.be.equal(true)
    })
  })
})
