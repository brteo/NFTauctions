#!/bin/bash
args=$@
docker exec -it blockchain bash -c "cd /contracts; source /root/env.sh; cleos $args"
