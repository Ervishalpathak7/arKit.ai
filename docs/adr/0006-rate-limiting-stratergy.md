### 0006 Rate Limiting Strategy

## Decision

In-memory per-Ip limiting over redis , choosen for zero infrastructure on a single instance
Sliding window over fixed window
Caffeine with expireAfterAccess over a hand-rolled ConcurrentHashMap plus cleanup thread — chosen because expiry, bounded size, and thread safety come free and correct

## Alternatives

Ip stored in redis (Rejected because it adds a service to deploy and maintain for a problem we dont have yet)
Fixed Window (rejected because it can give 2x burst at the boundary)
Sliding window Counter (rejected as unnecessary precision for single instance traffic)
hand-rolling ( Rected because a background cleanup thread is one more lifecycle to manage and get wrong )

## Consequence

Failure mode accepted
Counter reset on app restart
Limit multiplies if we scale out
