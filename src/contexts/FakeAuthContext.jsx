import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialValues = {
  user: null,
  isAuthenticated: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    case "wrong/credentials":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: "Wrong credentials, please try again!",
      };

    default:
      throw new Error("Unknown action type!");
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error }, dispatch] = useReducer(
    reducer,
    initialValues
  );
  function handleLogin(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
    else dispatch({ type: "wrong/credentials" });
  }

  function handleLogout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        handleLogin,
        handleLogout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth is used outside of its area range");
  return context;
}

export { AuthProvider, useAuth };
