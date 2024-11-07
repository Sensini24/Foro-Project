
import { Router } from 'express'
import { getAtajos, getTags } from '../Controllers/tagController.js'
const routheTags = Router()

routheTags.get("/tag/getTags", getTags)
routheTags.get("/tag/getAtajos", getAtajos)

export default routheTags