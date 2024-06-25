import { Clock, User } from "lucide-react";

export default function ChatSkeleton() {
  return (
    <li className='flex items-center space-x-2 border border-transparent cursor-pointer px-2 py-2 w-full group rounded-sm animate-pulse border-b-gray-300'>
      <figure className='flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full place-content-center'><User className="flex m-auto h-10 w-10 text-gray-400" /></figure>

      <article className='items-center text-left w-full overflow-hidden'>
        <div className='flex text-left flex-grow w-full justify-between'>
          <h2 className='text-base font-medium inline-flex items-center capitalize h-3 rounded-xl w-44 bg-gray-100'></h2>
          <span className='text-xs text-gray-500 text-right inline-flex mt-1 bg-gray-100/80 h-2 w-14 rounded-xl'></span>
        </div>
        <span className="flex justify-between">
          <span className="flex">
            <Clock className="w-3 h-3 text-gray-100 mt-[9px] me-1" />
            <p className="mt-3 bg-gray-100/90 h-2 w-36 rounded-xl"></p>
          </span>
          <p className="mt-2 bg-gray-100/90 h-5 w-5 rounded-full me-2"></p>
        </span>
      </article>
    </li>
  )
}