# Recruiter-AI — Complete API Testing Guide (Thunder Client)

> **Base URL:** `http://localhost:5000`
> **Database:** PostgreSQL (`recruiter_ai`)
> **Auth:** JWT Bearer Token

## 3. Authentication Flow

### 3.1 Register a Candidate

```
Method:  POST
URL:     {{baseUrl}}/auth/register
```

**Headers:**

| Key | Value |
|-----|-------|
| Content-Type | application/json |

**Body (raw JSON):**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

> **Action:** Copy the `token` value → Save it as `candidateToken` in your environment.

---

### 3.2 Register a Recruiter

```
Method:  POST
URL:     {{baseUrl}}/auth/register
```

**Body (raw JSON):**

```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "password": "password123",
  "role": "recruiter",
  "company": "TechCorp Inc."
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@company.com",
    "role": "recruiter"
  }
}
```

> **Action:** Copy the `token` value → Save it as `recruiterToken`.
> **Note:** The recruiter profile is created with `status: "pending"` by default. An admin must approve it.

---

### 3.3 Register an Admin

**Body (raw JSON):**

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 3,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

> **Action:** Copy the `token` value → Save it as `adminToken`.

---

### 3.4 Login as Candidate

```
Method:  POST
URL:     {{baseUrl}}/auth/login
```

**Body (raw JSON):**

```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

---
### 3.5 Login as Recruiter

```
Method:  POST
URL:     {{baseUrl}}/auth/login
```

**Body (raw JSON):**

```json
{
  "email": "jane@company.com",
  "password": "password123",
  "role": "recruiter"
}
```
---

### 3.6 Login as Admin

```
Method:  POST
URL:     {{baseUrl}}/auth/login
```

```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

---

### 3.7 Verify Token

```
Method:  GET
URL:     {{baseUrl}}/auth/verify
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{candidateToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

---

## 4. Health Check Endpoints

### 4.1 Root Health Check

```
Method:  GET
URL:     {{baseUrl}}/
```

**Headers:** None required

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Recruiter-AI API is running"
}
```

---

### 4.2 API Health Check

```
Method:  GET
URL:     {{baseUrl}}/api/health
```

