export default function Logo({ light = false, showText = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CC0000]">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 20L24 9L38 20"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 21V36H35V21"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 36V26H28V36"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M18 15C16 12 19 10 18 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M25 14C23 11 26 9 25 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <p
            className={`text-xl font-extrabold tracking-tight ${
              light ? 'text-white' : 'text-[#292524]'
            }`}
          >
            Kantin
            <span className={light ? 'text-white' : 'text-[#CC0000]'}>
              Kita
            </span>
          </p>

          <p
            className={`mt-0.5 text-[10px] font-medium tracking-[0.15em] ${
              light ? 'text-red-100' : 'text-gray-500'
            }`}
          >
            PESAN MUDAH, MAKAN NYAMAN
          </p>
        </div>
      )}
    </div>
  )
}