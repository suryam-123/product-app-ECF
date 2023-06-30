"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          // expiresInMins: 60, // optional
        }),
      });
      const data = await response.json();

      if (data.token) {
        // setMessage("Login successful!");
        // Redirect to another page or perform other actions
        router.push("/products?page=recent");
        // ...
      } else {
        setMessage("Invalid username or password");
        // Clear the form
        setUsername("");
        setPassword("");
        // ...
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      // Clear the form
      setUsername("");
      setPassword("");
      // ...
    }
  };
  return (
    <main>
      <div className={styles.logincontainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <span className={styles.signup}>Log in</span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            className={styles.forminput}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className={styles.forminput}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className={styles.formsubmit}>Login</button>
        </form>
        <div className={styles.loginmessage}>{message}</div>
      </div>
    </main>
  );
}
