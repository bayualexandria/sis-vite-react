function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center border-t border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 md:flex-row">
      <div className="py-5 text-sm font-bold text-slate-500 dark:text-slate-400">
        <p className="flex flex-col items-center justify-center gap-1 md:flex-row md:gap-2">
          <span>cre@ted by b@yu4lex@ndr!4 - liked</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364l-1.318 1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>

          <span className="text-slate-600 dark:text-slate-300">
            Bayu Wardana
          </span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
