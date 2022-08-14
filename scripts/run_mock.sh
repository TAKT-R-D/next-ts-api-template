#!/bin/zsh
# yarn global add @stoplight/prisma-cli

prisma mock -d ../docs/dist/openapi.yaml

exit 0;