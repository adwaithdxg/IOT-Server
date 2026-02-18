import { Router, RequestHandler } from "express";

/**
 * Generic helper function to wrap async controller methods
 * This eliminates the need for manual RequestHandler casting in routes
 * and provides proper error handling for async operations
 * 
 * @param fn - The async controller method to wrap
 * @returns RequestHandler that can be used directly in Express routes
 */
export const asyncHandler = (fn: Function): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Base Route class that provides common functionality for all routes
 * This eliminates the need to import asyncHandler in each route file
 * 
 * @example
 * ```typescript
 * export class UserRouter extends BaseRoute {
 *     private controller: userController;
 * 
 *     constructor() {
 *         super();
 *         this.controller = new userController();
 *         this.initializeRoutes();
 *     }
 * 
 *     private initializeRoutes() {
 *         this.router.post('/signup', this.handle(this.controller.signup));
 *     }
 * }
 * ```
 */
export abstract class BaseRoute {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    /**
     * Wrapper method for async controller methods
     * Use this.handle() instead of asyncHandler in your route definitions
     * 
     * @param fn - The async controller method
     * @returns RequestHandler that can be used in Express routes
     */
    protected handle(fn: Function): RequestHandler {
        return asyncHandler(fn);
    }
}