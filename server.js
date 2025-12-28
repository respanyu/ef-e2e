#!/usr/bin/env node

/**
 * Ethiofind Test Runner
 * Runs all automated tests for the Ethiofind project
 */

const { exec } = require("child_process");
const path = require("path");

console.log("🚀 Starting Ethiofind Test Suite...\n");

// Run the page load test first
const pageLoadTestPath = path.join(
  __dirname,
  "tests",
  "pageLoad",
  "pageLoad.test.js"
);

exec(`node ${pageLoadTestPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Page Load Test failed: ${error.message}`);
    process.exit(1);
  }

  if (stderr) {
    console.error(`❌ Page Load Test stderr: ${stderr}`);
    process.exit(1);
  }

  console.log(stdout);

  // Run the business listing test
  const businessListingTestPath = path.join(
    __dirname,
    "tests",
    "businessListing",
    "businessListing.test.js"
  );

  exec(`node ${businessListingTestPath}`, (error1_5, stdout1_5, stderr1_5) => {
    if (error1_5) {
      console.error(`❌ Business Listing Test failed: ${error1_5.message}`);
      process.exit(1);
    }

    if (stderr1_5) {
      console.error(`❌ Business Listing Test stderr: ${stderr1_5}`);
      process.exit(1);
    }

    console.log(stdout1_5);

    // Run the business details navigation test
    const businessDetailsNavigationTestPath = path.join(
      __dirname,
      "tests",
      "businessDetailsNavigation",
      "businessDetailsNavigation.test.js"
    );

    exec(
      `node ${businessDetailsNavigationTestPath}`,
      (error1_6, stdout1_6, stderr1_6) => {
        if (error1_6) {
          console.error(
            `❌ Business Details Navigation Test failed: ${error1_6.message}`
          );
          process.exit(1);
        }

        if (stderr1_6) {
          console.error(
            `❌ Business Details Navigation Test stderr: ${stderr1_6}`
          );
          process.exit(1);
        }

        console.log(stdout1_6);

        // Run the business details page validation test
        const businessDetailsPageValidationTestPath = path.join(
          __dirname,
          "tests",
          "businessDetailsPageValidation",
          "businessDetailsPageValidation.test.js"
        );

        exec(
          `node ${businessDetailsPageValidationTestPath}`,
          (error1_7, stdout1_7, stderr1_7) => {
            if (error1_7) {
              console.error(
                `❌ Business Details Page Validation Test failed: ${error1_7.message}`
              );
              process.exit(1);
            }

            if (stderr1_7) {
              console.error(
                `❌ Business Details Page Validation Test stderr: ${stderr1_7}`
              );
              process.exit(1);
            }

            console.log(stdout1_7);

            // Run the login then contact business test
            const loginThenContactBusinessTestPath = path.join(
              __dirname,
              "tests",
              "loginThenContactBusiness",
              "loginThenContactBusiness.test.js"
            );

            exec(
              `node ${loginThenContactBusinessTestPath}`,
              (error1_8, stdout1_8, stderr1_8) => {
                if (error1_8) {
                  console.error(
                    `❌ Login Then Contact Business Test failed: ${error1_8.message}`
                  );
                  process.exit(1);
                }

                if (stderr1_8) {
                  console.error(
                    `❌ Login Then Contact Business Test stderr: ${stderr1_8}`
                  );
                  process.exit(1);
                }

                console.log(stdout1_8);

                // Run the search restaurant test
                const searchRestaurantTestPath = path.join(
                  __dirname,
                  "tests",
                  "searchRestaurant",
                  "searchRestaurant.test.js"
                );

                exec(
                  `node ${searchRestaurantTestPath}`,
                  (error1_9, stdout1_9, stderr1_9) => {
                    if (error1_9) {
                      console.error(
                        `❌ Search Restaurant Test failed: ${error1_9.message}`
                      );
                      process.exit(1);
                    }

                    if (stderr1_9) {
                      console.error(
                        `❌ Search Restaurant Test stderr: ${stderr1_9}`
                      );
                      process.exit(1);
                    }

                    console.log(stdout1_9);

                    // Run the login then search restaurant contact test
                    const loginThenSearchRestaurantContactTestPath = path.join(
                      __dirname,
                      "tests",
                      "loginThenSearchRestaurantContact",
                      "loginThenSearchRestaurantContact.test.js"
                    );

                    exec(
                      `node ${loginThenSearchRestaurantContactTestPath}`,
                      (error1_10, stdout1_10, stderr1_10) => {
                        if (error1_10) {
                          console.error(
                            `❌ Login Then Search Restaurant Contact Test failed: ${error1_10.message}`
                          );
                          process.exit(1);
                        }

                        if (stderr1_10) {
                          console.error(
                            `❌ Login Then Search Restaurant Contact Test stderr: ${stderr1_10}`
                          );
                          process.exit(1);
                        }

                        console.log(stdout1_10);

                        // Run the add business test
                        const addBusinessTestPath = path.join(
                          __dirname,
                          "tests",
                          "addBusiness",
                          "addBusiness.test.js"
                        );

                        exec(
                          `node ${addBusinessTestPath}`,
                          (error2, stdout2, stderr2) => {
                            if (error2) {
                              console.error(
                                `❌ Add Business Test failed: ${error2.message}`
                              );
                              process.exit(1);
                            }

                            if (stderr2) {
                              console.error(
                                `❌ Add Business Test stderr: ${stderr2}`
                              );
                              process.exit(1);
                            }

                            console.log(stdout2);

                            // Run the valid email login test
                            const validEmailLoginTestPath = path.join(
                              __dirname,
                              "tests",
                              "validEmailLogin",
                              "validEmailLogin.test.js"
                            );

                            exec(
                              `node ${validEmailLoginTestPath}`,
                              (error3, stdout3, stderr3) => {
                                if (error3) {
                                  console.error(
                                    `❌ Valid Email Login Test failed: ${error3.message}`
                                  );
                                  process.exit(1);
                                }

                                if (stderr3) {
                                  console.error(
                                    `❌ Valid Email Login Test stderr: ${stderr3}`
                                  );
                                  process.exit(1);
                                }

                                console.log(stdout3);

                                // Run the invalid email login test
                                const invalidEmailLoginTestPath = path.join(
                                  __dirname,
                                  "tests",
                                  "invalidEmailLogin",
                                  "invalidEmailLogin.test.js"
                                );

                                exec(
                                  `node ${invalidEmailLoginTestPath}`,
                                  (error3_25, stdout3_25, stderr3_25) => {
                                    if (error3_25) {
                                      console.error(
                                        `❌ Invalid Email Login Test failed: ${error3_25.message}`
                                      );
                                      process.exit(1);
                                    }

                                    if (stderr3_25) {
                                      console.error(
                                        `❌ Invalid Email Login Test stderr: ${stderr3_25}`
                                      );
                                      process.exit(1);
                                    }

                                    console.log(stdout3_25);

                                    // Run the logout test
                                    const logoutTestPath = path.join(
                                      __dirname,
                                      "tests",
                                      "logout",
                                      "logout.test.js"
                                    );

                                    exec(
                                      `node ${logoutTestPath}`,
                                      (error3_5, stdout3_5, stderr3_5) => {
                                        if (error3_5) {
                                          console.error(
                                            `❌ Logout Test failed: ${error3_5.message}`
                                          );
                                          process.exit(1);
                                        }

                                        if (stderr3_5) {
                                          console.error(
                                            `❌ Logout Test stderr: ${stderr3_5}`
                                          );
                                          process.exit(1);
                                        }

                                        console.log(stdout3_5);

                                        // Run the login then add business test
                                        const loginThenAddBusinessTestPath =
                                          path.join(
                                            __dirname,
                                            "tests",
                                            "loginThenAddBusiness",
                                            "loginThenAddBusiness.test.js"
                                          );

                                        exec(
                                          `node ${loginThenAddBusinessTestPath}`,
                                          (error3_6, stdout3_6, stderr3_6) => {
                                            if (error3_6) {
                                              console.error(
                                                `❌ Login Then Add Business Test failed: ${error3_6.message}`
                                              );
                                              process.exit(1);
                                            }

                                            if (stderr3_6) {
                                              console.error(
                                                `❌ Login Then Add Business Test stderr: ${stderr3_6}`
                                              );
                                              process.exit(1);
                                            }

                                            console.log(stdout3_6);

                                            // Run the login then check business test
                                            const loginThenCheckBusinessTestPath =
                                              path.join(
                                                __dirname,
                                                "tests",
                                                "loginThenCheckBusiness",
                                                "loginThenCheckBusiness.test.js"
                                              );

                                            exec(
                                              `node ${loginThenCheckBusinessTestPath}`,
                                              (
                                                error3_7,
                                                stdout3_7,
                                                stderr3_7
                                              ) => {
                                                if (error3_7) {
                                                  console.error(
                                                    `❌ Login Then Check Business Test failed: ${error3_7.message}`
                                                  );
                                                  process.exit(1);
                                                }

                                                if (stderr3_7) {
                                                  console.error(
                                                    `❌ Login Then Check Business Test stderr: ${stderr3_7}`
                                                  );
                                                  process.exit(1);
                                                }

                                                console.log(stdout3_7);

                                                // Run the register test
                                                const registerTestPath =
                                                  path.join(
                                                    __dirname,
                                                    "tests",
                                                    "register",
                                                    "register.test.js"
                                                  );

                                                exec(
                                                  `node ${registerTestPath}`,
                                                  (
                                                    error4,
                                                    stdout4,
                                                    stderr4
                                                  ) => {
                                                    if (error4) {
                                                      console.error(
                                                        `❌ Register Test failed: ${error4.message}`
                                                      );
                                                      process.exit(1);
                                                    }

                                                    if (stderr4) {
                                                      console.error(
                                                        `❌ Register Test stderr: ${stderr4}`
                                                      );
                                                      process.exit(1);
                                                    }

                                                    console.log(stdout4);

                                                    // Run the SQL injection login test
                                                    const sqlInjectionLoginTestPath =
                                                      path.join(
                                                        __dirname,
                                                        "tests",
                                                        "sqlInjectionLogin",
                                                        "sqlInjectionLogin.test.js"
                                                      );

                                                    exec(
                                                      `node ${sqlInjectionLoginTestPath}`,
                                                      (
                                                        error4_1,
                                                        stdout4_1,
                                                        stderr4_1
                                                      ) => {
                                                        if (error4_1) {
                                                          console.error(
                                                            `❌ SQL Injection Login Test failed: ${error4_1.message}`
                                                          );
                                                          process.exit(1);
                                                        }

                                                        if (stderr4_1) {
                                                          console.error(
                                                            `❌ SQL Injection Login Test stderr: ${stderr4_1}`
                                                          );
                                                          process.exit(1);
                                                        }

                                                        console.log(stdout4_1);

                                                        // Run the SQL injection register test
                                                        const sqlInjectionRegisterTestPath =
                                                          path.join(
                                                            __dirname,
                                                            "tests",
                                                            "sqlInjectionRegister",
                                                            "sqlInjectionRegister.test.js"
                                                          );

                                                        exec(
                                                          `node ${sqlInjectionRegisterTestPath}`,
                                                          (
                                                            error4_2,
                                                            stdout4_2,
                                                            stderr4_2
                                                          ) => {
                                                            if (error4_2) {
                                                              console.error(
                                                                `❌ SQL Injection Register Test failed: ${error4_2.message}`
                                                              );
                                                              process.exit(1);
                                                            }

                                                            if (stderr4_2) {
                                                              console.error(
                                                                `❌ SQL Injection Register Test stderr: ${stderr4_2}`
                                                              );
                                                              process.exit(1);
                                                            }

                                                            console.log(
                                                              stdout4_2
                                                            );

                                                            // Run the session persistence test
                                                            const sessionPersistenceTestPath =
                                                              path.join(
                                                                __dirname,
                                                                "tests",
                                                                "sessionPersistence",
                                                                "sessionPersistence.test.js"
                                                              );

                                                            exec(
                                                              `node ${sessionPersistenceTestPath}`,
                                                              (
                                                                error4_3,
                                                                stdout4_3,
                                                                stderr4_3
                                                              ) => {
                                                                if (error4_3) {
                                                                  console.error(
                                                                    `❌ Session Persistence Test failed: ${error4_3.message}`
                                                                  );
                                                                  process.exit(
                                                                    1
                                                                  );
                                                                }

                                                                if (stderr4_3) {
                                                                  console.error(
                                                                    `❌ Session Persistence Test stderr: ${stderr4_3}`
                                                                  );
                                                                  process.exit(
                                                                    1
                                                                  );
                                                                }

                                                                console.log(
                                                                  stdout4_3
                                                                );

                                                                // Run the activate user test
                                                                const activateUserTestPath =
                                                                  path.join(
                                                                    __dirname,
                                                                    "tests",
                                                                    "activateUser",
                                                                    "activateUser.test.js"
                                                                  );

                                                                exec(
                                                                  `node ${activateUserTestPath}`,
                                                                  (
                                                                    error4_5,
                                                                    stdout4_5,
                                                                    stderr4_5
                                                                  ) => {
                                                                    if (
                                                                      error4_5
                                                                    ) {
                                                                      console.error(
                                                                        `❌ Activate User Test failed: ${error4_5.message}`
                                                                      );
                                                                      process.exit(
                                                                        1
                                                                      );
                                                                    }

                                                                    if (
                                                                      stderr4_5
                                                                    ) {
                                                                      console.error(
                                                                        `❌ Activate User Test stderr: ${stderr4_5}`
                                                                      );
                                                                      process.exit(
                                                                        1
                                                                      );
                                                                    }

                                                                    console.log(
                                                                      stdout4_5
                                                                    );

                                                                    // Run the password reset test
                                                                    const passwordResetTestPath =
                                                                      path.join(
                                                                        __dirname,
                                                                        "tests",
                                                                        "passwordReset",
                                                                        "passwordReset.test.js"
                                                                      );

                                                                    exec(
                                                                      `node ${passwordResetTestPath}`,
                                                                      (
                                                                        error4_5,
                                                                        stdout4_5,
                                                                        stderr4_5
                                                                      ) => {
                                                                        if (
                                                                          error4_5
                                                                        ) {
                                                                          console.error(
                                                                            `❌ Password Reset Test failed: ${error4_5.message}`
                                                                          );
                                                                          process.exit(
                                                                            1
                                                                          );
                                                                        }

                                                                        if (
                                                                          stderr4_5
                                                                        ) {
                                                                          console.error(
                                                                            `❌ Password Reset Test stderr: ${stderr4_5}`
                                                                          );
                                                                          process.exit(
                                                                            1
                                                                          );
                                                                        }

                                                                        console.log(
                                                                          stdout4_5
                                                                        );

                                                                        // Run the header test
                                                                        const headerTestPath =
                                                                          path.join(
                                                                            __dirname,
                                                                            "tests",
                                                                            "header",
                                                                            "header.test.js"
                                                                          );

                                                                        exec(
                                                                          `node ${headerTestPath}`,
                                                                          (
                                                                            error5,
                                                                            stdout5,
                                                                            stderr5
                                                                          ) => {
                                                                            if (
                                                                              error5
                                                                            ) {
                                                                              console.error(
                                                                                `❌ Header Test failed: ${error5.message}`
                                                                              );
                                                                              process.exit(
                                                                                1
                                                                              );
                                                                            }

                                                                            if (
                                                                              stderr5
                                                                            ) {
                                                                              console.error(
                                                                                `❌ Header Test stderr: ${stderr5}`
                                                                              );
                                                                              process.exit(
                                                                                1
                                                                              );
                                                                            }

                                                                            console.log(
                                                                              stdout5
                                                                            );

                                                                            // Run the header navigation test
                                                                            const headerNavigationTestPath =
                                                                              path.join(
                                                                                __dirname,
                                                                                "tests",
                                                                                "headerNavigation",
                                                                                "headerNavigation.test.js"
                                                                              );

                                                                            exec(
                                                                              `node ${headerNavigationTestPath}`,
                                                                              (
                                                                                error5_5,
                                                                                stdout5_5,
                                                                                stderr5_5
                                                                              ) => {
                                                                                if (
                                                                                  error5_5
                                                                                ) {
                                                                                  console.error(
                                                                                    `❌ Header Navigation Test failed: ${error5_5.message}`
                                                                                  );
                                                                                  process.exit(
                                                                                    1
                                                                                  );
                                                                                }

                                                                                if (
                                                                                  stderr5_5
                                                                                ) {
                                                                                  console.error(
                                                                                    `❌ Header Navigation Test stderr: ${stderr5_5}`
                                                                                  );
                                                                                  process.exit(
                                                                                    1
                                                                                  );
                                                                                }

                                                                                console.log(
                                                                                  stdout5_5
                                                                                );

                                                                                // Run the footer test
                                                                                const footerTestPath =
                                                                                  path.join(
                                                                                    __dirname,
                                                                                    "tests",
                                                                                    "footer",
                                                                                    "footer.test.js"
                                                                                  );

                                                                                exec(
                                                                                  `node ${footerTestPath}`,
                                                                                  (
                                                                                    error6,
                                                                                    stdout6,
                                                                                    stderr6
                                                                                  ) => {
                                                                                    if (
                                                                                      error6
                                                                                    ) {
                                                                                      console.error(
                                                                                        `❌ Footer Test failed: ${error6.message}`
                                                                                      );
                                                                                      process.exit(
                                                                                        1
                                                                                      );
                                                                                    }

                                                                                    if (
                                                                                      stderr6
                                                                                    ) {
                                                                                      console.error(
                                                                                        `❌ Footer Test stderr: ${stderr6}`
                                                                                      );
                                                                                      process.exit(
                                                                                        1
                                                                                      );
                                                                                    }

                                                                                    console.log(
                                                                                      stdout6
                                                                                    );

                                                                                    // Run the footer links test
                                                                                    const footerLinksTestPath =
                                                                                      path.join(
                                                                                        __dirname,
                                                                                        "tests",
                                                                                        "footerLinks",
                                                                                        "footerlinks.test.js"
                                                                                      );

                                                                                    exec(
                                                                                      `node ${footerLinksTestPath}`,
                                                                                      (
                                                                                        error6_5,
                                                                                        stdout6_5,
                                                                                        stderr6_5
                                                                                      ) => {
                                                                                        if (
                                                                                          error6_5
                                                                                        ) {
                                                                                          console.error(
                                                                                            `❌ Footer Links Test failed: ${error6_5.message}`
                                                                                          );
                                                                                          process.exit(
                                                                                            1
                                                                                          );
                                                                                        }

                                                                                        if (
                                                                                          stderr6_5
                                                                                        ) {
                                                                                          console.error(
                                                                                            `❌ Footer Links Test stderr: ${stderr6_5}`
                                                                                          );
                                                                                          process.exit(
                                                                                            1
                                                                                          );
                                                                                        }

                                                                                        console.log(
                                                                                          stdout6_5
                                                                                        );

                                                                                        // Run the about test
                                                                                        const aboutTestPath =
                                                                                          path.join(
                                                                                            __dirname,
                                                                                            "tests",
                                                                                            "about",
                                                                                            "about.test.js"
                                                                                          );

                                                                                        exec(
                                                                                          `node ${aboutTestPath}`,
                                                                                          (
                                                                                            error7,
                                                                                            stdout7,
                                                                                            stderr7
                                                                                          ) => {
                                                                                            if (
                                                                                              error7
                                                                                            ) {
                                                                                              console.error(
                                                                                                `❌ About Test failed: ${error7.message}`
                                                                                              );
                                                                                              process.exit(
                                                                                                1
                                                                                              );
                                                                                            }

                                                                                            if (
                                                                                              stderr7
                                                                                            ) {
                                                                                              console.error(
                                                                                                `❌ About Test stderr: ${stderr7}`
                                                                                              );
                                                                                              process.exit(
                                                                                                1
                                                                                              );
                                                                                            }

                                                                                            console.log(
                                                                                              stdout7
                                                                                            );

                                                                                            // Run the categories page load test
                                                                                            const categoriesPageLoadTestPath =
                                                                                              path.join(
                                                                                                __dirname,
                                                                                                "tests",
                                                                                                "categoriesPageLoad",
                                                                                                "categoriesPageLoad.test.js"
                                                                                              );

                                                                                            exec(
                                                                                              `node ${categoriesPageLoadTestPath}`,
                                                                                              (
                                                                                                error7_5,
                                                                                                stdout7_5,
                                                                                                stderr7_5
                                                                                              ) => {
                                                                                                if (
                                                                                                  error7_5
                                                                                                ) {
                                                                                                  console.error(
                                                                                                    `❌ Categories Page Load Test failed: ${error7_5.message}`
                                                                                                  );
                                                                                                  process.exit(
                                                                                                    1
                                                                                                  );
                                                                                                }

                                                                                                if (
                                                                                                  stderr7_5
                                                                                                ) {
                                                                                                  console.error(
                                                                                                    `❌ Categories Page Load Test stderr: ${stderr7_5}`
                                                                                                  );
                                                                                                  process.exit(
                                                                                                    1
                                                                                                  );
                                                                                                }

                                                                                                console.log(
                                                                                                  stdout7_5
                                                                                                );

                                                                                                // Run the categories test
                                                                                                const categoriesTestPath =
                                                                                                  path.join(
                                                                                                    __dirname,
                                                                                                    "tests",
                                                                                                    "categories",
                                                                                                    "categories.test.js"
                                                                                                  );

                                                                                                exec(
                                                                                                  `node ${categoriesTestPath}`,
                                                                                                  (
                                                                                                    error8,
                                                                                                    stdout8,
                                                                                                    stderr8
                                                                                                  ) => {
                                                                                                    if (
                                                                                                      error8
                                                                                                    ) {
                                                                                                      console.error(
                                                                                                        `❌ Categories Test failed: ${error8.message}`
                                                                                                      );
                                                                                                      process.exit(
                                                                                                        1
                                                                                                      );
                                                                                                    }

                                                                                                    if (
                                                                                                      stderr8
                                                                                                    ) {
                                                                                                      console.error(
                                                                                                        `❌ Categories Test stderr: ${stderr8}`
                                                                                                      );
                                                                                                      process.exit(
                                                                                                        1
                                                                                                      );
                                                                                                    }

                                                                                                    console.log(
                                                                                                      stdout8
                                                                                                    );

                                                                                                    // Run the category navigation test
                                                                                                    const categoryNavigationTestPath =
                                                                                                      path.join(
                                                                                                        __dirname,
                                                                                                        "tests",
                                                                                                        "categoryNavigation",
                                                                                                        "categoryNavigation.test.js"
                                                                                                      );

                                                                                                    exec(
                                                                                                      `node ${categoryNavigationTestPath}`,
                                                                                                      (
                                                                                                        error8_5,
                                                                                                        stdout8_5,
                                                                                                        stderr8_5
                                                                                                      ) => {
                                                                                                        if (
                                                                                                          error8_5
                                                                                                        ) {
                                                                                                          console.error(
                                                                                                            `❌ Category Navigation Test failed: ${error8_5.message}`
                                                                                                          );
                                                                                                          process.exit(
                                                                                                            1
                                                                                                          );
                                                                                                        }

                                                                                                        if (
                                                                                                          stderr8_5
                                                                                                        ) {
                                                                                                          console.error(
                                                                                                            `❌ Category Navigation Test stderr: ${stderr8_5}`
                                                                                                          );
                                                                                                          process.exit(
                                                                                                            1
                                                                                                          );
                                                                                                        }

                                                                                                        console.log(
                                                                                                          stdout8_5
                                                                                                        );

                                                                                                        // Run the category detail navigation test
                                                                                                        const categoryDetailNavigationTestPath =
                                                                                                          path.join(
                                                                                                            __dirname,
                                                                                                            "tests",
                                                                                                            "categoryDetailNavigation",
                                                                                                            "categoryDetailNavigation.test.js"
                                                                                                          );

                                                                                                        exec(
                                                                                                          `node ${categoryDetailNavigationTestPath}`,
                                                                                                          (
                                                                                                            error8_6,
                                                                                                            stdout8_6,
                                                                                                            stderr8_6
                                                                                                          ) => {
                                                                                                            if (
                                                                                                              error8_6
                                                                                                            ) {
                                                                                                              console.error(
                                                                                                                `❌ Category Detail Navigation Test failed: ${error8_6.message}`
                                                                                                              );
                                                                                                              process.exit(
                                                                                                                1
                                                                                                              );
                                                                                                            }

                                                                                                            if (
                                                                                                              stderr8_6
                                                                                                            ) {
                                                                                                              console.error(
                                                                                                                `❌ Category Detail Navigation Test stderr: ${stderr8_6}`
                                                                                                              );
                                                                                                              process.exit(
                                                                                                                1
                                                                                                              );
                                                                                                            }

                                                                                                            console.log(
                                                                                                              stdout8_6
                                                                                                            );

                                                                                                            // Run the specific category navigation test
                                                                                                            const specificCategoryNavigationTestPath =
                                                                                                              path.join(
                                                                                                                __dirname,
                                                                                                                "tests",
                                                                                                                "specificCategoryNavigation",
                                                                                                                "specificCategoryNavigation.test.js"
                                                                                                              );

                                                                                                            exec(
                                                                                                              `node ${specificCategoryNavigationTestPath}`,
                                                                                                              (
                                                                                                                error8_7,
                                                                                                                stdout8_7,
                                                                                                                stderr8_7
                                                                                                              ) => {
                                                                                                                if (
                                                                                                                  error8_7
                                                                                                                ) {
                                                                                                                  console.error(
                                                                                                                    `❌ Specific Category Navigation Test failed: ${error8_7.message}`
                                                                                                                  );
                                                                                                                  process.exit(
                                                                                                                    1
                                                                                                                  );
                                                                                                                }

                                                                                                                if (
                                                                                                                  stderr8_7
                                                                                                                ) {
                                                                                                                  console.error(
                                                                                                                    `❌ Specific Category Navigation Test stderr: ${stderr8_7}`
                                                                                                                  );
                                                                                                                  process.exit(
                                                                                                                    1
                                                                                                                  );
                                                                                                                }

                                                                                                                console.log(
                                                                                                                  stdout8_7
                                                                                                                );

                                                                                                                // Run the user profile edit page load test
                                                                                                                const userProfileEditPageLoadTestPath =
                                                                                                                  path.join(
                                                                                                                    __dirname,
                                                                                                                    "tests",
                                                                                                                    "userProfileEditPageLoad",
                                                                                                                    "userProfileEditPageLoad.test.js"
                                                                                                                  );

                                                                                                                exec(
                                                                                                                  `node ${userProfileEditPageLoadTestPath}`,
                                                                                                                  (
                                                                                                                    error8_8,
                                                                                                                    stdout8_8,
                                                                                                                    stderr8_8
                                                                                                                  ) => {
                                                                                                                    if (
                                                                                                                      error8_8
                                                                                                                    ) {
                                                                                                                      console.error(
                                                                                                                        `❌ User Profile Edit Page Load Test failed: ${error8_8.message}`
                                                                                                                      );
                                                                                                                      process.exit(
                                                                                                                        1
                                                                                                                      );
                                                                                                                    }

                                                                                                                    if (
                                                                                                                      stderr8_8
                                                                                                                    ) {
                                                                                                                      console.error(
                                                                                                                        `❌ User Profile Edit Page Load Test stderr: ${stderr8_8}`
                                                                                                                      );
                                                                                                                      process.exit(
                                                                                                                        1
                                                                                                                      );
                                                                                                                    }

                                                                                                                    console.log(
                                                                                                                      stdout8_8
                                                                                                                    );

                                                                                                                    // Run the search test
                                                                                                                    const searchTestPath =
                                                                                                                      path.join(
                                                                                                                        __dirname,
                                                                                                                        "tests",
                                                                                                                        "search",
                                                                                                                        "search.test.js"
                                                                                                                      );

                                                                                                                    exec(
                                                                                                                      `node ${searchTestPath}`,
                                                                                                                      (
                                                                                                                        error9,
                                                                                                                        stdout9,
                                                                                                                        stderr9
                                                                                                                      ) => {
                                                                                                                        if (
                                                                                                                          error9
                                                                                                                        ) {
                                                                                                                          console.error(
                                                                                                                            `❌ Search Test failed: ${error9.message}`
                                                                                                                          );
                                                                                                                          process.exit(
                                                                                                                            1
                                                                                                                          );
                                                                                                                        }

                                                                                                                        if (
                                                                                                                          stderr9
                                                                                                                        ) {
                                                                                                                          console.error(
                                                                                                                            `❌ Search Test stderr: ${stderr9}`
                                                                                                                          );
                                                                                                                          process.exit(
                                                                                                                            1
                                                                                                                          );
                                                                                                                        }

                                                                                                                        console.log(
                                                                                                                          stdout9
                                                                                                                        );

                                                                                                                        // Run the logo test
                                                                                                                        const logoTestPath =
                                                                                                                          path.join(
                                                                                                                            __dirname,
                                                                                                                            "tests",
                                                                                                                            "logoTest",
                                                                                                                            "logoTest.test.js"
                                                                                                                          );

                                                                                                                        exec(
                                                                                                                          `node ${logoTestPath}`,
                                                                                                                          (
                                                                                                                            error9_5,
                                                                                                                            stdout9_5,
                                                                                                                            stderr9_5
                                                                                                                          ) => {
                                                                                                                            if (
                                                                                                                              error9_5
                                                                                                                            ) {
                                                                                                                              console.error(
                                                                                                                                `❌ Logo Test failed: ${error9_5.message}`
                                                                                                                              );
                                                                                                                              process.exit(
                                                                                                                                1
                                                                                                                              );
                                                                                                                            }

                                                                                                                            if (
                                                                                                                              stderr9_5
                                                                                                                            ) {
                                                                                                                              console.error(
                                                                                                                                `❌ Logo Test stderr: ${stderr9_5}`
                                                                                                                              );
                                                                                                                              process.exit(
                                                                                                                                1
                                                                                                                              );
                                                                                                                            }

                                                                                                                            console.log(
                                                                                                                              stdout9_5
                                                                                                                            );

                                                                                                                            // Run the search form test
                                                                                                                            const searchFormTestPath =
                                                                                                                              path.join(
                                                                                                                                __dirname,
                                                                                                                                "tests",
                                                                                                                                "searchFormTest",
                                                                                                                                "searchFormTest.test.js"
                                                                                                                              );

                                                                                                                            exec(
                                                                                                                              `node ${searchFormTestPath}`,
                                                                                                                              (
                                                                                                                                error10,
                                                                                                                                stdout10,
                                                                                                                                stderr10
                                                                                                                              ) => {
                                                                                                                                if (
                                                                                                                                  error10
                                                                                                                                ) {
                                                                                                                                  console.error(
                                                                                                                                    `❌ Search Form Test failed: ${error10.message}`
                                                                                                                                  );
                                                                                                                                  process.exit(
                                                                                                                                    1
                                                                                                                                  );
                                                                                                                                }

                                                                                                                                if (
                                                                                                                                  stderr10
                                                                                                                                ) {
                                                                                                                                  console.error(
                                                                                                                                    `❌ Search Form Test stderr: ${stderr10}`
                                                                                                                                  );
                                                                                                                                  process.exit(
                                                                                                                                    1
                                                                                                                                  );
                                                                                                                                }

                                                                                                                                console.log(
                                                                                                                                  stdout10
                                                                                                                                );

                                                                                                                                // Run the add business form test
                                                                                                                                const addBusinessFormTestPath =
                                                                                                                                  path.join(
                                                                                                                                    __dirname,
                                                                                                                                    "tests",
                                                                                                                                    "addBusinessFormTest",
                                                                                                                                    "addBusinessFormTest.test.js"
                                                                                                                                  );

                                                                                                                                exec(
                                                                                                                                  `node ${addBusinessFormTestPath}`,
                                                                                                                                  (
                                                                                                                                    error11,
                                                                                                                                    stdout11,
                                                                                                                                    stderr11
                                                                                                                                  ) => {
                                                                                                                                    if (
                                                                                                                                      error11
                                                                                                                                    ) {
                                                                                                                                      console.error(
                                                                                                                                        `❌ Add Business Form Test failed: ${error11.message}`
                                                                                                                                      );
                                                                                                                                      process.exit(
                                                                                                                                        1
                                                                                                                                      );
                                                                                                                                    }

                                                                                                                                    if (
                                                                                                                                      stderr11
                                                                                                                                    ) {
                                                                                                                                      console.error(
                                                                                                                                        `❌ Add Business Form Test stderr: ${stderr11}`
                                                                                                                                      );
                                                                                                                                      process.exit(
                                                                                                                                        1
                                                                                                                                      );
                                                                                                                                    }

                                                                                                                                    console.log(
                                                                                                                                      stdout11
                                                                                                                                    );

                                                                                                                                    // Run the SQL injection add business test
                                                                                                                                    const sqlInjectionAddBusinessTestPath =
                                                                                                                                      path.join(
                                                                                                                                        __dirname,
                                                                                                                                        "tests",
                                                                                                                                        "sqlInjectionAddBusiness",
                                                                                                                                        "sqlInjectionAddBusiness.test.js"
                                                                                                                                      );

                                                                                                                                    exec(
                                                                                                                                      `node ${sqlInjectionAddBusinessTestPath}`,
                                                                                                                                      (
                                                                                                                                        error11_5,
                                                                                                                                        stdout11_5,
                                                                                                                                        stderr11_5
                                                                                                                                      ) => {
                                                                                                                                        if (
                                                                                                                                          error11_5
                                                                                                                                        ) {
                                                                                                                                          console.error(
                                                                                                                                            `❌ SQL Injection Add Business Test failed: ${error11_5.message}`
                                                                                                                                          );
                                                                                                                                          process.exit(
                                                                                                                                            1
                                                                                                                                          );
                                                                                                                                        }

                                                                                                                                        if (
                                                                                                                                          stderr11_5
                                                                                                                                        ) {
                                                                                                                                          console.error(
                                                                                                                                            `❌ SQL Injection Add Business Test stderr: ${stderr11_5}`
                                                                                                                                          );
                                                                                                                                          process.exit(
                                                                                                                                            1
                                                                                                                                          );
                                                                                                                                        }

                                                                                                                                        console.log(
                                                                                                                                          stdout11_5
                                                                                                                                        );

                                                                                                                                        // Run the login keyboard submit test
                                                                                                                                        const loginKeyboardSubmitTestPath =
                                                                                                                                          path.join(
                                                                                                                                            __dirname,
                                                                                                                                            "tests",
                                                                                                                                            "loginKeyboardSubmit",
                                                                                                                                            "loginKeyboardSubmit.test.js"
                                                                                                                                          );

                                                                                                                                        exec(
                                                                                                                                          `node ${loginKeyboardSubmitTestPath}`,
                                                                                                                                          (
                                                                                                                                            error11_6,
                                                                                                                                            stdout11_6,
                                                                                                                                            stderr11_6
                                                                                                                                          ) => {
                                                                                                                                            if (
                                                                                                                                              error11_6
                                                                                                                                            ) {
                                                                                                                                              console.error(
                                                                                                                                                `❌ Login Keyboard Submit Test failed: ${error11_6.message}`
                                                                                                                                              );
                                                                                                                                              process.exit(
                                                                                                                                                1
                                                                                                                                              );
                                                                                                                                            }

                                                                                                                                            if (
                                                                                                                                              stderr11_6
                                                                                                                                            ) {
                                                                                                                                              console.error(
                                                                                                                                                `❌ Login Keyboard Submit Test stderr: ${stderr11_6}`
                                                                                                                                              );
                                                                                                                                              process.exit(
                                                                                                                                                1
                                                                                                                                              );
                                                                                                                                            }

                                                                                                                                            console.log(
                                                                                                                                              stdout11_6
                                                                                                                                            );

                                                                                                                                            // Run the register keyboard submit test
                                                                                                                                            const registerKeyboardSubmitTestPath =
                                                                                                                                              path.join(
                                                                                                                                                __dirname,
                                                                                                                                                "tests",
                                                                                                                                                "registerKeyboardSubmit",
                                                                                                                                                "registerKeyboardSubmit.test.js"
                                                                                                                                              );

                                                                                                                                            exec(
                                                                                                                                              `node ${registerKeyboardSubmitTestPath}`,
                                                                                                                                              (
                                                                                                                                                error11_7,
                                                                                                                                                stdout11_7,
                                                                                                                                                stderr11_7
                                                                                                                                              ) => {
                                                                                                                                                if (
                                                                                                                                                  error11_7
                                                                                                                                                ) {
                                                                                                                                                  console.error(
                                                                                                                                                    `❌ Register Keyboard Submit Test failed: ${error11_7.message}`
                                                                                                                                                  );
                                                                                                                                                  process.exit(
                                                                                                                                                    1
                                                                                                                                                  );
                                                                                                                                                }

                                                                                                                                                if (
                                                                                                                                                  stderr11_7
                                                                                                                                                ) {
                                                                                                                                                  console.error(
                                                                                                                                                    `❌ Register Keyboard Submit Test stderr: ${stderr11_7}`
                                                                                                                                                  );
                                                                                                                                                  process.exit(
                                                                                                                                                    1
                                                                                                                                                  );
                                                                                                                                                }

                                                                                                                                                console.log(
                                                                                                                                                  stdout11_7
                                                                                                                                                );

                                                                                                                                                // Run the SQL injection password reset test
                                                                                                                                                const sqlInjectionPasswordResetTestPath =
                                                                                                                                                  path.join(
                                                                                                                                                    __dirname,
                                                                                                                                                    "tests",
                                                                                                                                                    "sqlInjectionPasswordReset",
                                                                                                                                                    "sqlInjectionPasswordReset.test.js"
                                                                                                                                                  );

                                                                                                                                                exec(
                                                                                                                                                  `node ${sqlInjectionPasswordResetTestPath}`,
                                                                                                                                                  (
                                                                                                                                                    error11_8,
                                                                                                                                                    stdout11_8,
                                                                                                                                                    stderr11_8
                                                                                                                                                  ) => {
                                                                                                                                                    if (
                                                                                                                                                      error11_8
                                                                                                                                                    ) {
                                                                                                                                                      console.error(
                                                                                                                                                        `❌ SQL Injection Password Reset Test failed: ${error11_8.message}`
                                                                                                                                                      );
                                                                                                                                                      process.exit(
                                                                                                                                                        1
                                                                                                                                                      );
                                                                                                                                                    }

                                                                                                                                                    if (
                                                                                                                                                      stderr11_8
                                                                                                                                                    ) {
                                                                                                                                                      console.error(
                                                                                                                                                        `❌ SQL Injection Password Reset Test stderr: ${stderr11_8}`
                                                                                                                                                      );
                                                                                                                                                      process.exit(
                                                                                                                                                        1
                                                                                                                                                      );
                                                                                                                                                    }

                                                                                                                                                    console.log(
                                                                                                                                                      stdout11_8
                                                                                                                                                    );

                                                                                                                                                    // Run the password reset keyboard submit test
                                                                                                                                                    const passwordResetKeyboardSubmitTestPath =
                                                                                                                                                      path.join(
                                                                                                                                                        __dirname,
                                                                                                                                                        "tests",
                                                                                                                                                        "passwordResetKeyboardSubmit",
                                                                                                                                                        "passwordResetKeyboardSubmit.test.js"
                                                                                                                                                      );

                                                                                                                                                    exec(
                                                                                                                                                      `node ${passwordResetKeyboardSubmitTestPath}`,
                                                                                                                                                      (
                                                                                                                                                        error11_9,
                                                                                                                                                        stdout11_9,
                                                                                                                                                        stderr11_9
                                                                                                                                                      ) => {
                                                                                                                                                        if (
                                                                                                                                                          error11_9
                                                                                                                                                        ) {
                                                                                                                                                          console.error(
                                                                                                                                                            `❌ Password Reset Keyboard Submit Test failed: ${error11_9.message}`
                                                                                                                                                          );
                                                                                                                                                          process.exit(
                                                                                                                                                            1
                                                                                                                                                          );
                                                                                                                                                        }

                                                                                                                                                        if (
                                                                                                                                                          stderr11_9
                                                                                                                                                        ) {
                                                                                                                                                          console.error(
                                                                                                                                                            `❌ Password Reset Keyboard Submit Test stderr: ${stderr11_9}`
                                                                                                                                                          );
                                                                                                                                                          process.exit(
                                                                                                                                                            1
                                                                                                                                                          );
                                                                                                                                                        }

                                                                                                                                                        console.log(
                                                                                                                                                          stdout11_9
                                                                                                                                                        );

                                                                                                                                                        // Run the category pagination test
                                                                                                                                                        const categoryPaginationTestPath =
                                                                                                                                                          path.join(
                                                                                                                                                            __dirname,
                                                                                                                                                            "tests",
                                                                                                                                                            "categoryPagination",
                                                                                                                                                            "categoryPagination.test.js"
                                                                                                                                                          );

                                                                                                                                                        exec(
                                                                                                                                                          `node ${categoryPaginationTestPath}`,
                                                                                                                                                          (
                                                                                                                                                            error11_10,
                                                                                                                                                            stdout11_10,
                                                                                                                                                            stderr11_10
                                                                                                                                                          ) => {
                                                                                                                                                            if (
                                                                                                                                                              error11_10
                                                                                                                                                            ) {
                                                                                                                                                              console.error(
                                                                                                                                                                `❌ Category Pagination Test failed: ${error11_10.message}`
                                                                                                                                                              );
                                                                                                                                                              process.exit(
                                                                                                                                                                1
                                                                                                                                                              );
                                                                                                                                                            }

                                                                                                                                                            if (
                                                                                                                                                              stderr11_10
                                                                                                                                                            ) {
                                                                                                                                                              console.error(
                                                                                                                                                                `❌ Category Pagination Test stderr: ${stderr11_10}`
                                                                                                                                                              );
                                                                                                                                                              process.exit(
                                                                                                                                                                1
                                                                                                                                                              );
                                                                                                                                                            }

                                                                                                                                                            console.log(
                                                                                                                                                              stdout11_10
                                                                                                                                                            );

                                                                                                                                                            // Run the similar business navigation test
                                                                                                                                                            const similarBusinessNavigationTestPath =
                                                                                                                                                              path.join(
                                                                                                                                                                __dirname,
                                                                                                                                                                "tests",
                                                                                                                                                                "similarBusinessNavigation",
                                                                                                                                                                "similarBusinessNavigation.test.js"
                                                                                                                                                              );

                                                                                                                                                            exec(
                                                                                                                                                              `node ${similarBusinessNavigationTestPath}`,
                                                                                                                                                              (
                                                                                                                                                                error11_11,
                                                                                                                                                                stdout11_11,
                                                                                                                                                                stderr11_11
                                                                                                                                                              ) => {
                                                                                                                                                                if (
                                                                                                                                                                  error11_11
                                                                                                                                                                ) {
                                                                                                                                                                  console.error(
                                                                                                                                                                    `❌ Similar Business Navigation Test failed: ${error11_11.message}`
                                                                                                                                                                  );
                                                                                                                                                                  process.exit(
                                                                                                                                                                    1
                                                                                                                                                                  );
                                                                                                                                                                }

                                                                                                                                                                if (
                                                                                                                                                                  stderr11_11
                                                                                                                                                                ) {
                                                                                                                                                                  console.error(
                                                                                                                                                                    `❌ Similar Business Navigation Test stderr: ${stderr11_11}`
                                                                                                                                                                  );
                                                                                                                                                                  process.exit(
                                                                                                                                                                    1
                                                                                                                                                                  );
                                                                                                                                                                }

                                                                                                                                                                console.log(
                                                                                                                                                                  stdout11_11
                                                                                                                                                                );

                                                                                                                                                                // Run the unauthenticated contact form test
                                                                                                                                                                const unauthenticatedContactFormTestPath =
                                                                                                                                                                  path.join(
                                                                                                                                                                    __dirname,
                                                                                                                                                                    "tests",
                                                                                                                                                                    "unauthenticatedContactForm",
                                                                                                                                                                    "unauthenticatedContactForm.test.js"
                                                                                                                                                                  );

                                                                                                                                                                exec(
                                                                                                                                                                  `node ${unauthenticatedContactFormTestPath}`,
                                                                                                                                                                  (
                                                                                                                                                                    error11_12,
                                                                                                                                                                    stdout11_12,
                                                                                                                                                                    stderr11_12
                                                                                                                                                                  ) => {
                                                                                                                                                                    if (
                                                                                                                                                                      error11_12
                                                                                                                                                                    ) {
                                                                                                                                                                      console.error(
                                                                                                                                                                        `❌ Unauthenticated Contact Form Test failed: ${error11_12.message}`
                                                                                                                                                                      );
                                                                                                                                                                      process.exit(
                                                                                                                                                                        1
                                                                                                                                                                      );
                                                                                                                                                                    }

                                                                                                                                                                    if (
                                                                                                                                                                      stderr11_12
                                                                                                                                                                    ) {
                                                                                                                                                                      console.error(
                                                                                                                                                                        `❌ Unauthenticated Contact Form Test stderr: ${stderr11_12}`
                                                                                                                                                                      );
                                                                                                                                                                      process.exit(
                                                                                                                                                                        1
                                                                                                                                                                      );
                                                                                                                                                                    }

                                                                                                                                                                    console.log(
                                                                                                                                                                      stdout11_12
                                                                                                                                                                    );

                                                                                                                                                                    // Run the sql injection search test
                                                                                                                                                                    const sqlInjectionSearchTestPath =
                                                                                                                                                                      path.join(
                                                                                                                                                                        __dirname,
                                                                                                                                                                        "tests",
                                                                                                                                                                        "sqlInjectionSearch",
                                                                                                                                                                        "sqlInjectionSearch.test.js"
                                                                                                                                                                      );

                                                                                                                                                                    exec(
                                                                                                                                                                      `node ${sqlInjectionSearchTestPath}`,
                                                                                                                                                                      (
                                                                                                                                                                        error11_13,
                                                                                                                                                                        stdout11_13,
                                                                                                                                                                        stderr11_13
                                                                                                                                                                      ) => {
                                                                                                                                                                        if (
                                                                                                                                                                          error11_13
                                                                                                                                                                        ) {
                                                                                                                                                                          console.error(
                                                                                                                                                                            `❌ SQL Injection Search Test failed: ${error11_13.message}`
                                                                                                                                                                          );
                                                                                                                                                                          process.exit(
                                                                                                                                                                            1
                                                                                                                                                                          );
                                                                                                                                                                        }

                                                                                                                                                                        if (
                                                                                                                                                                          stderr11_13
                                                                                                                                                                        ) {
                                                                                                                                                                          console.error(
                                                                                                                                                                            `❌ SQL Injection Search Test stderr: ${stderr11_13}`
                                                                                                                                                                          );
                                                                                                                                                                          process.exit(
                                                                                                                                                                            1
                                                                                                                                                                          );
                                                                                                                                                                        }

                                                                                                                                                                        console.log(
                                                                                                                                                                          stdout11_13
                                                                                                                                                                        );

                                                                                                                                                                        // Run the login then delete account test
                                                                                                                                                                        const loginThenDeleteAccountTestPath =
                                                                                                                                                                          path.join(
                                                                                                                                                                            __dirname,
                                                                                                                                                                            "tests",
                                                                                                                                                                            "loginThenDeleteAccount",
                                                                                                                                                                            "loginThenDeleteAccount.test.js"
                                                                                                                                                                          );

                                                                                                                                                                        exec(
                                                                                                                                                                          `node ${loginThenDeleteAccountTestPath}`,
                                                                                                                                                                          (
                                                                                                                                                                            error11_14,
                                                                                                                                                                            stdout11_14,
                                                                                                                                                                            stderr11_14
                                                                                                                                                                          ) => {
                                                                                                                                                                            if (
                                                                                                                                                                              error11_14
                                                                                                                                                                            ) {
                                                                                                                                                                              console.error(
                                                                                                                                                                                `❌ Login Then Delete Account Test failed: ${error11_14.message}`
                                                                                                                                                                              );
                                                                                                                                                                              process.exit(
                                                                                                                                                                                1
                                                                                                                                                                              );
                                                                                                                                                                            }

                                                                                                                                                                            if (
                                                                                                                                                                              stderr11_14
                                                                                                                                                                            ) {
                                                                                                                                                                              console.error(
                                                                                                                                                                                `❌ Login Then Delete Account Test stderr: ${stderr11_14}`
                                                                                                                                                                              );
                                                                                                                                                                              process.exit(
                                                                                                                                                                                1
                                                                                                                                                                              );
                                                                                                                                                                            }

                                                                                                                                                                            console.log(
                                                                                                                                                                              stdout11_14
                                                                                                                                                                            );

                                                                                                                                                                            // Run the check delete account button presence test
                                                                                                                                                                            const checkDeleteAccountButtonPresenceTestPath =
                                                                                                                                                                              path.join(
                                                                                                                                                                                __dirname,
                                                                                                                                                                                "tests",
                                                                                                                                                                                "checkDeleteAccountButtonPresence",
                                                                                                                                                                                "checkDeleteAccountButtonPresence.test.js"
                                                                                                                                                                              );

                                                                                                                                                                            exec(
                                                                                                                                                                              `node ${checkDeleteAccountButtonPresenceTestPath}`,
                                                                                                                                                                              (
                                                                                                                                                                                error11_15,
                                                                                                                                                                                stdout11_15,
                                                                                                                                                                                stderr11_15
                                                                                                                                                                              ) => {
                                                                                                                                                                                if (
                                                                                                                                                                                  error11_15
                                                                                                                                                                                ) {
                                                                                                                                                                                  console.error(
                                                                                                                                                                                    `❌ Check Delete Account Button Presence Test failed: ${error11_15.message}`
                                                                                                                                                                                  );
                                                                                                                                                                                  process.exit(
                                                                                                                                                                                    1
                                                                                                                                                                                  );
                                                                                                                                                                                }

                                                                                                                                                                                if (
                                                                                                                                                                                  stderr11_15
                                                                                                                                                                                ) {
                                                                                                                                                                                  console.error(
                                                                                                                                                                                    `❌ Check Delete Account Button Presence Test stderr: ${stderr11_15}`
                                                                                                                                                                                  );
                                                                                                                                                                                  process.exit(
                                                                                                                                                                                    1
                                                                                                                                                                                  );
                                                                                                                                                                                }

                                                                                                                                                                                console.log(
                                                                                                                                                                                  stdout11_15
                                                                                                                                                                                );

                                                                                                                                                                                // Run the claim business from list test
                                                                                                                                                                                const claimBusinessFromListTestPath =
                                                                                                                                                                                  path.join(
                                                                                                                                                                                    __dirname,
                                                                                                                                                                                    "tests",
                                                                                                                                                                                    "claimBusinessFromList",
                                                                                                                                                                                    "claimBusinessFromList.test.js"
                                                                                                                                                                                  );

                                                                                                                                                                                exec(
                                                                                                                                                                                  `node ${claimBusinessFromListTestPath}`,
                                                                                                                                                                                  (
                                                                                                                                                                                    error11_16,
                                                                                                                                                                                    stdout11_16,
                                                                                                                                                                                    stderr11_16
                                                                                                                                                                                  ) => {
                                                                                                                                                                                    if (
                                                                                                                                                                                      error11_16
                                                                                                                                                                                    ) {
                                                                                                                                                                                      console.error(
                                                                                                                                                                                        `❌ Claim Business From List Test failed: ${error11_16.message}`
                                                                                                                                                                                      );
                                                                                                                                                                                      process.exit(
                                                                                                                                                                                        1
                                                                                                                                                                                      );
                                                                                                                                                                                    }

                                                                                                                                                                                    if (
                                                                                                                                                                                      stderr11_16
                                                                                                                                                                                    ) {
                                                                                                                                                                                      console.error(
                                                                                                                                                                                        `❌ Claim Business From List Test stderr: ${stderr11_16}`
                                                                                                                                                                                      );
                                                                                                                                                                                      process.exit(
                                                                                                                                                                                        1
                                                                                                                                                                                      );
                                                                                                                                                                                    }

                                                                                                                                                                                    console.log(
                                                                                                                                                                                      stdout11_16
                                                                                                                                                                                    );

                                                                                                                                                                                    // Run the edit business info test
                                                                                                                                                                                    const editBusinessInfoTestPath =
                                                                                                                                                                                      path.join(
                                                                                                                                                                                        __dirname,
                                                                                                                                                                                        "tests",
                                                                                                                                                                                        "editBusinessInfo",
                                                                                                                                                                                        "editBusinessInfo.test.js"
                                                                                                                                                                                      );

                                                                                                                                                                                    exec(
                                                                                                                                                                                      `node ${editBusinessInfoTestPath}`,
                                                                                                                                                                                      (
                                                                                                                                                                                        error11_17,
                                                                                                                                                                                        stdout11_17,
                                                                                                                                                                                        stderr11_17
                                                                                                                                                                                      ) => {
                                                                                                                                                                                        if (
                                                                                                                                                                                          error11_17
                                                                                                                                                                                        ) {
                                                                                                                                                                                          console.error(
                                                                                                                                                                                            `❌ Edit Business Info Test failed: ${error11_17.message}`
                                                                                                                                                                                          );
                                                                                                                                                                                          process.exit(
                                                                                                                                                                                            1
                                                                                                                                                                                          );
                                                                                                                                                                                        }

                                                                                                                                                                                        if (
                                                                                                                                                                                          stderr11_17
                                                                                                                                                                                        ) {
                                                                                                                                                                                          console.error(
                                                                                                                                                                                            `❌ Edit Business Info Test stderr: ${stderr11_17}`
                                                                                                                                                                                          );
                                                                                                                                                                                          process.exit(
                                                                                                                                                                                            1
                                                                                                                                                                                          );
                                                                                                                                                                                        }

                                                                                                                                                                                        console.log(
                                                                                                                                                                                          stdout11_17
                                                                                                                                                                                        );

                                                                                                                                                                                        // Run the page not found test
                                                                                                                                                                                        const pageNotFoundTestPath =
                                                                                                                                                                                          path.join(
                                                                                                                                                                                            __dirname,
                                                                                                                                                                                            "tests",
                                                                                                                                                                                            "pageNotFoundTest",
                                                                                                                                                                                            "pageNotFoundTest.test.js"
                                                                                                                                                                                          );

                                                                                                                                                                                        exec(
                                                                                                                                                                                          `node ${pageNotFoundTestPath}`,
                                                                                                                                                                                          (
                                                                                                                                                                                            error12,
                                                                                                                                                                                            stdout12,
                                                                                                                                                                                            stderr12
                                                                                                                                                                                          ) => {
                                                                                                                                                                                            if (
                                                                                                                                                                                              error12
                                                                                                                                                                                            ) {
                                                                                                                                                                                              console.error(
                                                                                                                                                                                                `❌ Page Not Found Test failed: ${error12.message}`
                                                                                                                                                                                              );
                                                                                                                                                                                              process.exit(
                                                                                                                                                                                                1
                                                                                                                                                                                              );
                                                                                                                                                                                            }

                                                                                                                                                                                            if (
                                                                                                                                                                                              stderr12
                                                                                                                                                                                            ) {
                                                                                                                                                                                              console.error(
                                                                                                                                                                                                `❌ Page Not Found Test stderr: ${stderr12}`
                                                                                                                                                                                              );
                                                                                                                                                                                              process.exit(
                                                                                                                                                                                                1
                                                                                                                                                                                              );
                                                                                                                                                                                            }

                                                                                                                                                                                            console.log(
                                                                                                                                                                                              stdout12
                                                                                                                                                                                            );

                                                                                                                                                                                            // Run the user profile page load test
                                                                                                                                                                                            const userProfilePageLoadTestPath =
                                                                                                                                                                                              path.join(
                                                                                                                                                                                                __dirname,
                                                                                                                                                                                                "tests",
                                                                                                                                                                                                "userProfilePageLoad",
                                                                                                                                                                                                "userProfilePageLoad.test.js"
                                                                                                                                                                                              );

                                                                                                                                                                                            exec(
                                                                                                                                                                                              `node ${userProfilePageLoadTestPath}`,
                                                                                                                                                                                              (
                                                                                                                                                                                                error13,
                                                                                                                                                                                                stdout13,
                                                                                                                                                                                                stderr13
                                                                                                                                                                                              ) => {
                                                                                                                                                                                                if (
                                                                                                                                                                                                  error13
                                                                                                                                                                                                ) {
                                                                                                                                                                                                  console.error(
                                                                                                                                                                                                    `❌ User Profile Page Load Test failed: ${error13.message}`
                                                                                                                                                                                                  );
                                                                                                                                                                                                  process.exit(
                                                                                                                                                                                                    1
                                                                                                                                                                                                  );
                                                                                                                                                                                                }

                                                                                                                                                                                                if (
                                                                                                                                                                                                  stderr13
                                                                                                                                                                                                ) {
                                                                                                                                                                                                  console.error(
                                                                                                                                                                                                    `❌ User Profile Page Load Test stderr: ${stderr13}`
                                                                                                                                                                                                  );
                                                                                                                                                                                                  process.exit(
                                                                                                                                                                                                    1
                                                                                                                                                                                                  );
                                                                                                                                                                                                }

                                                                                                                                                                                                console.log(
                                                                                                                                                                                                  stdout13
                                                                                                                                                                                                );

                                                                                                                                                                                                // Run the unauthenticated profile access test
                                                                                                                                                                                                const unauthenticatedProfileAccessTestPath =
                                                                                                                                                                                                  path.join(
                                                                                                                                                                                                    __dirname,
                                                                                                                                                                                                    "tests",
                                                                                                                                                                                                    "unauthenticatedProfileAccess",
                                                                                                                                                                                                    "unauthenticatedProfileAccess.test.js"
                                                                                                                                                                                                  );

                                                                                                                                                                                                exec(
                                                                                                                                                                                                  `node ${unauthenticatedProfileAccessTestPath}`,
                                                                                                                                                                                                  (
                                                                                                                                                                                                    error14,
                                                                                                                                                                                                    stdout14,
                                                                                                                                                                                                    stderr14
                                                                                                                                                                                                  ) => {
                                                                                                                                                                                                    if (
                                                                                                                                                                                                      error14
                                                                                                                                                                                                    ) {
                                                                                                                                                                                                      console.error(
                                                                                                                                                                                                        `❌ Unauthenticated Profile Access Test failed: ${error14.message}`
                                                                                                                                                                                                      );
                                                                                                                                                                                                      process.exit(
                                                                                                                                                                                                        1
                                                                                                                                                                                                      );
                                                                                                                                                                                                    }

                                                                                                                                                                                                    if (
                                                                                                                                                                                                      stderr14
                                                                                                                                                                                                    ) {
                                                                                                                                                                                                      console.error(
                                                                                                                                                                                                        `❌ Unauthenticated Profile Access Test stderr: ${stderr14}`
                                                                                                                                                                                                      );
                                                                                                                                                                                                      process.exit(
                                                                                                                                                                                                        1
                                                                                                                                                                                                      );
                                                                                                                                                                                                    }

                                                                                                                                                                                                    console.log(
                                                                                                                                                                                                      stdout14
                                                                                                                                                                                                    );
                                                                                                                                                                                                    console.log(
                                                                                                                                                                                                      "\n🎉 All tests completed successfully!"
                                                                                                                                                                                                    );
                                                                                                                                                                                                  }
                                                                                                                                                                                                );
                                                                                                                                                                                              }
                                                                                                                                                                                            );
                                                                                                                                                                                          }
                                                                                                                                                                                        );
                                                                                                                                                                                      }
                                                                                                                                                                                    );
                                                                                                                                                                                  }
                                                                                                                                                                                );
                                                                                                                                                                              }
                                                                                                                                                                            );
                                                                                                                                                                          }
                                                                                                                                                                        );
                                                                                                                                                                      }
                                                                                                                                                                    );
                                                                                                                                                                  }
                                                                                                                                                                );
                                                                                                                                                              }
                                                                                                                                                            );
                                                                                                                                                          }
                                                                                                                                                        );
                                                                                                                                                      }
                                                                                                                                                    );
                                                                                                                                                  }
                                                                                                                                                );
                                                                                                                                              }
                                                                                                                                            );
                                                                                                                                          }
                                                                                                                                        );
                                                                                                                                      }
                                                                                                                                    );
                                                                                                                                  }
                                                                                                                                );
                                                                                                                              }
                                                                                                                            );
                                                                                                                          }
                                                                                                                        );
                                                                                                                      }
                                                                                                                    );
                                                                                                                  }
                                                                                                                );
                                                                                                              }
                                                                                                            );
                                                                                                          }
                                                                                                        );
                                                                                                      }
                                                                                                    );
                                                                                                  }
                                                                                                );
                                                                                              }
                                                                                            );
                                                                                          }
                                                                                        );
                                                                                      }
                                                                                    );
                                                                                  }
                                                                                );
                                                                              }
                                                                            );
                                                                          }
                                                                        );
                                                                      }
                                                                    );
                                                                  }
                                                                );
                                                              }
                                                            );
                                                          }
                                                        );
                                                      }
                                                    );
                                                  }
                                                );
                                              }
                                            );
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);
}
);
