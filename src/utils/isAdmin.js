import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function isAdmin(user) {
  if (!user) return false;

  try {
    console.log("Checking admin for:", user.uid);
    console.log("Expected admin UID:", "bkYrX2tYJQT1v9Wp9vdkA41yyW33");

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    console.log("Admin document exists:", userSnap.exists());
    console.log("Admin document data:", userSnap.data());

    if (!userSnap.exists()) {
      return false;
    }

    return userSnap.data().role === "admin";
  } catch (error) {
    console.error("Failed to check admin role:", error);
    return false;
  }
}
