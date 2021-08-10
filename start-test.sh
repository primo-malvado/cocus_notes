docker-compose -f docker/docker-compose-dev.yml build
docker-compose -f docker/docker-compose-dev.yml run frontend sh docker/frontend/test.sh
