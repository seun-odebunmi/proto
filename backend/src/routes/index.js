import Router from 'express';
import { models } from '../models';

const router = Router();
const routeImports = [require('./url.js')];

routeImports.forEach(routeImport => routeImport.default(router, models));

export default router;