**Headers:** None required

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Recruiter-AI API is running",
  "timestamp": "2025-07-22T10:30:00.000Z"
}
```

### 6.1 Get All Jobs (Public)

```
Method:  GET
URL:     {{baseUrl}}/api/jobs
```

**Headers:** None required

**Query Parameters (optional):**

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `search` | string | `react` | Search in title, description, category |
| `category` | string | `Engineering` | Filter by category |
| `job_type` | string | `Full-time` | Filter by type |
| `location` | string | `New York` | Filter by location |
| `page` | number | `1` | Page number (default: 1) |
| `limit` | number | `10` | Results per page (default: 10) |

**Example with filters:**
```
GET {{baseUrl}}/api/jobs?search=react&page=1&limit=5
```

**Expected Response (200):**

```json
{
  "success": true,
  "jobs": [
    {
      "id": 1,
      "recruiter_id": 2,
      "title": "React Developer",
      "category": "Engineering",
      "location": "New York",
      "job_type": "Full-time",
      "salary_min": 80000,
      "salary_max": 120000,
      "description": "We are looking for a React developer...",
      "requirements": ["React", "JavaScript", "CSS"],
      "status": "active",
      "created_at": "2025-07-22T10:00:00.000Z",
      "updated_at": "2025-07-22T10:00:00.000Z",
      "applications_count": 0,
      "recruiter": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@company.com"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1
  }
}
```

---

### 6.2 Get Job by ID (Public)

```
Method:  GET
URL:     {{baseUrl}}/api/jobs/1
```

**Headers:** None required

**Expected Response (200):**
```json
{
  "success": true,
  "job": {
    "id": 1,
    "title": "React Developer",
    "category": "Engineering",
    "location": "New York",
    "job_type": "Full-time",
    "salary_min": 80000,
    "salary_max": 120000,
    "description": "We are looking for a React developer...",
    "requirements": ["React", "JavaScript", "CSS"],
    "status": "active",
    "recruiter": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@company.com"
    },
    "applications": []
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 6.3 Create Job (Recruiter Only)

```
Method:  POST
URL:     {{baseUrl}}/api/jobs
```

**Headers:**

| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer `{{recruiterToken}}` |

**Body (raw JSON):**

```json
{
  "title": "React Developer",
  "category": "Engineering",
  "location": "New York",
  "job_type": "Full-time",
  "salary_min": 80000,
  "salary_max": 120000,
  "description": "We are looking for a skilled React developer to join our team. You will be responsible for building user-facing web applications.",
  "requirements": ["React", "JavaScript", "CSS", "Node.js"]
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Job created",
  "job": {
    "id": 1,
    "recruiter_id": 2,
    "title": "React Developer",
    "category": "Engineering",
    "location": "New York",
    "job_type": "Full-time",
    "salary_min": 80000,
    "salary_max": 120000,
    "description": "We are looking for a skilled React developer...",
    "requirements": ["React", "JavaScript", "CSS", "Node.js"],
    "status": "active",
    "updated_at": "2025-07-22T10:00:00.000Z",
    "created_at": "2025-07-22T10:00:00.000Z"
  }
}
```

---

### 6.4 Update Job (Recruiter/Admin)

```
Method:  PUT
URL:     {{baseUrl}}/api/jobs/{{jobId}}
```

**Headers:**

| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer `{{recruiterToken}}` |

**Body (raw JSON) — send only the fields you want to update:**

```json
{
  "title": "Senior React Developer",
  "salary_min": 100000,
  "salary_max": 150000
}
```

**Updatable Fields:** `title`, `category`, `location`, `job_type`, `salary_min`, `salary_max`, `description`, `requirements`, `status`

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Job updated",
  "job": {
    "id": 1,
    "title": "Senior React Developer",
    "salary_min": 100000,
    "salary_max": 150000,
    ...
  }
}
```

### 6.5 Delete Job (Recruiter/Admin)

```
Method:  DELETE
URL:     {{baseUrl}}/api/jobs/{{jobId}}
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{recruiterToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Job deleted"
}
```

---

## 7. Application Endpoints

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 7.1 | POST | `/api/applications` | Yes | Candidate | Submit application |
| 7.2 | GET | `/api/applications` | Yes | Any | Get applications |
| 7.3 | PUT | `/api/applications/:id/status` | Yes | Recruiter/Admin | Update status |
| 7.4 | DELETE | `/api/applications/:id` | Yes | Candidate/Admin | Delete application |

---

### 7.1 Submit Application (Candidate Only)

```
Method:  POST
URL:     {{baseUrl}}/api/applications
```

**Headers:**

| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer `{{candidateToken}}` |

**Body (raw JSON):**

```json
{
  "job_id": 1
}
```

**Validation:** `job_id` must be a valid integer.

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Application submitted",
  "application": {
    "id": 1,
    "candidate_id": 1,
    "job_id": 1,
    "status": "new",
    "updated_at": "2025-07-22T10:00:00.000Z",
    "created_at": "2025-07-22T10:00:00.000Z"
  }
}
```

> **Action:** Copy the `application.id` → Save as `applicationId`.

**Error Responses:**
- `404` — Job not found
- `400` — You have already applied to this job

---

### 7.2 Get Applications

**As Candidate** — returns only the candidate's own applications:

```
Method:  GET
URL:     {{baseUrl}}/api/applications
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{candidateToken}}` |

**As Recruiter** — returns applications for the recruiter's jobs:

```
Method:  GET
URL:     {{baseUrl}}/api/applications
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{recruiterToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "applications": [
    {
      "id": 1,
      "candidate_id": 1,
      "job_id": 1,
      "status": "new",
      "name": "John Doe",
      "role": "React Developer",
      "candidate": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "job": {
        "id": 1,
        "title": "React Developer",
        "category": "Engineering",
        "location": "New York",
        "job_type": "Full-time"
      },
      "interview": null
    }
  ]
}
```

---

### 7.3 Update Application Status (Recruiter/Admin)
```
Method:  PUT
URL:     {{baseUrl}}/api/applications/{{applicationId}}/status
```

**Headers:**

| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer `{{recruiterToken}}` |

**Body (raw JSON):**

```json
{
  "status": "under_review"
}
```

**Valid Status Values:**

| Status | Description |
|--------|-------------|
| `new` | Fresh application |
| `under_review` | Being reviewed by recruiter |
| `interview_scheduled` | Interview has been scheduled |
| `rejected` | Application rejected |
| `hired` | Candidate hired |

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Application status updated",
  "application": {
    "id": 1,
    "candidate_id": 1,
    "job_id": 1,
    "status": "under_review",
    ...
  }
}
```

**Error Responses:**
- `404` — Application not found
- `403` — Not authorized (not your job's application)

---

### 7.4 Delete Application (Candidate/Admin)

```
Method:  DELETE
URL:     {{baseUrl}}/api/applications/{{applicationId}}
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{candidateToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Application deleted"
}
```

---

## 8. Interview Endpoints

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 8.1 | GET | `/api/interviews` | Yes | Any | Get interviews |
| 8.2 | POST | `/api/interviews` | Yes | Recruiter/Admin | Schedule interview |
| 8.3 | PUT | `/api/interviews/:id` | Yes | Recruiter/Admin | Update interview |

---

### 8.1 Get Interviews

**As Recruiter** — returns interviews for their job applications:

```
Method:  GET
URL:     {{baseUrl}}/api/interviews
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{recruiterToken}}` |

**As Candidate** — returns interviews for their applications:

```
Method:  GET
URL:     {{baseUrl}}/api/interviews
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{candidateToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "interviews": [
    {
      "id": 1,
      "application_id": 1,
      "interviewer_id": 2,
      "date": "2025-07-25",
      "time": "10:00 AM",
      "location": "Google Meet",
      "type": "Video-Call",
      "status": "scheduled",
      "application": {
        "candidate": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "job": {
          "id": 1,
          "title": "React Developer"
        }
      },
      "interviewer": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@company.com"
      }
    }
  ]
}
```

---

### 8.2 Schedule Interview (Recruiter/Admin)

> **Prerequisite:** Application must exist and belong to a job owned by the recruiter.

```
Method:  POST
URL:     {{baseUrl}}/api/interviews
```

**Headers:**

| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer `{{recruiterToken}}` |

**Body (raw JSON):**

```json
{
  "application_id": 1,
  "date": "2025-07-25",
  "time": "10:00 AM",
  "location": "Google Meet",
  "type": "Video-Call"
}
```

**Validation Rules:**

| Field | Required | Rules |
|-------|----------|-------|
| `application_id` | Yes | Must be a valid integer |
| `date` | Yes | Must be ISO 8601 date format (`YYYY-MM-DD`) |
| `time` | Yes | Cannot be empty (e.g., `"10:00 AM"`) |
| `location` | Yes | Must be one of: `Google Meet`, `Zoom`, `Microsoft Teams`, `Office`, `Phone` |
| `type` | Yes | Must be one of: `In-Person`, `Video-Call`, `Voice-Call` |

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Interview scheduled",
  "interview": {
    "id": 1,
    "application_id": 1,
    "interviewer_id": 2,
    "date": "2025-07-25",
    "time": "10:00 AM",
    "location": "Google Meet",
    "type": "Video-Call",
    "status": "scheduled",
    "created_at": "2025-07-22T10:00:00.000Z",
    "updated_at": "2025-07-22T10:00:00.000Z"
  }
}
```

