# Rethink LMS

A full-stack Learning Management System with AI-powered academic integrity detection. Built as a thesis project exploring predictive AI integration in educational platforms.

## Overview

Rethink LMS enables teachers to create and manage courses, upload assignments, and review student submissions — with automatic AI-generated content detection on every submission. Flagged submissions receive AI-generated feedback to guide students toward original work.

## Getting Started

Create `packages/server/.env` with the following:
```env
DATABASE_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
HF_TOKEN=
CLIENT_URL=
```

Then:
```bash
npm install
cd packages/server && npx prisma migrate dev
node prisma/seed.js
npm run dev
```