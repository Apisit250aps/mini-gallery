import { Hono } from 'hono'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/lib/http/controllers/users.controller'

const users = new Hono()
users.get('/', getUsers)
users.post('/', createUser)
users.put('/:id', updateUser)
users.delete('/:id', deleteUser)

export default users
