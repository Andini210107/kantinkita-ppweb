export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
}) {
  const variants = {
    primary: 'bg-[#CC0000] text-white hover:bg-[#A80000]',
    secondary: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
    outline: 'border border-[#CC0000] text-[#CC0000] hover:bg-red-50',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}