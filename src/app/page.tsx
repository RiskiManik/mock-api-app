import dynamic from "next/dynamic";

const HomeApp = dynamic(() => import("@/features/home"), { ssr: false });
const Home = () => {
  return (
    <div>
      <HomeApp />
    </div>
  );
};

export default Home;
