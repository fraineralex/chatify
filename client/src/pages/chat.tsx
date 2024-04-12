//import { io } from 'socket.io-client'

export function Chat () {
  //const socket = io('http://localhost:3000')
  return (
    <section className='grid grid-cols-4 h-screen border rounded-lg overflow-hidden font-sans'>
      <div className='flex flex-col border-r'>
        <nav className='p-4 space-y-4'>
          <ul className='space-y-4'>
            <li className='flex items-center space-x-2'>
              <img
                src='/frainer.jpeg'
                width='36'
                height='36'
                alt='Chat avatar'
                className='rounded-full'
                style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
              />
              <div className='grid grid-cols-6'>
                <div className='col-span-5'>
                  <h2 className='text-base font-bold'>Frainer</h2>
                  <p className='text-sm text-gray-500'>Last message here</p>
                </div>
                <div>
                  <small className='text-xs text-gray-500'>10:07 AM</small>
                  <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full ms-8'>
                    1
                  </span>
                </div>
              </div>
            </li>
            <li className='flex items-center space-x-2'>
              <img
                src='/placeholder.svg'
                width='36'
                height='36'
                alt='Chat avatar'
                className='rounded-full'
                style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
              />
              <div className='grid grid-cols-6'>
                <div className='col-span-5'>
                  <h2 className='text-base font-bold'>Chat 2</h2>
                  <p className='text-sm text-gray-500'>Last message here</p>
                </div>
                <div>
                  <small className='text-xs text-gray-500'>10:00 AM</small>
                  <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full ms-8'>
                    8
                  </span>
                </div>
              </div>
            </li>
            <li className='flex items-center space-x-2'>
              <img
                src='/placeholder.svg'
                width='36'
                height='36'
                alt='Chat avatar'
                className='rounded-full'
                style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
              />
              <div className='grid grid-cols-6'>
                <div className='col-span-5'>
                  <h2 className='text-base font-bold'>Chat 3</h2>
                  <p className='text-sm text-gray-500'>Last message here</p>
                </div>
                <div>
                  <small className='text-xs text-gray-500'>09:07 AM</small>
                  <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full ms-8'>
                    5
                  </span>
                </div>
              </div>
            </li>
            <li className='flex items-center space-x-2'>
              <img
                src='/placeholder.svg'
                width='36'
                height='36'
                alt='Chat avatar'
                className='rounded-full'
                style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
              />
              <div className='grid grid-cols-6'>
                <div className='col-span-5'>
                  <h2 className='text-base font-bold'>Chat 4</h2>
                  <p className='text-sm text-gray-500'>Last message here</p>
                </div>
                <div>
                  <small className='text-xs text-gray-500'>08:07 AM</small>
                  <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full ms-8'>
                    6
                  </span>
                </div>
              </div>
            </li>
            <li className='flex items-center space-x-2'>
              <img
                src='/placeholder.svg'
                width='36'
                height='36'
                alt='Chat avatar'
                className='rounded-full'
                style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
              />
              <div className='grid grid-cols-6'>
                <div className='col-span-5'>
                  <h2 className='text-base font-bold'>Chat 5</h2>
                  <p className='text-sm text-gray-500'>Last message here</p>
                </div>
                <div>
                  <small className='text-xs text-gray-500'>07:07 AM</small>
                  <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full ms-8'>
                    3
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div className='flex flex-col p-4 border-b col-span-3'>
        <div className='flex gap-2'>
          <img
            src='/frainer.jpeg'
            width='40'
            height='40'
            alt='Contact avatar'
            className='rounded-full'
            style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
          />
          <h2 className='text-base font-bold my-auto'>Frainer</h2>
        </div>
        <div className='flex-1 p-4 space-y-4 overflow-auto'>
          <div className='flex flex-col items-end space-y-2'>
            <div className='flex items-center space-x-2 rounded-lg bg-gray-300 p-4'>
              <p className='text-sm w-100'>
                Hey! What's up? Did you see the new Star Wars trailer?
              </p>
              <img
                src='/placeholder.svg'
                width='32'
                height='32'
                alt='Your avatar'
                className='rounded-full'
                style={{ aspectRatio: 32 / 32, objectFit: 'cover' }}
              />
            </div>
            <p className='text-xs text-gray-500'>10:01 AM</p>
          </div>
          <div className='flex flex-col items-start space-y-2'>
            <div className='flex items-center space-x-2 rounded-lg bg-gray-100 p-4'>
              <img
                src='/placeholder.svg'
                width='32'
                height='32'
                alt='Contact avatar'
                className='rounded-full'
                style={{ aspectRatio: 32 / 32, objectFit: 'cover' }}
              />
              <p className='text-sm w-100'>
                Yeah! I'm good. And yes, I did. It looks amazing! I can't wait
                to see it.
              </p>
            </div>
            <p className='text-xs text-gray-500'>10:03 AM</p>
          </div>
          <div className='flex flex-col items-end space-y-2'>
            <div className='flex items-center space-x-2 rounded-lg bg-gray-300 p-4'>
              <p className='text-sm w-100'>
                I know, right? It's going to be epic. We should totally watch it
                together when it comes out.
              </p>
              <img
                src='/placeholder.svg'
                width='32'
                height='32'
                alt='Your avatar'
                className='rounded-full'
                style={{ aspectRatio: 32 / 32, objectFit: 'cover' }}
              />
            </div>
            <p className='text-xs text-gray-500'>10:05 AM</p>
          </div>
          <div className='flex flex-col items-start space-y-2'>
            <div className='flex items-center space-x-2 rounded-lg bg-gray-100 p-4'>
              <img
                src='/placeholder.svg'
                width='32'
                height='32'
                alt='Contact avatar'
                className='rounded-full'
                style={{ aspectRatio: 32 / 32, objectFit: 'cover' }}
              />
              <p className='text-sm w-100'>Definitely! It's a date.</p>
            </div>
            <p className='text-xs text-gray-500'>10:07 AM</p>
          </div>
        </div>
        <div className='flex items-center p-2 border-t w-full'>
          <button className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-4 h-4'
            >
              <circle cx='12' cy='12' r='10'></circle>
              <path d='M8 14s1.5 2 4 2 4-2 4-2'></path>
              <line x1='9' x2='9.01' y1='9' y2='9'></line>
              <line x1='15' x2='15.01' y1='9' y2='9'></line>
            </svg>
            <span className='sr-only'>Insert emoji</span>
          </button>
          <button className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full mx-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-4 h-4'
            >
              <path d='m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48'></path>
            </svg>
            <span className='sr-only'>Attach file</span>
          </button>
          <input
            className='flex h-10 w-full border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-full border-0 flex-1'
            placeholder='Type a message'
          />
          <button className='ms-2 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full w-6 h-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              className='w-5 h-5'
            >
              <path d='m22 2-7 20-4-9-9-4Z'></path>
              <path d='M22 2 11 13'></path>
            </svg>
            <span className='sr-only'>Send</span>
          </button>
        </div>
      </div>
    </section>
  )
}
