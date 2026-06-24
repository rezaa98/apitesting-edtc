# Reqres API Automation Testing (E2E)

This project contains automated End-to-End (E2E) API testing for the [Reqres.in](https://reqres.in/) Master Data Users module. 
The test suite is built using **Node.js**, **Mocha**, **Chai**, and **TypeScript**, with native integration for automated PDF reporting and Continuous Integration (CI/CD) using GitHub Actions.

## 🛠 Tech Stack
- **Language**: TypeScript (Node.js)
- **Testing Framework**: Mocha
- **Assertion Library**: Chai
- **HTTP Client**: Axios
- **Reporting**: Native Mocha JSON Reporter + Custom Script to generate Landscape PDF

## 📝 Test Scenarios

The test suite covers Positive, Negative, and Edge case scenarios for the following endpoints:
1. `POST /api/users` (Create a new User)
2. `GET /api/users?page=2` (Get All User Paged)
3. `PUT /api/users/2` (Update User)
4. `GET /api/users/2` (View Detail Single User)
5. `DELETE /api/users/2` (Delete User)

*Detailed test scenarios can be found in `Test-Scenarios.md`.*

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18.x or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rezaa98/apitesting-edtc.git
   cd apitesting-edtc/API\ Testing
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```

### Configuration
You must provide a valid API Key to authenticate requests with Reqres.
1. Create a `.env.local` file inside the `API Testing` folder.
2. Add your API key:
   ```env
   REQRES_API_KEY=free_user_YOUR_API_KEY_HERE
   ```

### Execution
Run the test suite and automatically generate the Markdown & PDF report:
```bash
npm run test
```

To manually generate the PDF report from existing test results:
```bash
node generate-report.js
npx -y markdown-pdf -s report-style.css --paper-format A4 Test-Results.md
```

The execution will output a `Test-Results.pdf` file containing a neat, tabular report with the actual test outcomes.

## ⚙️ CI/CD Pipeline (GitHub Actions)

This project uses **GitHub Actions** to automate the testing workflow. 
The pipeline configuration can be found in `.github/workflows/api-tests.yml`.

### Workflow Triggers
- Pushing to the `main` or `master` branch.
- Creating a Pull Request to `main` or `master`.

### Pipeline Steps:
1. **Setup**: Checks out the code and sets up Node.js v18.
2. **Install**: Runs `npm ci` to install exact dependency versions.
3. **Test**: Executes `npm run test`. *(Requires `REQRES_API_KEY` to be configured in GitHub Repository Secrets).*
4. **Report**: Automatically generates the `Test-Results.pdf` using our custom script.
5. **Artifact**: Uploads the generated PDF as a downloadable Build Artifact.

### Important: GitHub Secrets
For the CI pipeline to run successfully, you must add your API Key to the repository secrets:
- Navigate to **Settings > Secrets and variables > Actions**
- Click **New repository secret**
- Name: `REQRES_API_KEY`
- Secret: `<Your Reqres API Key>`
