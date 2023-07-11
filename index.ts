import * as express from 'express';
import {Router, Request, Response } from 'express';
//static jest słowem zarezerowanym w js, aby go użyć zmieniamy mu nazwę
import {Application, json, static as expressStatic_ } from 'express';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'express-handlebars';
import {HomeRouter} from "./routers/home";
import {ConfiguratorRouter} from "./routers/configurator";
import {OrderRouter} from "./routers/order";
import {handlebarsHelpers} from "./utils/handlebars-helpers";
import {COOKIE_BASES, COOKIE_ADDONS} from "./data/cookies-data";
import { engine } from 'express-handlebars';
import { Entries } from './types/entries';

export class CookieMakerApp {
    private app: Application;
    public readonly data = {
        COOKIE_BASES,
        COOKIE_ADDONS,
    };

    private readonly routers = [HomeRouter, ConfiguratorRouter, OrderRouter];


    constructor() {
        this._configureApp();
        this._setRoutes();
        this._run();
    }

    _configureApp(): void {
        this.app = express();

        this.app.use(json());
        this.app.use(expressStatic_('public'));
        this.app.use(cookieParser());
        //zamiast hbs robi się teraz engine (patrz dokumentacja)
        this.app.engine('.hbs', engine({
            extname: '.hbs',
            helpers: handlebarsHelpers,
        }));
        this.app.set('view engine', '.hbs');
    }

    //ustaw nasze routery (nasze scieżki)
    _setRoutes(): void {

        for (const router of this.routers){
            //dla każdego routera weź naszą aplikację użyj w niej dla prefiksu z tego routera.urlPrefix utwórz nowy router new router i weź z niego właściwość router
            this.app.use(router.urlPrefix, new router(this).router);
        }

        //po staremu było w ten sposób (po nowemu powyżej z pętlą)
        this.app.use(ConfiguratorRouter.urlPrefix, new HomeRouter(this).router);
        this.app.use(ConfiguratorRouter.urlPrefix, new ConfiguratorRouter(this).router);
        this.app.use(ConfiguratorRouter.urlPrefix, new OrderRouter(this).router);
    }

    _run(): void {
        this.app.listen(3000, '0.0.0.0', () => {
            console.log('Listening on http://localhost:3000');
        });
    }

    showErrorPage(res: Response , description: string) {
        res.render('error', {
            description,
        });
    }

    getAddonsFromReq(req: Request): string[] {
        const {cookieAddons} = req.cookies as {
            cookieAddons: string,
        };
        return cookieAddons ? JSON.parse(cookieAddons) : [];
    }

    getCookieSettings(req: Request):{
        addons: string[],
        base: string | undefined,
        sum: number,
        //Nowy typ obiekt Mapa który mówi że klucze to stringi, a wartości to liczby. Nie ostatecznie, jednak zaimportowaliśmy wcześniej zdefiniowane typy Entries
        allBases: Entries,
        allAddons: Entries,
    } {
        const {cookieBase: base} = req.cookies as {
            cookieBase?: string,
        };

        const addons = this.getAddonsFromReq(req);

        const allBases = Object.entries(this.data.COOKIE_BASES);
        const allAddons = Object.entries(this.data.COOKIE_ADDONS);

        const sum = (base ? handlebarsHelpers.findPrice(allBases, base) : 0)
            + addons.reduce((prev, curr) => (
                prev + handlebarsHelpers.findPrice(allAddons, curr)
            ), 0);

        return {
            // Selected stuff
            addons,
            base,

            // Calculations
            sum,

            // All possibilities
            allBases,
            allAddons,
        };
    }
}

new CookieMakerApp();