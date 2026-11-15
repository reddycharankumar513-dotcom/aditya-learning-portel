# MongoDB Atlas Security, Firewall & Backup Guide

**Target Database:** MongoDB Atlas (M0 Free Tier or M10+ Dedicated)  
**Security Standard:** Zero 0.0.0.0/0 in Production, TLS 1.2+ Enforced, Least-Privilege RBAC  

---

## 1. Network Firewall & IP Allowlisting

### 1.1 Strict IP Whitelisting Policy
In production, database access must never be wide open (`0.0.0.0/0`). Only authorized outbound IP addresses of the application server are permitted.

#### When using AWS (ECS Fargate via NAT Gateway):
- Obtain the static Elastic IP of the NAT Gateway from Terraform:
  ```bash
  terraform output nat_gateway_elastic_ip
  # Example: 13.232.45.89
  ```
- In MongoDB Atlas Console $\rightarrow$ **Security** $\rightarrow$ **Network Access**:
  - Click **Add IP Address**.
  - Enter: `13.232.45.89/32`.
  - Description: `Learnova Production AWS NAT Gateway EIP`.
  - Click **Confirm**.
  - Delete any `0.0.0.0/0` entries.

#### When using Free PaaS (Render / Railway):
- Render provides outbound IP ranges for its services, or uses secure TLS connection string authorization.
- In Atlas Console $\rightarrow$ **Network Access**: Add your backend host's public IP address.

### 1.2 Private Networking (AWS PrivateLink or VPC Peering)
*Note: Available on Atlas M10+ dedicated clusters.*
1. In Atlas, navigate to **Network Access** $\rightarrow$ **Private Endpoint**.
2. Select **AWS** $\rightarrow$ Region **ap-south-1 (Mumbai)**.
3. In AWS, create an Interface VPC Endpoint referencing Atlas's Service Name.
4. Traffic between Fargate and Atlas travels strictly over the AWS private backbone, completely off the public internet.

---

## 2. Database User Authentication & Least Privilege

1. **Separate Database Users by Environment:**
   - Development: `learnova_dev_user`
   - Staging: `learnova_staging_user`
   - Production: `learnova_prod_user`

2. **Least-Privilege Role Configuration:**
   - Instead of `atlasAdmin` or `readWriteAnyDatabase`, assign custom privileges restricted to `learnova_platform` database:
     ```javascript
     {
       role: "readWrite",
       db: "learnova_platform"
     }
     ```

3. **Password Management:**
   - Generate cryptographically random 32+ character passwords.
   - Store production credentials exclusively in **AWS Secrets Manager** or host environment variables.
   - Never commit connection strings or passwords into source code or Git.

---

## 3. TLS / SSL Encryption in Transit

1. Atlas enforces TLS 1.2+ by default on all `mongodb+srv://` connection strings.
2. The Node.js MongoDB driver automatically validates Atlas's TLS certificates using standard root CAs.
3. Mongoose connection options in `server/src/config/db.ts`:
   ```typescript
   await mongoose.connect(ENV.MONGODB_URI, {
     serverSelectionTimeoutMS: 5000,
     tls: true,
   });
   ```

---

## 4. Automated Backup & Disaster Recovery Procedures

### 4.1 Backup Retention Schedule
- **Continuous Cloud Backups (PITR):** Point-in-time recovery enabled on M10+ clusters with 7-day rollback capability.
- **Daily Snapshots:** Retained for 7 days.
- **Weekly Snapshots:** Retained for 4 weeks.
- **Monthly Snapshots:** Retained for 12 months.

### 4.2 Manual Backup Creation (Before Deployments or Migrations)
To take a manual snapshot before schema changes:
```bash
# Using mongodump with TLS connection string
mongodump --uri="mongodb+srv://learnova_backup_user:PASSWORD@learnova-cluster.xxxxx.mongodb.net/learnova_platform" --out=./backups/$(date +%Y%m%d_%H%M%S) --gzip
```

### 4.3 Database Restore Procedure
1. In Atlas Console: Click **Clusters** $\rightarrow$ **Backup** $\rightarrow$ Select Snapshot $\rightarrow$ Click **Restore**.
2. Or via `mongorestore` tool:
   ```bash
   mongorestore --uri="mongodb+srv://learnova_backup_user:PASSWORD@learnova-cluster.xxxxx.mongodb.net/learnova_platform" --gzip ./backups/<backup_directory>/learnova_platform
   ```
