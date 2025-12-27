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
│   ├── businessDetailsPageValidation/
│   │   ├── businessDetailsPageValidation.test.js # Business details page content validation
│   │   └── testData.json
│   ├── loginThenContactBusiness/
│   │   ├── loginThenContactBusiness.test.js # Login then contact business via form
│   │   └── testData.json
│   ├── addBusiness/
│   │   ├── addBusiness.test.js   # Add business form validation
│   │   └── testData.json
│   ├── login/
│   │   ├── login.test.js         # Original login test (deprecated)
│   │   └── testData.json
│   ├── validEmailLogin/
│   │   ├── validEmailLogin.test.js  # Valid email login functionality
│   │   └── testData.json
│   ├── invalidEmailLogin/
│   │   ├── invalidEmailLogin.test.js  # Invalid email login scenarios
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
│   ├── activateUser/
│   │   ├── activateUser.test.js  # User account activation via email verification
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
│   └── logoTest/
│       ├── logoTest.test.js      # Logo loading validation
│       └── testData.json
│   └── searchFormTest/
│       ├── searchFormTest.test.js # Search form loading validation
│       └── testData.json
│   └── addBusinessFormTest/
│       ├── addBusinessFormTest.test.js # Add business form loading validation
│       └── testData.json
│   └── pageNotFoundTest/
│       ├── pageNotFoundTest.test.js # 404 page error handling validation
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
│       ├── businessDetailsPageValidation/ # Business details page validation screenshots
│       ├── loginThenContactBusiness/     # Login then contact business screenshots
│       ├── addBusiness/          # Add business test screenshots
│       ├── login/                # Original login test screenshots
│       ├── validEmailLogin/      # Valid email login test screenshots
│       ├── invalidEmailLogin/    # Invalid email login test screenshots
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
│       └── pageNotFoundTest/     # Page not found test screenshots
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
npm run test:businessDetailsPageValidation # Business details page content validation
npm run test:loginThenContactBusiness     # Login then contact business via form
npm run test:addBusiness       # Add business form submission
npm run test:addBusinessFormTest # Add business form loading validation
npm run test:searchFormTest    # Search form loading validation
npm run test:search            # Search functionality validation

# Authentication tests
npm run test:validEmailLogin      # Valid email login functionality
npm run test:invalidEmailLogin    # Invalid email login scenarios
npm run test:logout            # User logout functionality
npm run test:loginThenAddBusiness  # Combined login and add business test
npm run test:loginThenCheckBusiness  # Login and check claimed business test
npm run test:register          # User registration functionality
npm run test:activateUser      # User account activation via email verification
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
npm run test:logoTest          # Logo loading validation
npm run test:pageNotFoundTest   # 404 page error handling validation
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
4. Business Details Page Validation Test
5. Login Then Contact Business Test
6. Add Business Test
7. Valid Email Login Test
8. Invalid Email Login Test
9. Logout Test
10. Register Test
11. Password Reset Test
12. Header Test
13. Footer Test
14. Footer Links Test
15. About Page Test
16. Categories Page Load Test
17. Categories Content Test
18. Category Navigation Test
19. Search Test
20. Page Not Found Test

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

### Business Details Page Validation Test (`test:businessDetailsPageValidation`)

- **Purpose**: Validates that all elements on the business details page load perfectly after clicking on a business listing from the home page
- **URL**: `https://ethiofind.com/` (starts on home page, then navigates to business details)
- **Test Cases**:
  - Home page loads with business listings displayed
  - Clicking on first business listing navigates to details page
  - Main content container loads with proper structure
  - Business title displays correctly
  - Breadcrumb navigation is present
  - Business details (City, Email, Phone, Address) are displayed
  - Products and Services section with tags loads properly
  - Website link is functional
  - Business description is present
  - Claim business link is available
  - Business logo image loads successfully
  - Contact form with all required fields (subject, message, submit) is present
  - Similar businesses section displays recommended businesses
  - All page elements are visible and properly formatted
- **Expected Results**: Complete business details page loads with all content elements properly displayed and functional after navigation from home page

### Login Then Contact Business Test (`test:loginThenContactBusiness`)

