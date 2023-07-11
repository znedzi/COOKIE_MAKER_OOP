//tworzymy interfejs w którym definujemy, że obowiązkowo ma być urlPrefix i Router
//ma to sens gdy tworzymy różne obiekty na bazie różnych klas, ale te klasy mają część wspólną


import { Router } from "express";

export interface MyRouter {
    urlPrefix: string;
    //Uwaga !!! router expressowy
    router: Router;
}