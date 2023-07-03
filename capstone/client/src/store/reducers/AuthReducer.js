export const logoutReducer = (state) => {
  state.isLoggedIn = false;
};

export const loginReducer = (state) => {
  console.log("in reducer");
  state.isLoggedIn = true;
};
