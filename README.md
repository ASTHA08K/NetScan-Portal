# NetScan Portal

## Web-Based Network Scanning & Vulnerability Assessment Platform

NetScan Portal is a full-stack cybersecurity project developed to simplify and centralize network scanning operations through an intuitive browser-based interface. The platform combines the power of Nmap with modern web technologies to provide automated host discovery, port scanning, service detection, vulnerability assessment, scan history management, and security reporting within a single dashboard.

Unlike traditional command-line scanning tools that require technical expertise and manual interpretation of results, NetScan Portal provides a structured and interactive environment where users can perform network reconnaissance, monitor scan activity, and analyze vulnerabilities without dealing with complex terminal commands.

The project was developed as a final-year B.Tech major project with the objective of making professional-grade network analysis more accessible, organized, and manageable for students, administrators, and security analysts.

---

# Features

### Network Scanning
- Host discovery and port scanning using Nmap
- Detection of open, closed, and filtered ports
- Service and version detection using Nmap `-sV`
- Multiple scan modes and configurable scan speeds

### Vulnerability Assessment
- CVE mapping for detected services
- Severity classification:
  - Critical
  - High
  - Medium
  - Low
- CVSS-based vulnerability scoring

### Dashboard & Monitoring
- Real-time scan progress updates
- Interactive dashboard with statistics and analytics
- Vulnerability visualization using Chart.js
- Recent scan tracking and activity overview

### Authentication & Security
- JWT-based authentication system
- Protected routes and session handling
- Password hashing using bcryptjs
- Secure environment variable management using dotenv

### Database & Reporting
- PostgreSQL-based persistent storage
- Historical scan logging
- Security report management
- Scan result archival and retrieval

---

# Problem Statement

Traditional network scanning tools such as Nmap and Masscan are extremely powerful but heavily dependent on command-line interaction. These tools often require advanced knowledge of flags, scripting, and manual result interpretation, making them difficult for beginners and inconvenient for collaborative environments.

There is a need for a centralized and user-friendly platform that:
- simplifies network scanning,
- stores results persistently,
- visualizes vulnerabilities clearly,
- and reduces dependence on terminal-based workflows.

NetScan Portal addresses this gap by integrating scanning, vulnerability analysis, reporting, and visualization into a single web-based platform.

---

# Objectives

- Develop a browser-based network scanning platform
- Automate host discovery and port scanning
- Detect services and versions running on target systems
- Store scan results and vulnerabilities in PostgreSQL
- Provide graphical dashboards for analysis
- Implement secure authentication and access control
- Create a modular and extensible cybersecurity platform

---

# Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL

## Security & Authentication
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

## Networking & Scanning
- Nmap
- child_process (Node.js)

## Visualization
- Chart.js

---

# System Architecture

```text
User
  ↓
Frontend Interface (HTML/CSS/JS)
  ↓
Express.js REST API
  ↓
Node.js Backend
  ↓
Nmap Scan Engine
  ↓
PostgreSQL Database
  ↓
Dashboard & Reports
```

---

# Project Modules

## Authentication Module
Handles secure login functionality using JWT authentication and bcrypt password hashing.

## Scan Engine Module
Executes Nmap scans through Node.js and parses scan results into structured data.

## Dashboard Module
Displays scan statistics, vulnerability summaries, and charts for monitoring and analysis.

## Database Module
Stores scan records, port information, and CVE findings using PostgreSQL.

## Report Management Module
Provides functionality for organizing and managing generated security reports.

---

# Database Design

## scans
Stores overall scan information.

| Field | Description |
|---|---|
| id | Primary key |
| target | Target IP |
| scan_date | Timestamp |
| total_ports | Total discovered ports |
| vulnerabilities_found | Vulnerability count |

---

## port_results
Stores detailed port-level findings.

| Field | Description |
|---|---|
| id | Primary key |
| scan_id | Linked scan |
| port | Port number |
| service | Service name |
| version | Service version |
| state | Port state |

---

## cve_findings
Stores vulnerability information.

| Field | Description |
|---|---|
| id | Primary key |
| port_result_id | Linked port result |
| cve_id | CVE identifier |
| severity | Vulnerability severity |
| score | CVSS score |
| description | Vulnerability details |

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/netscan_portal.git
```

---

## Navigate to Project Directory

```bash
cd netscan_portal
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file:

```env
PORT=3000

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=netscan

JWT_SECRET=your_secret_key
```

---

## Start PostgreSQL

Make sure PostgreSQL is running before starting the server.

---

## Run Application

```bash
node server.js
```

---

# User Flow

1. User logs into the portal
2. JWT token is generated and stored
3. User initiates a network scan
4. Backend invokes Nmap scan engine
5. Results are parsed and stored in PostgreSQL
6. Dashboard displays scan statistics and vulnerabilities
7. Reports and historical scans remain accessible for future analysis

---

# Security Features

- JWT-based authentication
- Password hashing using bcryptjs
- Protected API endpoints
- Regex-based input validation
- Environment variable protection using dotenv
- Sanitized scan targets to reduce command injection risks

---

# Current Limitations

- Real-time CVE API integration is not implemented yet
- Multi-user role management is not available
- OS fingerprinting is currently limited
- Requires Nmap installation on the host machine
- Scan accuracy may vary depending on firewall restrictions

---

# Future Enhancements

- Real-time NVD CVE API integration
- AI-based threat analysis
- Email alert notifications
- Scheduled and automated scans
- Multi-user role-based access control
- PDF export for reports
- Docker deployment support
- SIEM integration support
- Network topology visualization

---

# Learning Outcomes

This project helped in understanding:

- Full-stack web development
- REST API development
- Database design and management
- JWT authentication
- Cybersecurity fundamentals
- Network scanning concepts
- Vulnerability assessment workflows
- Real-world system architecture design

---

# Applications

NetScan Portal can be used for:
- Educational cybersecurity labs
- Internal vulnerability assessments
- Network monitoring
- Security auditing
- Cybersecurity training and demonstrations
- Academic research projects

---

# Author

### Astha Kumari
Final Year B.Tech Student  

---

# License

This project is developed for educational and research purposes only.