import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const taskIdGuard: CanActivateFn = route => {
    const router = inject(Router);
    const id = route.paramMap.get('id');
    if (!Number.isInteger(Number(id))) {
        return router.createUrlTree(['/'])
    }
    return true;
};