### 8.3 Update Interview (Recruiter/Admin)

```
Method:  PUT
URL:     {{baseUrl}}/api/interviews/{{interviewId}}
```

**Headers:**

| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer `{{recruiterToken}}` |

**Body (raw JSON) — send only fields to update:**

```json
{
  "date": "2025-07-28",
  "time": "2:00 PM",
  "status": "completed"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Interview updated",
  "interview": {
    "id": 1,
    "date": "2025-07-28",
    "time": "2:00 PM",
    "status": "completed",
    ...
  }
}
```

---

## 9. Resume Endpoints

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 9.1 | POST | `/api/resume/upload` | Yes | Candidate | Upload resume |
| 9.2 | GET | `/api/resume` | Yes | Candidate | Get resume URL |
| 9.3 | DELETE | `/api/resume` | Yes | Candidate | Delete resume |

---

### 9.1 Upload Resume (Candidate Only)

```
Method:  POST
URL:     {{baseUrl}}/api/resume/upload
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{candidateToken}}` |

**Body:** Select **`form-data`** in Thunder Client body tab

| Key | Type | Value |
|-----|------|-------|
| `resume` | File | Select a `.pdf`, `.doc`, or `.docx` file |

> **Important:** The key must be named `resume` (not `file` or anything else).

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Resume is uploaded successfully",
  "resume_url": "/uploads/resumes/resume-1-1721644800000.pdf"
}
```

### 9.2 Get Resume (Candidate Only)

```
Method:  GET
URL:     {{baseUrl}}/api/resume
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{candidateToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "resume_url": "/uploads/resumes/resume-1-1721644800000.pdf"
}
```

If no resume uploaded:
```json
{
  "success": true,
  "resume_url": null
}
```

---

### 9.3 Delete Resume (Candidate Only)

```
Method:  DELETE
URL:     {{baseUrl}}/api/resume
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{candidateToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Resume removed"
}
```

---

## 10. Admin Endpoints

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 10.1 | GET | `/api/admin/stats` | Yes | Admin | Dashboard statistics |
| 10.2 | GET | `/api/admin/recruiters` | Yes | Admin | List all recruiters |
| 10.3 | GET | `/api/admin/candidates` | Yes | Admin | List all candidates |

---

### 10.1 Get Dashboard Stats (Admin Only)

```
Method:  GET
URL:     {{baseUrl}}/api/admin/stats
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{adminToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "stats": {
    "totalUsers": 3,
    "totalRecruiters": 1,
    "totalCandidates": 1,
    "totalJobs": 1,
    "activeJobs": 1,
    "totalApplications": 1,
    "pendingRecruiters": 1
  }
}
```

---

### 10.2 Get All Recruiters (Admin Only)

```
Method:  GET
URL:     {{baseUrl}}/api/admin/recruiters
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{adminToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "recruiters": [
    {
      "id": 1,
      "user_id": 2,
      "company": "TechCorp Inc.",
      "status": "pending",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "created_at": "2025-07-22T10:00:00.000Z"
    }
  ]
}
```

### 10.3 Get All Candidates (Admin Only)

```
Method:  GET
URL:     {{baseUrl}}/api/admin/candidates
```

**Headers:**

| Key | Value |
|-----|-------|
| Authorization | Bearer `{{adminToken}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "candidate",
      "created_at": "2025-07-22T10:00:00.000Z",
      "status": "new",
      "role_applied": "React Developer"
    }
  ]
}