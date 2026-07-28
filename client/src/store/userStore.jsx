import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      id: "",
      name: "",
      role: "",
      email: "",
      setUser: ({ id, userId, name, role, email }) =>
        set({ id: id || userId || "", name, role, email }),
      clearUser: () => set({ id: "", name: "", role: "", email: "" }),
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);

