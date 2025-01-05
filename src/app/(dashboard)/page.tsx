import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        src="/imgs/home.png"
        width={750}
        height={750}
        alt="Picture of the author"
        className="rounded-full aspect-square object-cover transition-transform duration-500 hover:rotate-3"
      />
      <h1 className="text-5xl font-bold my-5">SECOND BRAIN</h1>
      <p className="text-black-700 dark:text-gray-700 text-center">
        Welcome to your second brain. A place to store all your thoughts and
        financial data.
      </p>
    </div>
  );
}
