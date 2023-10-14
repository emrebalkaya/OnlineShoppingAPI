import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from "express"
import { Routes } from "./routes"
import logger from './logger';

const app = express();
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: Function) => {
    logger.info(`Request from ${req.ip} to ${req.originalUrl} at ${new Date().toUTCString()}`);
    next();
  });

Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
        const result = (new (route.controller as any))[route.action](req, res, next)
        if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)
        } else if (result !== null && result !== undefined) {
            res.json(result)
        }
    })
})

export default app;
