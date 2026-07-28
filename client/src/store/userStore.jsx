import { useState, useEffect } from "react";

const getStoredUser = () => {
  try {
    const data = localStorage.getItem("user-storage");
    if (!data) return { id: "", name: "", role: "", email: "" };
    const parsed = JSON.parse(data);
    return parsed.state || parsed || { id: "", name: "", role: "", email: "" };
  } catch {
    return { id: "", name: "", role: "", email: "" };
  }
};

let listeners = [];
let currentUser = getStoredUser();

const setUserState = (newUser) => {
  currentUser = { ...currentUser, ...newUser };
  localStorage.setItem("user-storage", JSON.stringify({ state: currentUser }));
  listeners.forEach((l) => l(currentUser));
};

const clearUserState = () => {
  currentUser = { id: "", name: "", role: "", email: "" };
  localStorage.removeItem("user-storage");
  listeners.forEach((l) => l(currentUser));
};

export const useUserStore = (selector) => {
  const [state, setState] = useState(currentUser);

  useEffect(() => {
    const handleChange = (newVal) => setState(newVal);
    listeners.push(handleChange);
    return () => {
      listeners = listeners.filter((l) => l !== handleChange);
    };
  }, []);

  const store = {
    user: state,
    ...state,
    id: state.id || state._id || "",
    name: state.name || state.username || "",
    role: state.role || "",
    email: state.email || "",
    setUser: setUserState,
    clearUser: clearUserState,
  };

  return typeof selector === "function" ? selector(store) : store;
};
