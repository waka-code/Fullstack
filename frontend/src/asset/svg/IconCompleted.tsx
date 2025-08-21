import IconButton from '../../../_designSystem/IconButton';

export function IconCompleted({ loading, onclick, isCompleted }: { loading: boolean, onclick: () => void, isCompleted: boolean }) {
 return (
  <IconButton
   onClick={onclick}
   variant="toggle"
   loading={loading}
   aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
   className={`
     w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200
     ${isCompleted
      ? 'bg-green-500 border-green-500 text-white'
      : 'border-gray-300 hover:border-green-400'
     }
     ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
   `}
  >
   <svg
    className="w-3 h-3"
    fill="currentColor"
    viewBox="0 0 20 20"
   >
    <path
     fillRule="evenodd"
     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
     clipRule="evenodd"
    />
   </svg>
  </IconButton>
 )
}
