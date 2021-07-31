#!/bin/bash
if [ "$#" -eq "0" ]; then
	docker exec -d -it blockchain bash -c '/scripts/setup.sh'
elif [ $1 = "stop" ]; then
	docker exec -d -it blockchain bash -c "pkill nodeos; pkill keosd"
elif [ $1 = "replay" ]; then
	docker exec -d -it blockchain bash -c '/scripts/setup.sh replay'
elif [ $1 = "reset" ]; then
	docker exec -d -it blockchain bash -c '/scripts/setup.sh reset'
fi
