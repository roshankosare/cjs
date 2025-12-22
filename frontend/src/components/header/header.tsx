import Logo from "../logo";

const Links = [
  {
    id: 1,
    title: "Home",
    link: "/",
  },
  {
    id: 2,
    title: "Problems",
    link: "/problems",
  },
  {
    id: 3,
    title: "DSA Practice",
    link: "/dsa-practice",
  },
];

const Header = () => {
  return (
    <div className=" shadow-sm w-full h-[30]  px-2 sm:px-5 py-2 sm:py-5 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-x-8">
        <Logo size="lg" />

        <div className="hidden sm:flex sm:flex-row self-end  ">
          {Links.map((link) => (
            <a
              key={link.id}
              href={link.link}
              className="mx-4 text-md font-medium text-gray-500 hover:text-blue-500 flex pb-0"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>

      <div className=" sm:flex sm:flex-row self-end  ">
        <a
          href="/signin"
          className="mx-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500 flex"
        >
          Sign In
        </a>
      </div>
    </div>
  );
};

export default Header;
