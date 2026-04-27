#!/usr/bin/env bash
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/sdkfile/.cargo/bin"
cd "/Users/sdkfile/Desktop/business/Nullpointer Studio/arxiv-app-maker"
exec node --import tsx/esm pipeline.ts
