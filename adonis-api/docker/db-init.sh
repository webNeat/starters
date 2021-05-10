#!/bin/bash
set -e

echo "Creating database: ${TEST_POSTGRES_DB}"
psql --username ${POSTGRES_USER} <<EOSQL
CREATE DATABASE ${TEST_POSTGRES_DB} OWNER ${POSTGRES_USER};
EOSQL
