import { Router } from "express";


export class AppRoutes {
    public router: Router;

     constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

      private initializeRoutes() {}
}

export default new AppRoutes().router;