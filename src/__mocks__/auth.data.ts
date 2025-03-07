// test purpose only
export const authMocks = {
  register: {
    correct: {
      email: "test@mail.com",
      password: "12345678",
      username: "pepito",
    },
    badEmail: {
      email: "test",
      password: "12345678",
      username: "pepito",
    },
    badPasswordLengthLessThan8: {
      email: "test@mail.com",
      password: "1234567",
      username: "pepito",
    },
    badPasswordLengthHigherThan32: {
      email: "test@mail.com",
      password: "1234567890123456789012345678901234567",
      username: "pepito",
    },
    badUsernameLengthLessThan3: {
      email: "test@mail.com",
      password: "12345678",
      username: "pe",
    },
    badUsernameLengthHigherThan64: {
      email: "test@mail.com",
      password: "12345678",
      username:
        "pepitopepitopepitopepitopepitopepitopepitopepitopepitopepitopepitopepito",
    },
  },
  login: {
    notExistsEmail: {
      email: "test1@mail.com",
      password: "12345678",
    },
    existsButWrongPassword: {
      email: "test@mail.com",
      password: "87654321",
    },
    correct: {
      email: "test@mail.com",
      password: "12345678",
    },
    badEmail: {
      email: "test",
      password: "12345678",
    },
    badPasswordLengthLessThan8: {
      email: "test@mail.com",
      password: "1234567",
    },
    badPasswordLengthHigherThan32: {
      email: "test@mail.com",
      password: "1234567890123456789012345678901234567",
    },
  },
  refresh: {
    correct: {
      email: "refresh@mail.com",
      password: "12345678",
      username: "pepito2",
    },
  },
  authRefreshAndClose: {
    signupCorrect: {
      email: "signuprefreshandclose@mail.com",
      password: "12121212",
      username: "test123",
    },
    loginCorrect: {
      email: "signuprefreshandclose@mail.com",
      password: "12121212",
    },
  },
  authCreateAndDelete: {
    createCorrect: {
      email: "createanddelete@mail.com",
      password: "12121212",
      username: "deleted123",
    },
  },
};
