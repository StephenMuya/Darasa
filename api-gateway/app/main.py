"""
API Gateway - FastAPI Application Entry Point.

This lightweight gateway routes incoming requests to the appropriate
backend microservice in the SomaAI platform.
"""

import httpx
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SomaAI API Gateway",
    description="Central API Gateway that routes requests to SomaAI microservices.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URL map – resolved via Docker Compose service names or env overrides
import os

SERVICE_URLS = {
    "resources": os.getenv("RESOURCE_LIBRARY_SERVICE_URL", "http://resource-library-service:8001"),
    "assessments": os.getenv("ASSESSMENT_SERVICE_URL", "http://assessment-service:8002"),
    "analytics": os.getenv("ANALYTICS_SERVICE_URL", "http://analytics-service:8003"),
    "training-modules": os.getenv("TRAINING_MODULE_SERVICE_URL", "http://training-module-service:8004"),
    "engagements": os.getenv("ENGAGEMENT_SERVICE_URL", "http://engagement-service:8005"),
}

TIMEOUT = httpx.Timeout(30.0)


async def _proxy(request: Request, target_url: str) -> Response:
    """
    Forward a request to the target service and return the response.

    Args:
        request: The incoming FastAPI request object.
        target_url: The full URL of the downstream service endpoint.

    Returns:
        A FastAPI Response containing the proxied content and headers.
    """
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        try:
            proxied = await client.request(
                method=request.method,
                url=target_url,
                headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
                content=await request.body(),
                params=request.query_params,
            )
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {target_url}")
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Gateway timeout")

    return Response(
        content=proxied.content,
        status_code=proxied.status_code,
        headers=dict(proxied.headers),
        media_type=proxied.headers.get("content-type"),
    )


@app.get("/health", tags=["health"])
async def health_check():
    """Gateway health check endpoint."""
    return {"status": "healthy", "service": "API Gateway", "version": "1.0.0"}


# ---------------------------------------------------------------------------
# Resource Library Service routes
# ---------------------------------------------------------------------------

@app.api_route("/api/v1/resources{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_resources(path: str, request: Request):
    """Proxy requests to the Resource Library Service."""
    target = f"{SERVICE_URLS['resources']}/api/v1/resources{path}"
    return await _proxy(request, target)


# ---------------------------------------------------------------------------
# Assessment Service routes
# ---------------------------------------------------------------------------

@app.api_route("/api/v1/assessments{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_assessments(path: str, request: Request):
    """Proxy requests to the Assessment Service."""
    target = f"{SERVICE_URLS['assessments']}/api/v1/assessments{path}"
    return await _proxy(request, target)


# ---------------------------------------------------------------------------
# Analytics Service routes
# ---------------------------------------------------------------------------

@app.api_route("/api/v1/analytics{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_analytics(path: str, request: Request):
    """Proxy requests to the Analytics Service."""
    target = f"{SERVICE_URLS['analytics']}/api/v1/analytics{path}"
    return await _proxy(request, target)


# ---------------------------------------------------------------------------
# Training Module Service routes
# ---------------------------------------------------------------------------

@app.api_route("/api/v1/training-modules{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_training_modules(path: str, request: Request):
    """Proxy requests to the Training Module Service."""
    target = f"{SERVICE_URLS['training-modules']}/api/v1/training-modules{path}"
    return await _proxy(request, target)


# ---------------------------------------------------------------------------
# Engagement Service routes
# ---------------------------------------------------------------------------

@app.api_route("/api/v1/engagements{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_engagements(path: str, request: Request):
    """Proxy requests to the Engagement Service."""
    target = f"{SERVICE_URLS['engagements']}/api/v1/engagements{path}"
    return await _proxy(request, target)