- **Purpose**: Validates the complete user journey of logging in and contacting a business through their details page form
- **URL**: `https://ethiofind.com/user/login` (starts with login, then navigates to home and business details)
- **Test Cases**:
  - User successfully logs in with valid credentials
  - Home page loads with business listings after authentication
  - Clicking on business listing navigates to details page
  - Contact form is present on business details page
  - Subject field accepts input and is filled correctly
  - Message field accepts input and is filled with inquiry text
  - Contact form submits successfully
  - Success or error messages are displayed appropriately
  - Form submission works for authenticated users
- **Expected Results**: Authenticated user can successfully submit business inquiries through the contact form on business details pages

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

### Valid Email Login Test (`test:validEmailLogin`)

- **Purpose**: Validates successful user login with valid email credentials
- **URL**: `https://ethiofind.com/user/login`
- **Test Cases**:
  - Login page loads correctly with form elements
  - Fill valid email and password credentials
  - Submit login form successfully
  - Verify successful login indicators (dashboard, logout button, user menu)
  - Check for proper redirection after login
  - Ensure no error messages are displayed
- **Expected Results**: Successful authentication, proper redirection, and user dashboard access

### Invalid Email Login Test (`test:invalidEmailLogin`)

- **Purpose**: Validates error handling for invalid login attempts with various invalid credentials
- **URL**: `https://ethiofind.com/user/login`
- **Test Cases**:
  - Test invalid email/password combinations
  - Test non-existent email addresses
  - Test empty email fields
  - Test invalid email format
  - Verify appropriate error messages are displayed
  - Ensure user remains on login page (no successful authentication)
  - Check error message visibility and content
- **Expected Results**: Proper error handling, appropriate error messages, and prevention of unauthorized access

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

### Logo Test (`test:logoTest`)

- **Purpose**: Validates that the Ethiofind logo image loads properly on the homepage
- **URL**: `https://ethiofind.com` (homepage)
- **Test Cases**:
  - Homepage loads successfully
  - Logo image element exists in the DOM
  - Logo image is visible and displayed
  - Logo image source URL is correct
  - Logo image loads without errors (not broken)
  - Check for any page errors that might affect logo loading
- **Expected Results**: Logo image loads successfully, is visible, and displays without errors

### Search Form Test (`test:searchFormTest`)

- **Purpose**: Validates that the search form loads properly on the homepage with all required elements
- **URL**: `https://ethiofind.com` (homepage)
- **Test Cases**:
  - Homepage loads successfully
  - Search form element exists in the DOM
  - Search input field exists, is visible, and enabled
  - Search submit button exists
  - Form elements have proper attributes (type, name, placeholder)
  - Input field accepts text input
  - Check for any page errors that might affect search form functionality
- **Expected Results**: Search form loads completely with functional input field and submit button

### Add Business Form Test (`test:addBusinessFormTest`)

- **Purpose**: Validates that the add business form loads properly on the homepage with all required form elements
- **URL**: `https://ethiofind.com` (homepage)
- **Test Cases**:
  - Homepage loads successfully
  - Scrolls to "Add Your Business Free" section
  - Business name input field exists, is visible, and enabled
  - Phone input field exists, is visible, and enabled
  - City selection field exists
  - Email input field exists, is visible, and enabled
  - Business category selection field exists
  - Submit button ("Add this Business") exists, is visible, and enabled
  - Form elements accept input (interaction test)
  - Check for any page errors that might affect add business form functionality
- **Expected Results**: Add business form loads completely with all functional form elements

### Page Not Found Test (`test:pageNotFoundTest`)

- **Purpose**: Validates that accessing non-existent pages properly displays a 404 error page with appropriate content and navigation options
- **URL**: `https://ethiofind.com/nonexistent-page` (invalid URL)
- **Test Cases**:
  - Attempt to access a non-existent page URL
  - Verify page loads without critical errors
  - Check for error page content indicators (404, "Page Not Found", etc.)
  - Look for error page styling or specific error elements
  - Verify navigation options are present (home link, back button, etc.)
  - Check that error page itself doesn't have additional errors
  - Validate URL handling and potential redirects
- **Expected Results**: Proper 404 error page display with clear error messaging, appropriate styling, and navigation options for user recovery

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

### Run the Activate User Test

To run the activate user test that registers a new user and verifies account activation via email link:

```
npm run test:activateUser
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
