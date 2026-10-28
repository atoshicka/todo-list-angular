import { HttpEventType, HttpInterceptorFn } from "@angular/common/http";
import { tap } from "rxjs";

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const started = Date.now();

    return next(req).pipe(
        tap({
            next: event => {
                if (event.type === HttpEventType.Response) {
                    console.log(`${req.method} ${req.url} ${Date.now() - started} мс`)
                }
            },
            error: () => {
                console.warn(`${req.method} ${req.url} ошибка`)
            },
        }),
    );
};