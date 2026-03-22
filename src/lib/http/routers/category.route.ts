import { Hono } from 'hono'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/http/controllers/categories.controller'

const categories = new Hono()

categories.get('/', getCategories)
categories.post('/', createCategory)
categories.put('/:id', updateCategory)
categories.delete('/:id', deleteCategory)

export default categories
