import UserRepository from './user.repo'
import CategoryRepository from './category.repo'
import ProjectRepository from './project.repo'

export const userRepository = new UserRepository()
export const categoryRepository = new CategoryRepository()
export const projectRepository = new ProjectRepository()