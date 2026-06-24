export const createValidUserPayload = {
  name: "morpheus",
  job: "leader"
};

export const updateValidUserPayload = {
  name: "morpheus",
  job: "zion resident"
};

export const edgeCasePayloads = {
  xssPayload: {
    name: "<script>alert('XSS')</script>",
    job: "hacker"
  },
  invalidTypePayload: {
    name: 12345, // should be string
    job: true    // should be string
  },
  longStringPayload: {
    name: "A".repeat(5000), // Very long string
    job: "qa"
  }
};
