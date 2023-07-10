import * as express from 'express';
import { Request, Response } from 'express';

export class HomeRouter {
    constructor(cmapp) {
        this.cmapp = cmapp;
        this.router = express.Router();
        this.setUpRoutes();
    }

    setUpRoutes() {
        this.router.get('/', this.home);
    }

    home = (req: Request, res: Response) => {
        const {sum, addons, base, allBases, allAddons} = this.cmapp.getCookieSettings(req);

        res.render('home/index', {
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
