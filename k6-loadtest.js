import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const strip = (u) => u.replace(/\/$/, '');
const WEB_URL = strip(__ENV.WEB_URL || 'https://mern-recipe-info-manu-bharadwaj.vercel.app');
const API_URL = strip(__ENV.API_URL || 'https://manu-recipe-api.onrender.com');
const USERNAME = __ENV.USERNAME;
const PASSWORD = __ENV.PASSWORD;

const cacheHitRate = new Rate('redis_cache_hit_rate');
const apiListDuration = new Trend('api_recipes_list_duration', true);

export const options = {
  setupTimeout: '120s',
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    'http_req_duration{name:frontend}': ['p(95)<800'],
    'http_req_duration{name:api_health}': ['p(95)<800'],
    'http_req_duration{name:api_recipes}': ['p(95)<800', 'p(99)<1500'],
    redis_cache_hit_rate: ['rate>0.8'],
  },
};

export function setup() {
  if (!USERNAME || !PASSWORD) {
    throw new Error('Pass credentials: k6 run -e USERNAME=... -e PASSWORD=... k6-loadtest.js');
  }
  http.get(`${API_URL}/health`, { timeout: '90s' });

  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ username: USERNAME, password: PASSWORD });

  http.post(`${API_URL}/auth/register`, body, { headers, tags: { name: 'setup_register' } });
  const res = http.post(`${API_URL}/auth/login`, body, { headers, tags: { name: 'setup_login' } });
  const ok = check(res, {
    'login status is 200': (r) => r.status === 200,
    'login returned token': (r) => !!r.json('token'),
  });
  if (!ok) {
    throw new Error(`Login failed (status ${res.status}): ${res.body}`);
  }
  return { token: res.json('token') };
}

export default function (data) {
  const authHeaders = { headers: { Authorization: `Bearer ${data.token}` } };

  group('frontend (Vercel)', () => {
    const res = http.get(`${WEB_URL}/`, { tags: { name: 'frontend' } });
    check(res, {
      'frontend 200': (r) => r.status === 200,
      'frontend serves React root': (r) => r.body && r.body.includes('id="root"'),
    });
  });
  sleep(1);

  group('API health (Render)', () => {
    const res = http.get(`${API_URL}/health`, { tags: { name: 'api_health' } });
    check(res, { 'health 200': (r) => r.status === 200 });
  });
  sleep(1);

  group('API recipes list (JWT + Redis cache)', () => {
    const res = http.get(`${API_URL}/recipes`, { ...authHeaders, tags: { name: 'api_recipes' } });
    check(res, {
      'recipes 200': (r) => r.status === 200,
      'recipes is JSON array': (r) => Array.isArray(r.json()),
    });
    apiListDuration.add(res.timings.duration);
    cacheHitRate.add(res.headers['X-Cache'] === 'HIT');
  });

  sleep(Math.random() * 2 + 1);
}
