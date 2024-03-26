# Ghent Squash Booker

## Introduction

Welcome to the Ghent Squash Booker project! This guide will help you get up and running with the project quickly.

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- Node.js (version in .tool-versions)

## Getting started

1. Install the dependencies:

```bash
npm install
```

1. Create a .env

```ini
USERNAME=XXX
PASSWORD=XXX
BOOKING_DAY_OF_WEEK=2
BOOKING_TIME=18:30
HEADLESS_BROWSER=false
PUPPETEER_PATH=
```

1. Run the main script

```bash
npm run dev
```

## Configuration

All available options are listed in src/utils/env.ts

`BOOKING_TIME=18:30`

Description: Start time of the squash session

`BOOKING_DAY_OF_WEEK=2`

Description: Day of the week to book the time slots for 1 squash session

Options:

- Sunday: `0`
- Monday: `1`
- Tuesday: `2`
- Wednesday: `3`
- Thursday: `4`
- Friday: `5`
- Saturday: `6`
