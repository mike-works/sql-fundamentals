#!/bin/bash
NODE_ENV=test ./node_modules/.bin/mocha --require ts-node/register ./tests/*.test.ts