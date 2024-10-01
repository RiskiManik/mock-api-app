import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <header className="fixed left-1/2 top-0 z-50 mx-auto flex h-16 w-full -translate-x-1/2 items-center justify-between px-16 lg:max-w-[1280px] xl:max-w-[1440px]">
      <h1 className="text-2xl font-semibold drop-shadow">NoWaitAPI</h1>
      <Button variant={"outline"} className="shadow-md">
        Login
      </Button>
    </header>
  );
};

export default Navbar;
