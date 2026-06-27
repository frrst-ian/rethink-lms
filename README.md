# Rethink LMS

A learning management system with AI-powered academic integrity detection. Built as a thesis project.

## What it does

Teachers create courses, post assignments, and review student submissions. Every submission gets scanned by an AI detection model. Flagged work receives generated feedback pointing students toward original thinking.

Students enroll via course codes, submit text or file uploads, and see their AI score instantly after submitting.

## Stack

- **Frontend:** React, Vite, Recharts
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Auth:** JWT, Google OAuth
- **Storage:** Cloudinary
- **AI:** Hugging Face Inference API (`PirateXX/AI-Content-Detector`, `Qwen2.5-72B`)

## Features

- Role-based access for teachers and students
- Assignment file attachments (PDF, DOCX)
- AI detection with flagging threshold and feedback generation
- Teacher dashboard with weekly AI usage trends and submission analytics
- Notification system for assignment posts and submissions
- Course materials library

## Setup

Create `packages/server/.env`:

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

```bash
npm install
cd packages/server && npx prisma migrate dev
npm run dev
```