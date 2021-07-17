FROM meboo/eosio-dev:2.1.0-CDT-1.8.0

SHELL ["/bin/bash", "-c"] 
COPY .scripts/setup.sh /root/setup.sh
COPY .scripts/env.sh /root/env.sh
COPY .scripts/seed.sh /root/seed.sh
CMD /root/setup.sh & sleep infinity 