#!/bin/bash -eux
REACT_APP_INTERVAL=500 yarn build
docker network create cypress-run || echo joining existing network
docker rm -f kibanator-sut || echo no container no problem
docker run --name kibanator-sut -d --network cypress-run --net-alias kibanator -v $(pwd)/build:/srv/http/ui pierrezemb/gostatic --fallback=/ui/index.html
docker run -it --rm --network cypress-run mgurov/kibanator-cypress test
docker rm -f kibanator-sut