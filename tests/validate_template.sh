#!/usr/bin/env bash

FC_ENABLE=1 \
FC_SETTINGS=config/settings \
FC_PARTIALS=config/partials \
FC_TEMPLATES=config/templates \
FC_OUT=/tmp/krakend.json \
krakend check -t -d -c krakend.tmpl
exit $?
