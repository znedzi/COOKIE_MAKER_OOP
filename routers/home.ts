import * as express from 'express';
import { Router, Request, Response } from 'express';
import { CookieMakerApp } from "../index";
import { MyRouter } from '../types/my-routers';

export class HomeRouter implements MyRouter {

    public readonly urlPrefix = '/';
    public readonly router: Router = Router();

    constructor(
        private cmapp: CookieMakerApp,
    ) {
        this.setUpRoutes();
    }

    private setUpRoutes(): void {
        this.router.get('/', this.home);
    }

    private home = (req: Request, res: Response): void => {
        const {sum, addons, base, allBases, allAddons} = this.cmapp.getCookieSettings(req);

        res.render('home/index', {
            //tutaj przekazujemy do home/index poniższe właściwości na podstawie których zostanie utworzona strona html
            cookie: {
                base,
                addons,
            },
            allBases,
            allAddons,
            sum,
        });
    };
}
