# Deployment Instructions for Surveys Platform

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Set up Supabase Database

1. **Create a new Supabase project**:
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "surveys-platform"
   - Generate a strong database password
   - Select a region close to your users
   - Click "Create new project"

2. **Run the database migration**:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run the SQL script
   - This will create all necessary tables, policies, and indexes

3. **Configure Authentication**:
   - Go to Authentication > Settings
   - Enable "Enable email confirmations" (optional)
   - Set up your email templates if needed
   - Configure any additional auth providers if desired

4. **Get your environment variables**:
   - Go to Settings > API
   - Copy the following values:
     - `Project URL` (for NEXT_PUBLIC_SUPABASE_URL)
     - `anon public` key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)
     - `service_role secret` key (for SUPABASE_SERVICE_ROLE_KEY)

## Step 2: Deploy to Vercel

1. **Connect your GitHub repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your surveys platform

2. **Configure environment variables**:
   - In the deployment configuration, add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your_random_secret_key_here
   ```

3. **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Use the output as your NEXTAUTH_SECRET value.

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be available at `https://your-project-name.vercel.app`

## Step 3: Configure Custom Domain (Optional)

1. **Add custom domain in Vercel**:
   - Go to your project settings in Vercel
   - Click "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

2. **Update environment variables**:
   - Update `NEXTAUTH_URL` to your custom domain
   - Redeploy if necessary

## Step 4: Set up Supabase Edge Functions (Optional)

If you need server-side functionality:

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy functions**:
   ```bash
   supabase functions deploy
   ```

## Step 5: Configure Analytics (Optional)

1. **Google Analytics**:
   - Create a GA4 property
   - Add `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` to your environment variables

2. **Vercel Analytics**:
   - Enable in your Vercel project settings
   - No additional configuration needed

## Step 6: Set up Monitoring

1. **Supabase Monitoring**:
   - Monitor database performance in Supabase dashboard
   - Set up alerts for high usage

2. **Vercel Monitoring**:
   - Monitor function performance
   - Set up alerts for errors

## Environment Variables Summary

Create a `.env.local` file for local development:

```env
# Database Configuration (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Security Checklist

- [ ] Enable Row Level Security (RLS) on all tables ✅
- [ ] Configure proper authentication policies ✅
- [ ] Use service role key only for server-side operations ✅
- [ ] Enable HTTPS in production (automatic with Vercel) ✅
- [ ] Set up proper CORS policies if needed
- [ ] Configure rate limiting for API endpoints
- [ ] Enable database backups in Supabase
- [ ] Set up monitoring and alerts

## Troubleshooting

### Common Issues:

1. **Authentication not working**:
   - Check NEXTAUTH_URL matches your domain
   - Verify Supabase keys are correct
   - Check RLS policies are properly configured

2. **Database connection issues**:
   - Verify Supabase URL and keys
   - Check if database migration ran successfully
   - Ensure RLS policies allow the operations

3. **Build failures**:
   - Check all environment variables are set
   - Verify TypeScript types are correct
   - Check for any missing dependencies

4. **Performance issues**:
   - Add database indexes for frequently queried columns
   - Optimize Supabase queries
   - Enable Vercel Edge Functions if needed

## Support

For issues specific to:
- **Supabase**: Check [Supabase docs](https://supabase.com/docs) or [Discord](https://discord.supabase.com)
- **Vercel**: Check [Vercel docs](https://vercel.com/docs) or support
- **Next.js**: Check [Next.js docs](https://nextjs.org/docs)

## Post-Deployment

1. **Test all functionality**:
   - User registration and login
   - Form creation and editing
   - Form submission and responses
   - Data export functionality

2. **Set up backups**:
   - Configure automatic database backups in Supabase
   - Consider exporting critical data regularly

3. **Monitor usage**:
   - Track user growth
   - Monitor database usage and performance
   - Set up billing alerts

Your Surveys platform is now ready for production use! 🚀