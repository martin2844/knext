import { auth } from "@/auth";
import Home from "@/components/pages/Home/Home";

const HomePage = async () => {
  // Always check session in page.tsx files
  // Always do data fetching in page.tsx files
  // Pass data to the component as props
  const session = await auth();
  return (
    <Home session={session} />
  );
};

export default HomePage;
