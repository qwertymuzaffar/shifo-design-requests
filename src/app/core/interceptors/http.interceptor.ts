import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { TokenService } from '@core/services/token.service';
import { NgxRolesService } from 'ngx-permissions';
import { UserService } from '@core/services/user.service';
import { TranslocoService } from '@jsverse/transloco';

const SUPABASE_URL = 'https://fqpuetdiywsiruryixjy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxcHVldGRpeXdzaXJ1cnlpeGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NTM5NTgsImV4cCI6MjA4MTQyOTk1OH0.NpkkiCIg0fztouWsf3lfzSZM4vuD5FPrX6gEsmVgtjQ';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();
  const translocoService = inject(TranslocoService);

  const isDebtorsRequest = req.url === '/analytics/debtors';
  const isOverpaymentsRequest = req.url === '/analytics/overpayments';

  if (isDebtorsRequest || isOverpaymentsRequest) {
    const functionName = isDebtorsRequest ? 'analytics-debtors' : 'analytics-overpayments';
    req = req.clone({
      url: `${SUPABASE_URL}/functions/v1/${functionName}`,
      setHeaders: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  } else {
    req = req.clone({
      url: `${environment.apiUrl}${req.url}?lang=${translocoService.getActiveLang()}`,
    });

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        tokenService.clearUserCredential();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
