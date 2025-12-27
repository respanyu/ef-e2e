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

        // Run the add business test
        const addBusinessTestPath = path.join(
          __dirname,
          "tests",
          "addBusiness",
          "addBusiness.test.js"
        );

        exec(`node ${addBusinessTestPath}`, (error2, stdout2, stderr2) => {
          if (error2) {
            console.error(`❌ Add Business Test failed: ${error2.message}`);
            process.exit(1);
          }

          if (stderr2) {
            console.error(`❌ Add Business Test stderr: ${stderr2}`);
            process.exit(1);
          }

          console.log(stdout2);

          // Run the login test
          const loginTestPath = path.join(
            __dirname,
            "tests",
            "login",
            "login.test.js"
          );

          exec(`node ${loginTestPath}`, (error3, stdout3, stderr3) => {
            if (error3) {
              console.error(`❌ Login Test failed: ${error3.message}`);
              process.exit(1);
            }

            if (stderr3) {
              console.error(`❌ Login Test stderr: ${stderr3}`);
              process.exit(1);
            }

            console.log(stdout3);

            // Run the logout test
            const logoutTestPath = path.join(
              __dirname,
              "tests",
              "logout",
              "logout.test.js"
            );

            exec(`node ${logoutTestPath}`, (error3_5, stdout3_5, stderr3_5) => {
              if (error3_5) {
                console.error(`❌ Logout Test failed: ${error3_5.message}`);
                process.exit(1);
              }

              if (stderr3_5) {
                console.error(`❌ Logout Test stderr: ${stderr3_5}`);
                process.exit(1);
              }

              console.log(stdout3_5);

              // Run the login then add business test
              const loginThenAddBusinessTestPath = path.join(
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
                  const loginThenCheckBusinessTestPath = path.join(
                    __dirname,
                    "tests",
                    "loginThenCheckBusiness",
                    "loginThenCheckBusiness.test.js"
                  );

                  exec(
                    `node ${loginThenCheckBusinessTestPath}`,
                    (error3_7, stdout3_7, stderr3_7) => {
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
                      const registerTestPath = path.join(
                        __dirname,
                        "tests",
                        "register",
                        "register.test.js"
                      );

                      exec(
                        `node ${registerTestPath}`,
                        (error4, stdout4, stderr4) => {
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

                          // Run the activate user test
                          const activateUserTestPath = path.join(
                            __dirname,
                            "tests",
                            "activateUser",
                            "activateUser.test.js"
                          );

                          exec(
                            `node ${activateUserTestPath}`,
                            (error4_5, stdout4_5, stderr4_5) => {
                              if (error4_5) {
                                console.error(
                                  `❌ Activate User Test failed: ${error4_5.message}`
                                );
                                process.exit(1);
                              }

                              if (stderr4_5) {
                                console.error(
                                  `❌ Activate User Test stderr: ${stderr4_5}`
                                );
                                process.exit(1);
                              }

                              console.log(stdout4_5);

                              // Run the password reset test
                              const passwordResetTestPath = path.join(
                                __dirname,
                                "tests",
                                "passwordReset",
                                "passwordReset.test.js"
                              );

                              exec(
                                `node ${passwordResetTestPath}`,
                                (error4_5, stdout4_5, stderr4_5) => {
                                  if (error4_5) {
                                    console.error(
                                      `❌ Password Reset Test failed: ${error4_5.message}`
                                    );
                                    process.exit(1);
                                  }

                                  if (stderr4_5) {
                                    console.error(
                                      `❌ Password Reset Test stderr: ${stderr4_5}`
                                    );
                                    process.exit(1);
                                  }

                                  console.log(stdout4_5);

                                  // Run the header test
                                  const headerTestPath = path.join(
                                    __dirname,
                                    "tests",
                                    "header",
                                    "header.test.js"
                                  );

                                  exec(
                                    `node ${headerTestPath}`,
                                    (error5, stdout5, stderr5) => {
                                      if (error5) {
                                        console.error(
                                          `❌ Header Test failed: ${error5.message}`
                                        );
                                        process.exit(1);
                                      }

                                      if (stderr5) {
                                        console.error(
                                          `❌ Header Test stderr: ${stderr5}`
                                        );
                                        process.exit(1);
                                      }

                                      console.log(stdout5);

                                      // Run the footer test
                                      const footerTestPath = path.join(
                                        __dirname,
                                        "tests",
                                        "footer",
                                        "footer.test.js"
                                      );

                                      exec(
                                        `node ${footerTestPath}`,
                                        (error6, stdout6, stderr6) => {
                                          if (error6) {
                                            console.error(
                                              `❌ Footer Test failed: ${error6.message}`
                                            );
                                            process.exit(1);
                                          }

                                          if (stderr6) {
                                            console.error(
                                              `❌ Footer Test stderr: ${stderr6}`
                                            );
                                            process.exit(1);
                                          }

                                          console.log(stdout6);

                                          // Run the footer links test
                                          const footerLinksTestPath = path.join(
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
                                              if (error6_5) {
                                                console.error(
                                                  `❌ Footer Links Test failed: ${error6_5.message}`
                                                );
                                                process.exit(1);
                                              }

                                              if (stderr6_5) {
                                                console.error(
                                                  `❌ Footer Links Test stderr: ${stderr6_5}`
                                                );
                                                process.exit(1);
                                              }

                                              console.log(stdout6_5);

                                              // Run the about test
                                              const aboutTestPath = path.join(
                                                __dirname,
                                                "tests",
                                                "about",
                                                "about.test.js"
                                              );

                                              exec(
                                                `node ${aboutTestPath}`,
                                                (error7, stdout7, stderr7) => {
                                                  if (error7) {
                                                    console.error(
                                                      `❌ About Test failed: ${error7.message}`
                                                    );
                                                    process.exit(1);
                                                  }

                                                  if (stderr7) {
                                                    console.error(
                                                      `❌ About Test stderr: ${stderr7}`
                                                    );
                                                    process.exit(1);
                                                  }

                                                  console.log(stdout7);

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
                                                      if (error7_5) {
                                                        console.error(
                                                          `❌ Categories Page Load Test failed: ${error7_5.message}`
                                                        );
                                                        process.exit(1);
                                                      }

                                                      if (stderr7_5) {
                                                        console.error(
                                                          `❌ Categories Page Load Test stderr: ${stderr7_5}`
                                                        );
                                                        process.exit(1);
                                                      }

                                                      console.log(stdout7_5);

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
                                                          if (error8) {
                                                            console.error(
                                                              `❌ Categories Test failed: ${error8.message}`
                                                            );
                                                            process.exit(1);
                                                          }

                                                          if (stderr8) {
                                                            console.error(
                                                              `❌ Categories Test stderr: ${stderr8}`
                                                            );
                                                            process.exit(1);
                                                          }

                                                          console.log(stdout8);

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
                                                              if (error8_5) {
                                                                console.error(
                                                                  `❌ Category Navigation Test failed: ${error8_5.message}`
                                                                );
                                                                process.exit(1);
                                                              }

                                                              if (stderr8_5) {
                                                                console.error(
                                                                  `❌ Category Navigation Test stderr: ${stderr8_5}`
                                                                );
                                                                process.exit(1);
                                                              }

                                                              console.log(
                                                                stdout8_5
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
                                                                  if (error9) {
                                                                    console.error(
                                                                      `❌ Search Test failed: ${error9.message}`
                                                                    );
                                                                    process.exit(
                                                                      1
                                                                    );
                                                                  }

                                                                  if (stderr9) {
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
            });
          });
        });
      }
    );
  });
});
