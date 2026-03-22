import slugify from 'slugify'
import { v7 as uuid_v7 } from 'uuid'

const uuid = () => uuid_v7()

const slug = (str: string) =>
  slugify(str, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })

export { uuid, slug }
