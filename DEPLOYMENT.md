# 🚀 Deployment Guide

This guide will walk you through deploying the **TaskFlow** application to the web. We will use **Render** for the backend (free tier) and **Vercel** for the frontend (free tier).

## 🗄️ Database (MongoDB Atlas)

Before deploying code, your database must be in the cloud.

1. AppLog in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Shared Cluster** (Free).
3. **Database Access**: Create a database user (e.g., `taskflow-admin`) and remember the password.
4. **Network Access**: Add IP Address `0.0.0.0/0` (Allow Access from Anywhere) so your deployed backend can connect.
5. **Get Connection String**:
   - Click "Connect" > "Connect your application".
   - Copy the string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password.

---

## 🔙 Backend Deployment (Render)

Render is great for Node.js apps.

1. **Push to GitHub**: Make sure your code is committed and pushed to a GitHub repository.
2. Sign up/Log in to [Render](https://render.com/).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. **Configuration**:
   - **Name**: `taskflow-api`
   - **Root Directory**: `backend` (Important! This tells Render where your API code lives)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. **Environment Variables** (Advanced):
   - Add the following keys from your `.env` file:
     - `NODE_ENV` = `production`
     - `MONGODB_URI` = (Your Atlas connection string)
     - `JWT_SECRET` = (A strong random string)
     - `FRONTEND_URL` = (We will update this *after* deploying frontend, e.g., `https://taskflow.vercel.app`)
     - `EMAIL_USER`, `EMAIL_PASSWORD`, etc. (for emails to work)
7. Click **Create Web Service**.
8. Wait for deployment. Render will give you a URL like `https://taskflow-api.onrender.com`. **Copy this URL.**

---

## 🎨 Frontend Deployment (Vercel)

Vercel is optimized for React/Vite apps.

1. Sign up/Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository.
4. **Configure Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and select `frontend`.
5. **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://taskflow-api.onrender.com/api` (The Render URL you copied + `/api`)
   > **Note**: You need to update your frontend code to use this variable if you hardcoded `localhost`.
6. Click **Deploy**.
7. Vercel will build your site and give you a domain like `https://taskflow-app.vercel.app`.

---

## 🔗 Final Connection Step

1. Go back to **Render** (Backend Dashboard).
2. Update the `FRONTEND_URL` environment variable to your new Vercel domain (`https://taskflow-app.vercel.app`).
3. Render will redeploy automatically.

**🎉 Congratulations! Your full-stack app is now live!**

---

## 🔧 Troubleshooting

- **CORS Error**: If the frontend can't talk to the backend, check the `FRONTEND_URL` var in Render and `VITE_API_URL` in Vercel.
- **Database Error**: Check if your IP Whitelist in MongoDB Atlas allows `0.0.0.0/0`.
- **White Screen on Frontend**: Check the browser console (F12) for errors. Usually it's a wrong API URL.
