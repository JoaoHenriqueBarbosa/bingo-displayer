import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-between items-start mt-8 w-full">
        <Link href="/">
          <Image
            src="/logo-cecom.png"
            width={301 / 1.5}
            height={171 / 1.5}
            alt="Logo"
          />
        </Link>
        <h1 className="title">III BINGO CECOM</h1>
      </div>
    </div>
  );
}
