<?php

namespace App\Http\Middleware;

use App\Jobs\CheckOverdueReservations;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CheckOverdueReservationsMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only trigger for successful responses to avoid unnecessary checks on errors
        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            $this->triggerOverdueCheck();
        }

        return $response;
    }

    /**
     * Trigger overdue check with rate limiting to prevent excessive checks
     */
    private function triggerOverdueCheck(): void
    {
        $cacheKey = 'overdue_check_triggered';
        $cacheDuration = 300; // 5 minutes

        // Only trigger if we haven't checked in the last 5 minutes
        if (!Cache::has($cacheKey)) {
            CheckOverdueReservations::dispatch()->delay(now()->addSeconds(10));
            Cache::put($cacheKey, true, $cacheDuration);
        }
    }
}
