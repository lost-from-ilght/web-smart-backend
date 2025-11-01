# 🚀 Render Deployment Guide for Backend Million

This guide will help you deploy your smart home backend to Render.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Environment Variables**: Prepare your production environment variables

## 🔧 Files Created for Deployment

- `render.yaml` - Render configuration file
- Updated `package.json` with production scripts
- Added health check endpoint in `index.js`

## 📝 Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
# Make sure all files are committed
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Render Account & Connect GitHub

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account
3. Import your repository

### 3. Create Database

1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `backend-million-db`
   - **Database**: `backend_million`
   - **User**: `backend_million_user`
   - **Plan**: Free (or paid if you need more resources)

### 4. Deploy Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

#### Basic Settings
- **Name**: `backend-million`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

#### Build & Deploy
- **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command**: `npm start`
- **Plan**: Free (or paid for better performance)

#### Environment Variables
Add these environment variables in Render dashboard:

```
NODE_ENV=production
DATABASE_URL=<automatically set when you connect database>
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### 5. Connect Database to Web Service

1. In your web service settings
2. Go to **"Environment"** tab
3. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Copy from your PostgreSQL service

### 6. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your app
3. Monitor the build logs for any issues

## 🔍 Post-Deployment Steps

### 1. Run Database Migrations

After deployment, you may need to run migrations:

```bash
# In Render shell or locally with production DATABASE_URL
npx prisma migrate deploy
```

### 2. Seed the Database (Optional)

```bash
# If you want to populate with initial data
npm run seed
```

### 3. Test Your Deployment

Visit your Render URL:
- **Health Check**: `https://your-app-name.onrender.com/health`
- **API Root**: `https://your-app-name.onrender.com/`

## 🛠️ Configuration Details

### render.yaml Configuration

```yaml
services:
  - type: web
    name: backend-million
    env: node
    plan: free
    buildCommand: npm install && npx prisma generate && npx prisma migrate deploy
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
    healthCheckPath: /health
    autoDeploy: true
    branch: main

databases:
  - name: backend-million-db
    plan: free
    databaseName: backend_million
    user: backend_million_user
```

### Package.json Scripts

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js",
    "seed": "node prisma/seed.js",
    "build": "npx prisma generate",
    "postinstall": "npx prisma generate"
  }
}
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **JWT Secret**: Use a strong, random secret key
3. **CORS**: Configure proper CORS origins for production
4. **Database**: Use strong passwords and enable SSL

## 📊 Monitoring & Logs

- **Logs**: Available in Render dashboard
- **Metrics**: Monitor CPU, memory, and response times
- **Health Checks**: Automatic health monitoring at `/health`

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**: Check build logs for missing dependencies
2. **Database Connection**: Verify DATABASE_URL is correct
3. **Environment Variables**: Ensure all required vars are set
4. **Port Issues**: Render automatically sets PORT, don't hardcode it

### Debug Commands

```bash
# Check if app is running
curl https://your-app-name.onrender.com/health

# Check database connection
npx prisma db pull

# View logs in Render dashboard
```

## 🔄 Auto-Deployment

With `autoDeploy: true` in render.yaml, your app will automatically redeploy when you push to the main branch.

## 💰 Cost Considerations

- **Free Plan**: Limited to 750 hours/month
- **Paid Plans**: Start at $7/month for always-on service
- **Database**: Free PostgreSQL with 1GB storage

## 📞 Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Community**: Render Discord/Forums
- **Status**: [status.render.com](https://status.render.com)

---

🎉 **Your backend is now ready for production deployment on Render!**

