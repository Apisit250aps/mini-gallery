import { Hono } from 'hono'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/lib/http/controllers/projects.controller'

const projects = new Hono()

projects.get('/', getProjects)
projects.post('/', createProject)
projects.put('/:id', updateProject)
projects.delete('/:id', deleteProject)

export default projects
