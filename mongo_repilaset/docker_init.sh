#!/bin/sh
# This is a comment!
docker exec  mongodb0 /bin/sh -c  "mongo < /config/replicainit.js" 