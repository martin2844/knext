import { auth } from "@/auth";

import Link from "next/link";
const HomePage = async () => {
  const session = await auth();
  return (
    <div>
      <h1>Hello</h1>
      {!session && <Link href="/api/auth/signin">Sign In</Link>}
      {session && <p>{session?.user?.name}</p>}
    </div>
  );
};

export default HomePage;
