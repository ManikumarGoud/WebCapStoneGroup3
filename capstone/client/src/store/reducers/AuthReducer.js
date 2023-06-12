export const logoutReducer = (state) => {
  state.isLoggedIn = false;
};

export const loginReducer = (state) => {
  state.isLoggedIn = true;
};
