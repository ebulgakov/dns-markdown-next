const currentUser = null;
const defValue = {
  Schema: class Schema {},
  models: {
    User: class User {}
  }
};

const auth = async () => {
  return {
    getToken: async () => "mock-token",
    userId: "mock-user-id"
  };
};

export { currentUser, auth, defValue as default };
