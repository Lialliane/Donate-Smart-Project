import { Icon } from '@iconify/react/dist/iconify.js'

const FooterOld = () => {
  const footerlink = [
  {
    section: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Cases', href: '/cases' },
      { label: 'Testimonial', href: '/#testimonial-section' },
      { label: 'Join', href: '/#join-section' },
      { label: 'Contact Us', href: '/#contact' },
    ],
  },
  {
    section: 'Support',
    links: [
      { label: 'Help center', href: '/' },
      { label: 'Terms of service', href: '/' },
      { label: 'Legal', href: '/' },
      { label: 'Privacy Policy', href: '/' },
      { label: 'Status', href: '/' },
    ],
  },
  ]

  return (
    <footer className='bg-[var(--color-primary)]' id='first-section'>
      <div className='container pt-12 pb-10'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-16 xl:gap-8'>
          <div className='col-span-4 flex flex-col gap-5'>
            <div>
              <img
                src='/images/logo/logo2.svg'
                alt='Logo'
                width={48}
                height={64}
              />
            </div>
            <p className='text-white text-lg font-medium leading-7'>
              {' '}
              Your kindness can change someone's <br /> tomorrow.{' '}
            </p>
            <div className='flex gap-4'>
              <a
                href='/'
                className='bg-white/20 rounded-full p-2 text-white hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)] duration-300'>
                <Icon
                  icon='tabler:brand-instagram'
                  className='text-2xl inline-block'
                />
              </a>
              <a
                href='/'
                className='bg-white/20 rounded-full p-2 text-white hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)] duration-300'>
                <Icon
                  icon='tabler:brand-dribbble'
                  className='text-2xl inline-block'
                />
              </a>
              <a
                href='/'
                className='bg-white/20 rounded-full p-2 text-white hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)] duration-300'>
                <Icon
                  icon='tabler:brand-twitter-filled'
                  className='text-2xl inline-block'
                />
              </a>
              <a
                href='/'
                className='bg-white/20 rounded-full p-2 text-white hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)] duration-300'>
                <Icon
                  icon='tabler:brand-youtube-filled'
                  className='text-2xl inline-block'
                />
              </a>
            </div>
          </div>

          {/* CLOUMN-2/3 */}
          <div className='col-span-4'>
            <div className='flex gap-20'>
              {footerlink.map((product, i) => (
                <div key={i} className='group relative col-span-2'>
                  <p className='text-white text-xl font-semibold mb-9'>
                    {product.section}
                  </p>
                  <ul>
                    {product.links.map((item, i) => (
                      <li key={i} className='mb-3'>
                        <a
                          href={item.href}
                          className='text-white/60 hover:text-white text-sm font-normal mb-6'>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {/* CLOUMN-4 */}

          <div className='col-span-4'>
            <h3 className='text-white text-xl font-semibold mb-6'>
              Stay up to date
            </h3>
            <div className='relative text-white focus-within:text-white flex flex-row-reverse w-[50%] lg:w-full'>
              <input
                type='Email address'
                name='q'
                className='py-4 text-sm w-full text-white bg-white/15 rounded-md pl-4 focus:outline-hidden placeholder:text-white focus:text-white'
                placeholder='Your email address'
                autoComplete='off'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
                <button
                  type='submit'
                  className='p-1 focus:outline-hidden focus:shadow-outline'>
                  <Icon
                    icon='tabler:send'
                    className='text-white text-2xl inline-block me-2'
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterOld
