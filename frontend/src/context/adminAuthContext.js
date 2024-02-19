import { createContext, useEffect, useReducer } from "react";

const storedAdminJSON = localStorage.getItem("admin");

let admin = null;
if (storedAdminJSON !== null) {
  try {
    admin = JSON.parse(storedAdminJSON);
  } catch (error) {
    console.error("Error parsing stored admin JSON:", error);
  }
}

const initialAdminState = {
  admin: admin,
  loading: false,
  error: null,
};

export const AdminAuthContext = createContext(initialAdminState);

const adminAuthReducer = (state, action) => {
    switch (action.type) {
        case "ADMIN_LOGIN_START":
          return {
            admin: null,
            loading: true,
            error: null,
          };
        case "ADMIN_LOGIN_SUCCESS":
          return {
            admin: action.payload,
            loading: false,
            error: null,
          };
        case "ADMIN_LOGIN_FAILURE":
          return {
            admin: null,
            loading: false,
            error: action.payload,
          };
        case "ADMIN_REGISTER_SUCCESS":
          return {
            admin: null,
            loading: false,
            error: null,
          };
        case "ADMIN_LOGOUT":
          return {
            admin: null,
            loading: false,
            error: null,
          };
    
        default:
          return state;
      }
};

export const AdminAuthContextProvider = ({ children }) => {
  const [adminState, adminDispatch] = useReducer(adminAuthReducer, initialAdminState);

  useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(adminState.admin));
  }, [adminState.admin]);

  return (
    <AdminAuthContext.Provider
      value={{
        admin: adminState.admin,
        loading: adminState.loading,
        error: adminState.error,
        adminDispatch,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};