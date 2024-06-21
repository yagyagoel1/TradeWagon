import { NextFunction, Request, Response } from 'express';
import prometheus from 'prom-client';
declare global {
    namespace Express {
      export interface Request {
        startTime: number; 
      }
    }
  }
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [10, 50, 100, 200, 500, 1000], 
});

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const activeRequests = new prometheus.Gauge({
  name: 'http_active_requests',
  help: 'Number of active HTTP requests',
});

const failedRequests = new prometheus.Counter({
  name: 'http_failed_requests_total',
  help: 'Total number of failed HTTP requests',
  labelNames: ['method', 'route','status'],
});

const middleware = (req:Request, res:Response, next:NextFunction) => {
  activeRequests.inc();
  res.on('finish', () => {
    const route = `${req.baseUrl}${req.path}`;
    const labels = { method: req.method, route, status: res.statusCode };

    httpRequestDurationMicroseconds.labels(labels).observe(Date.now() - req.startTime);//in microseconds
    httpRequestsTotal.labels(labels).inc();
    activeRequests.dec();
    if (res.statusCode >= 400) {
      failedRequests.labels(labels).inc();
    }
  });
  req.startTime = Date.now();
  next();
};

export  { middleware, prometheus };
