export const login = (email, password) => {
    // Giả lập đăng nhập, thay bằng API thực tế
    if (email === "admin@spa.com" && password === "password") {
      return { role: "admin" };
    }
    return null;
  };