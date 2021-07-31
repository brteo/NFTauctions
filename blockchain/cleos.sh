#!/bin/bash
args=$@
docker exec -it blockchain bash -c "cd /contracts; source /scripts/env.sh; cleos $args"
