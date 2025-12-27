# Ethiofind Comprehensive Test Suite

This project contains a comprehensive automated Selenium test suite for the Ethiofind website (https://ethiofind.com/). The tests validate various functionalities including page loading, business operations, user authentication, UI components, and more.

## Features

- **Comprehensive Testing**: Covers page load, business operations, authentication, UI components, and search functionality
- **Automated Testing**: Uses Selenium WebDriver for browser automation
- **Error Detection**: Detects alerts, error messages, validation issues, and API errors
- **Screenshot Capture**: Automatic screenshots on test failures for debugging
- **Modular Architecture**: Organized into pages (page objects) and utils (utilities)
- **Detailed Logging**: Comprehensive console logging for each test step
- **Sequential Execution**: Tests run in logical order via test runner

## Prerequisites

- Node.js (version 14 or higher)
- Chrome browser installed
- Internet connection (tests run against the live Ethiofind website)

## Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```
   cd /path/to/ethiofind
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Project Structure

```
ethiofind/
├── package.json
├── server.js                 # Main test runner (executes all tests sequentially)
├── tests/
│   ├── pageLoad/
│   │   ├── pageLoad.test.js      # Page load performance and validation
│   │   └── testData.json
│   ├── businessListing/
│   │   ├── businessListing.test.js  # Business listings API validation
│   │   └── testData.json
│   ├── businessDetailsNavigation/
│   │   ├── businessDetailsNavigation.test.js  # Business details navigation
│   │   └── testData.json
│   ├── addBusiness/
│   │   ├── addBusiness.test.js   # Add business form validation
│   │   └── testData.json
│   ├── login/
│   │   ├── login.test.js         # User login functionality
│   │   └── testData.json
│   ├── logout/
│   │   ├── logout.test.js        # User logout functionality
│   │   └── testData.json
│   ├── loginThenAddBusiness/
│   │   ├── loginThenAddBusiness.test.js  # Combined login and add business test
│   │   └── testData.json
│   ├── loginThenCheckBusiness/
│   │   ├── loginThenCheckBusiness.test.js  # Login and check claimed business test
│   │   └── testData.json
│   ├── register/
│   │   ├── register.test.js      # User registration functionality
│   │   └── testData.json
│   ├── passwordReset/
│   │   ├── passwordReset.test.js # Password reset functionality
│   │   └── testData.json
│   ├── header/
│   │   ├── header.test.js        # Header component validation
│   │   └── testData.json
│   ├── footer/
│   │   ├── footer.test.js        # Footer component validation
│   │   ├── footerlinks.test.js   # Footer links functionality
│   │   └── testData.json
│   ├── about/
│   │   ├── about.test.js         # About page validation
│   │   └── testData.json
│   ├── categories/
│   │   ├── categories.test.js    # Categories API content validation
│   │   └── testData.json
│   ├── categoriesPageLoad/
│   │   ├── categoriesPageLoad.test.js  # Categories page load performance
│   │   └── testData.json
│   ├── categoryNavigation/
│   │   ├── categoryNavigation.test.js  # Category navigation functionality
│   │   └── testData.json
│   └── search/
│       ├── search.test.js        # Search functionality validation
│       └── testData.json
├── pages/
│   ├── PageLoadPage.js           # Page load testing utilities
│   ├── BusinessListingPage.js    # Business listing interactions
│   ├── BusinessDetailsNavigationPage.js  # Business details navigation
│   ├── AddBusinessPage.js        # Add business form interactions
│   ├── LoginPage.js              # Login page interactions
│   ├── RegisterPage.js           # Registration page interactions
│   ├── PasswordResetPage.js      # Password reset page interactions
│   ├── HeaderPage.js             # Header component interactions
│   ├── FooterPage.js             # Footer component interactions
│   ├── AboutPage.js              # About page interactions
│   ├── CategoriesPage.js         # Categories page interactions
│   ├── CategoryNavigationPage.js # Category navigation interactions
│   └── SearchPage.js             # Search functionality interactions
├── utils/
│   ├── driver.js                 # WebDriver creation and management
│   ├── wait.js                   # Wait utilities and delays
│   ├── testData.js               # Test data loading utilities
│   ├── logger.js                 # Logging utilities (PASS/FAIL/WARN)
│   ├── screenshot.js             # Screenshot capture on failures
│   └── errors.js                 # Error detection and handling
├── reports/
│   └── screenshots/              # Automatic screenshot storage
│       ├── pageLoad/             # Page load test screenshots
│       ├── businessListing/      # Business listing test screenshots
│       ├── businessDetailsNavigation/  # Business details navigation screenshots
│       ├── addBusiness/          # Add business test screenshots
│       ├── login/                # Login test screenshots
│       ├── logout/              # Logout test screenshots
│       ├── register/             # Register test screenshots
│       ├── passwordReset/        # Password reset test screenshots
│       ├── header/               # Header test screenshots
│       ├── footer/               # Footer test screenshots
│       ├── footerlinks/          # Footer links test screenshots
│       ├── about/                # About page test screenshots
│       ├── categories/           # Categories test screenshots
│       ├── categoriesPageLoad/   # Categories page load test screenshots
│       ├── categoryNavigation/   # Category navigation test screenshots
│       └── search/               # Search test screenshots
└── README.md                     # This documentation
```

## Available Tests

### Individual Test Commands

Run specific tests using these npm commands:

```bash
# Core functionality tests
npm run test:pageLoad          # Page load performance and validation
npm run test:businessListing   # Business listings API validation
npm run test:businessDetailsNavigation  # Business details navigation
npm run test:addBusiness       # Add business form submission
npm run test:search            # Search functionality validation

# Authentication tests
npm run test:login             # User login functionality
npm run test:logout            # User logout functionality
npm run test:loginThenAddBusiness  # Combined login and add business test
npm run test:loginThenCheckBusiness  # Login and check claimed business test
npm run test:register          # User registration functionality
npm run test:passwordReset     # Password reset functionality

# UI component tests
npm run test:header            # Header component validation
npm run test:footer            # Footer component validation
npm run test:footerlinks       # Footer links functionality testing

# Content page tests
npm run test:about             # About page validation
npm run test:categories        # Categories API content validation
npm run test:categoriesPageLoad # Categories page load performance
npm run test:categoryNavigation # Category navigation functionality
```

### Run Complete Test Suite

To run all tests sequentially via the main test runner:

```bash
npm test
```

This executes tests in the following order:

1. Page Load Test
2. Business Listing Test
3. Business Details Navigation Test
4. Add Business Test
5. Login Test
6. Logout Test
7. Register Test
8. Password Reset Test
9. Header Test
10. Footer Test
11. Footer Links Test
12. About Page Test
13. Categories Page Load Test
14. Categories Content Test
15. Category Navigation Test
16. Search Test

## Test Descriptions

### Business Details Navigation Test (`test:businessDetailsNavigation`)

- **Purpose**: Validates that clicking on business listings redirects to their details pages
- **URL**: `https://ethiofind.com/` (home page)
- **Test Cases**:
  - Home page loads with business listings displayed
  - Clicking on first business listing navigates to details page
  - Business details page contains proper content (title, description)
  - URL pattern validation for business details pages
  - Browser back navigation returns to home page
- **Expected Results**: Successful navigation, content validation, and return navigation

### Category Navigation Test (`test:categoryNavigation`)

- **Purpose**: Validates that clicking on categories redirects to category-specific pages
- **URL**: `https://ethiofind.com/categories`
- **Test Cases**:
  - Categories page loads with category listings displayed
  - Clicking on first category navigates to category page
  - Category page contains proper content (title, businesses, filters)
  - URL pattern validation for category pages
  - Browser back navigation returns to categories page
- **Expected Results**: Successful navigation, content validation, and return navigation

### Password Reset Test (`test:passwordReset`)

- **Purpose**: Validates password reset functionality
- **URL**: `https://ethiofind.com/user/password/request`
- **Test Cases**:
  - Page loads correctly with proper form elements
  - Email validation (invalid format, empty field)
  - Error handling for non-existent emails
  - Success response handling
  - "Sign In" link navigation
- **Expected Results**: Proper validation, error messages, and navigation

### Logout Test (`test:logout`)

- **Purpose**: Validates user logout functionality after successful login
- **URL**: `https://ethiofind.com/user/login` (starts with login)
- **Test Cases**:
  - Login with valid credentials
  - Click logout button in header after login
  - Verify logout redirects to login or home page
- **Expected Results**: Successful login, logout button click, and proper redirection

### Login Then Add Business Test (`test:loginThenAddBusiness`)

- **Purpose**: Validates combined login and add business functionality
- **URL**: `https://ethiofind.com/user/login` (starts with login)
- **Test Cases**:
  - Login with valid credentials
  - Navigate to home page after login
  - Scroll to and access add business section
  - Fill business form (name, phone, city, email, category)
  - Submit business addition form
  - Handle business claim limitations (user can only claim one business)
- **Expected Results**: Successful login, form filling, submission, and proper error handling for business claim restrictions

### Login Then Check Business Test (`test:loginThenCheckBusiness`)

- **Purpose**: Validates login and checks if user has claimed a business on the edit page
- **URL**: `https://ethiofind.com/user/login` (starts with login, then navigates to business edit)
- **Test Cases**:
  - Login with valid credentials
  - Navigate to business edit info page (`/business/edit-info`)
  - Check for presence of business information fields
  - Check for "no business claimed" messages
  - Verify page loads without errors
- **Expected Results**: Successful login, page navigation, and clear determination of business claim status with appropriate screenshots

### Other Key Tests

- **Page Load**: Performance metrics, content validation
- **Business Operations**: Form submission, API responses, error handling
- **Authentication**: Login, registration, password reset flows
- **UI Components**: Header/footer loading and functionality
- **Search**: Form validation, result handling, error cases

## Test Output Examples

Successful test execution shows:

```
🚀 Starting Password Reset Test...
✅ PASS: Test data loaded from JSON
✅ PASS: Password reset page opened
📄 Page Title: EthioFind - Your Ethiopian Business Directory
🔗 Current URL: https://ethiofind.com/user/password/request
✅ PASS: Form title is correct
✅ PASS: Invalid email format validation works
❌ Error Message: Invalid email address. This account does not exist
✅ PASS: Correct error message displayed for non-existent email
🎉 Password reset test completed successfully
```

Failed tests show:

```
❌ FAIL: Error message found: Invalid email address. This account does not exist
📸 Screenshot saved: /path/to/screenshot.png
```

## Configuring Test Data

Each test has its own `testData.json` file. Example for password reset:

```json
{
  "url": "https://ethiofind.com/user/password/request",
  "testEmails": {
    "validExisting": "test@example.com",
    "invalidFormat": "invalid-email",
    "nonExistent": "nonexistent@example.com",
    "empty": ""
  },
  "expectedMessages": {
    "invalidEmail": "Invalid email address. This account does not exist",
    "successMessage": "If your email address exists...",
    "validationError": "Please fill out this field"
  }
}
```

## Screenshots and Debugging

- **Automatic Capture**: Screenshots saved on test failures
- **Organized Storage**: `reports/screenshots/[testName]/` directories
- **Error Logging**: Detailed console output for debugging
- **Timestamped Files**: Screenshots include timestamps for uniqueness

## Troubleshooting

- **Chrome Not Found**: Ensure Chrome browser is installed
- **Network Issues**: Check internet connection for live site testing
- **Permissions**: Ensure write permissions for screenshot directories
- **Node Version**: Use Node.js 14+ for compatibility
- **Test Failures**: Check screenshots in `reports/screenshots/` for visual debugging

## Dependencies

- `selenium-webdriver`: Browser automation framework
- `chromedriver`: Chrome WebDriver for Selenium
- Custom utilities for logging, screenshots, and error handling

## Test Maintenance

- **Page Objects**: Update page classes in `pages/` for UI changes
- **Test Data**: Modify JSON files in test directories for different scenarios
- **Assertions**: Update expected results in test files as needed
- **New Tests**: Follow the established pattern for adding new test cases

## License

For testing and quality assurance purposes only.

```
npm run test:login
```

### Run the Register Test

To run the register test that checks the registration functionality:

```
npm run test:register
```

### Run the Header Test

To run the header test that checks if the header loads successfully:

```
npm run test:header
```

### Run the Footer Test

To run the footer test that checks if the footer loads successfully:

```
npm run test:footer
```

### Run the Search Test

To run the search test that checks the search functionality:

```
npm run test:search
```

### Run All Tests

To run all tests (page load and add business) via the test runner:

```
npm test
```

This starts the test suite that executes both the page load test and the add business test sequentially.

## Test Output

The console will display logs like:

- 🚀 Starting Add Business Test...
- ✅ PASS: Test data loaded from JSON
- ✅ PASS: Website opened and maximized
- ... and so on, with ❌ FAIL for errors and 📸 for screenshots.

## Configuring Test Data

Edit `tests/testData.json` to change the test inputs:

```json
{
  "url": "https://ethiofind.com/user/password/request",
  "testEmails": {
    "validExisting": "test@example.com",
    "invalidFormat": "invalid-email",
    "nonExistent": "nonexistent@example.com",
    "empty": ""
  },
  "expectedMessages": {
    "invalidEmail": "Invalid email address. This account does not exist",
    "successMessage": "If your email address exists in our database...",
    "validationError": "Please fill out this field"
  }
}
```

## Screenshots and Debugging

- **Automatic Capture**: Screenshots saved on test failures
- **Organized Storage**: `reports/screenshots/[testName]/` directories
- **Error Logging**: Detailed console output for debugging
- **Timestamped Files**: Screenshots include timestamps for uniqueness

## Troubleshooting

- **Chrome Not Found**: Ensure Chrome browser is installed
- **Network Issues**: Check internet connection for live site testing
- **Permissions**: Ensure write permissions for screenshot directories
- **Node Version**: Use Node.js 14+ for compatibility
- **Test Failures**: Check screenshots in `reports/screenshots/` for visual debugging

## Dependencies

- `selenium-webdriver`: Browser automation framework
- `chromedriver`: Chrome WebDriver for Selenium
- Custom utilities for logging, screenshots, and error handling

## Test Maintenance

- **Page Objects**: Update page classes in `pages/` for UI changes
- **Test Data**: Modify JSON files in test directories for different scenarios
- **Assertions**: Update expected results in test files as needed
- **New Tests**: Follow the established pattern for adding new test cases

## License

For testing and quality assurance purposes only.
