#!/bin/bash

echo "Building and starting new containers..."
docker-compose up -d --build --force-recreate

echo "Waiting for new containers to be healthy..."
docker-compose run --rm app sh -c 'while ! curl -sS http://localhost:3000/healthcheck; do sleep 1; done'

echo "Stopping and removing old containers..."
docker-compose down