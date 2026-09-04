

function Footer() {
  return (
    <footer className="flex flex-col justify-center md:flex-row ">
      <div className="py-5 text-sm font-bold text-slate-500">
        <p className="flex flex-col items-center justify-center pl-16 md:gap-2 md:flex-row">
          cre@ted by b@yu4lex@ndr!4 - liked
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Bayu Wardana
        </p>
      </div>
    </footer>
  );
}

export default Footer