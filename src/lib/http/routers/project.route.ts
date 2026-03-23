import { Hono } from 'hono'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  sortProjects,
} from '@/lib/http/controllers/projects.controller'

const projects = new Hono()

projects.get('/', getProjects)
projects.post('/', createProject)
projects.patch('/sort', sortProjects)
projects.put('/:id', updateProject)
projects.delete('/:id', deleteProject)

export default projects
