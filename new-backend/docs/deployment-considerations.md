# Production Deployment Considerations

This document outlines key considerations for deploying the KeystoneJS application to a production environment.

## 1. Environment Variables

Ensure all necessary environment variables are securely configured in the production environment. **Do NOT commit sensitive credentials directly into your `.env\` file in version control.** Use your hosting provider's mechanism for setting environment variables.

**Required Variables:**
*   `DATABASE_URL`: Connection string for the PostgreSQL production database.
*   `SESSION_SECRET`: A long, random, and strong secret key for session management.
*   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
*   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
*   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
*   `PORT`: The port your application should listen on (e.g., provided by the hosting environment, defaults to 3000).
*   `NODE_ENV`: Set to `production`. KeystoneJS often uses this to optimize performance and disable development features (like default GraphQL Playground).

**Optional Variables:**
*   `CORS_ORIGIN`: Configure Cross-Origin Resource Sharing for your frontend URL(s). Example: `http://yourfrontend.com,https://yourfrontend.com`. Keystone's `server.cors` config might use this.
*   Logging levels or configurations.

## 2. Production Build

*   Run `npx keystone build` (or your project's build script, e.g., `npm run build`) to create an optimized production build of your KeystoneJS application. This typically builds the Admin UI and prepares the server.
*   The `Dockerfile` provided includes this build step.

## 3. Database Migrations

*   **DO NOT run `prisma migrate dev` in production.** This command is for development and can lead to data loss.
*   Use `npx prisma migrate deploy` to apply pending migrations to your production database. This command executes existing migration files and does not attempt to generate new ones or reset the database.
*   The `Procfile` includes a `release` phase command for platforms like Heroku to run migrations during deployment. For other platforms, integrate this command into your deployment pipeline before the application starts.

## 4. Starting the Application

*   Use a production-ready start command, typically `npm run start`, which should be configured in your `package.json` to execute `keystone start`.
*   The `Dockerfile` uses `npm run start`.

## 5. HTTPS

*   Ensure your application is served over HTTPS in production. This is usually handled by your hosting provider, load balancer, or a reverse proxy like Nginx or Caddy.

## 6. CORS (Cross-Origin Resource Sharing)

*   Configure CORS settings in your KeystoneJS application (`src/keystone.ts` under `server.cors`) to allow requests from your frontend domain(s).

## 7. Logging and Monitoring

*   Implement robust logging (e.g., using libraries like Pino or Winston) and integrate with a monitoring service to track application performance and errors. KeystoneJS might have built-in logging capabilities that can be configured.

## 8. Backups

*   Regularly back up your production database.
*   If using Cloudinary, ensure your assets there are also part of your backup/disaster recovery strategy if applicable.

## 9. Security Headers

*   Consider adding security-related HTTP headers (e.g., Helmet.js for Express applications, or via your reverse proxy) to enhance security.

Following these considerations will help ensure a smooth and secure deployment.

## 10. Deployment Process (Conceptual Overview for Step 18)

This section outlines the general steps to deploy the containerized KeystoneJS application using the provided `Dockerfile`. The exact commands will vary based on your chosen hosting platform (e.g., Heroku, AWS ECS, Google Cloud Run, DigitalOcean App Platform, etc.).

**General Steps for Docker-based Deployment:**

1.  **Build Docker Image:**
    *   Navigate to the `new-backend` directory where the `Dockerfile` is located.
    *   Build the Docker image:
        ```bash
        docker build -t your-app-name:latest .
        # Replace 'your-app-name' with your desired image name and tag.
        ```

2.  **Push Docker Image to a Registry:**
    *   Tag the image for your container registry (e.g., Docker Hub, AWS ECR, Google GCR):
        ```bash
        docker tag your-app-name:latest your-registry/your-app-name:latest
        ```
    *   Log in to your container registry:
        ```bash
        docker login your-registry # (e.g., docker login for Docker Hub)
        ```
    *   Push the image:
        ```bash
        docker push your-registry/your-app-name:latest
        ```

3.  **Deploy to Hosting Platform:**
    *   **Configure Service:** On your hosting platform, define a new service or update an existing one to use the pushed Docker image.
    *   **Environment Variables:** Configure all necessary production environment variables (as listed in section 1) in your hosting platform's service configuration. **Do not hardcode them in the Docker image.**
    *   **Port Mapping:** Ensure the platform maps external traffic (usually port 80/443) to the container's exposed port (defined by `PORT` env var, defaulting to 3000).
    *   **Database Connection:** Ensure the deployed application can securely connect to your production PostgreSQL database. This often involves configuring network rules or VPC peering.
    *   **Run Migrations:** Before the application starts serving traffic (or as a release phase), ensure database migrations are run: `npx prisma migrate deploy`. Platforms like Heroku use the `release` command in the `Procfile`. For others, this might be a step in your CI/CD pipeline.
    *   **Launch Service:** Start/deploy the service.

**Example for Heroku (using Procfile and Docker Deploys):**
    *   Heroku can build the Docker image from your `Dockerfile` and use the `Procfile` to run web and release tasks.
    *   You would typically link your Heroku app to your Git repository and configure it for Docker deploys.
    *   Set environment variables in Heroku's config vars.

## 11. Monitoring (Conceptual Overview for Step 18)

Effective monitoring is crucial for maintaining the health, performance, and reliability of your production application.

**Key Monitoring Areas:**

1.  **Application Performance Monitoring (APM):**
    *   Track API endpoint response times (average, percentiles).
    *   Identify slow queries and mutations.
    *   Monitor error rates (HTTP 5xx, GraphQL errors).
    *   Trace requests through the application to pinpoint bottlenecks.
    *   (e.g., New Relic, Datadog, Sentry APM, Dynatrace)

2.  **Server/Infrastructure Monitoring:**
    *   CPU utilization.
    *   Memory usage.
    *   Disk space (especially if storing any temporary files, though less common with Cloudinary for assets).
    *   Network traffic (in/out).
    *   Container health and restarts (if using container orchestration).
    *   (e.g., Datadog, Prometheus/Grafana, AWS CloudWatch, Google Cloud Monitoring)

3.  **Database Monitoring:**
    *   Query performance and slow queries.
    *   Connection count and limits.
    *   CPU, memory, and storage utilization of the database server.
    *   Replication lag (if using read replicas).
    *   (Tools provided by your database hosting service, or general DB monitoring tools)

4.  **Log Management:**
    *   Aggregate application logs (from KeystoneJS, Node.js runtime) in a centralized logging system.
    *   Search, analyze, and set up alerts based on log patterns (e.g., error messages, specific events).
    *   (e.g., Datadog Logs, Sentry, ELK Stack (Elasticsearch, Logstash, Kibana), Splunk, Papertrail)

5.  **Uptime Monitoring / Availability:**
    *   External services that ping your application's health check endpoint or key API endpoints regularly to ensure it's online and responsive.
    *   (e.g., UptimeRobot, Pingdom, StatusCake)

6.  **Cloudinary Monitoring (if applicable):**
    *   Monitor usage against your Cloudinary plan limits (storage, transformations, bandwidth).
    *   Check for any errors related to asset delivery or uploads.
    *   (Via Cloudinary's dashboard and analytics)

**Setting up Alerts:**
Configure alerts for critical issues based on thresholds (e.g., high error rate, high CPU usage, low disk space, endpoint down) to get notified proactively.

Regularly review monitoring dashboards and logs to understand application behavior, identify potential issues, and plan for capacity or performance improvements.
