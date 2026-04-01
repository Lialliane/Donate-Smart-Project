import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import CaseDetailSkeleton from '../../Skeleton/CaseDetail/CaseDetailSkeleton'

const NamesList = () => {

  // dummy cases
  const caseDetail = [
  {
    caseType: 'Medical',
    imageSrc: '/images/cases/hospital.svg',
    description: 'Immediate support for families facing urgent medical or living challenges.',
    progress: '40',
    category: 'emergency_aid',
  },
  {
    caseType: 'Schools and Collges',
    imageSrc: '/images/cases/school.svg',
    description: 'Help provide school supplies and learning opportunities for children.',
    progress: '21',
    category: 'education',
  },
  {
    caseType: 'Infastructure',
    imageSrc: '/images/cases/community.svg',
    description: 'Funding a local initiative to improve safety, infrastructure, or access to essentials.',
    progress: '60',
    category: 'community',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '99',
    category: 'emergency_aid',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '89',
    category: 'education',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '89',
    category: 'education',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '68',
    category: 'education',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '66',
    category: 'education',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '99',
    category: 'community',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '99',
    category: 'community',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '99',
    category: 'community',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '89',
    category: 'community',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '21',
    category: 'environment',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '29',
    category: 'environment',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '99',
    category: 'environment',
  },
  {
    caseType: 'type',
    imageSrc: 'https://placehold.co/700/svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    progress: '58',
    category: 'environment',
  },
  ]
  const [loading, setLoading] = useState(true)

  const [selectedButton, setSelectedButton] = useState('emergency_aid')
  const education = caseDetail.filter(
    (name) => name.category === 'education'
  )
  const emergency_aid = caseDetail.filter(
    (name) => name.category === 'emergency_aid'
  )
  const community = caseDetail.filter(
    (name) => name.category === 'community'
  )
  const environment = caseDetail.filter(
    (name) => name.category === 'environment'
  )

  let selectedNames = []
  if (selectedButton === 'education') {
    selectedNames = education
  } else if (selectedButton === 'emergency_aid') {
    selectedNames = emergency_aid
  } else if (selectedButton === 'community') {
    selectedNames = community
  } else if (selectedButton === 'environment') {
    selectedNames = environment
  }

  useEffect(() => {
    setLoading(false);
  }, [])
  const nameElements = selectedNames.map((name, index) => (
    <div id='Cases' key={index} className='shadow-lg rounded-xl group flex'>
      <div className='py-5 lg:py-0 flex flex-col'>
        <div className='overflow-hidden rounded-lg bg-gray-100'>
          <img
            src={name.imageSrc}
            alt={name.caseType}
            width={700}
            height={700}
            className='h-full w-full object-cover object-center group-hover:scale-125 transition duration-300 ease-in-out'
          />
        </div>
        <div className='p-4 flex flex-col justify-between gap-5 flex-1'>
          <div className="flex flex-col gap-5">
            <div className='flex items-center justify-between'>
              <p className='block font-normal text-gray-900'>{name.caseType}</p>
              <div className='block text-lg font-semibold text-success border-solid border-2 border-success rounded-md px-1'>
                <p>{name.progress}%</p>
              </div>
            </div>
            <a href={'/'}>
              <p
                aria-hidden='true'
                className='text-xl font-semibold group-hover:text-primary group-hover:cursor-pointer'>
                {name.description}
              </p>
            </a>
          </div>
          {/* <div className='flex justify-between border-solid border-2 rounded-md p-2'>
            <p>lorem ipsum</p>
            <div className='flex flex-row space-x-4'>
              <div className='flex'>
                <img
                  src={'/images/cases/account.svg'}
                  width={18}
                  height={20}
                  alt='circle'
                />
                <p className='text-lightgrey ml-1'>120</p>
              </div>
              <div className='flex'>
                <img
                  src={'/images/cases/Star.svg'}
                  width={18}
                  height={20}
                  alt='star'
                />
                <p className='ml-1'>0</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  ))

  return (
    <section id='cases-section'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-5 mb-4'>
          <h2 className='font-bold tracking-tight'>Causes You Can Support Today</h2>
          <div>
            <button className='bg-transparent cursor-pointer hover:bg-primary text-primary font-medium hover:text-white py-3 px-4 border border-primary hover:border-transparent rounded-sm duration-300'>
              Explore Cases
            </button>
          </div>
        </div>
        <div className='flex nowhitespace space-x-5 rounded-xl bg-white p-1 overflow-x-auto mb-4'>
          {/* FOR DESKTOP VIEW */}
          <button
            onClick={() => setSelectedButton('emergency_aid')}
            className={
              'bg-white' +
              (selectedButton === 'emergency_aid'
                ? 'text-black border-b-2 border-yellow-200'
                : 'text-black/40') +
              ' pb-2 text-lg hidden sm:block hover:cursor-pointer'
            }>
            Emergency Aid
          </button>
          <button
            onClick={() => setSelectedButton('education')}
            className={
              'bg-white ' +
              (selectedButton === 'education'
                ? 'text-black border-b-2 border-yellow-200'
                : 'text-black/40') +
              ' pb-2 text-lg hidden sm:block hover:cursor-pointer'
            }>
            Education
          </button>
          <button
            onClick={() => setSelectedButton('community')}
            className={
              'bg-white ' +
              (selectedButton === 'community'
                ? 'text-black border-b-2 border-yellow-200'
                : 'text-black/40') +
              ' pb-2 text-lg hidden sm:block hover:cursor-pointer'
            }>
            Community
          </button>
          <button
            onClick={() => setSelectedButton('environment')}
            className={
              'bg-white ' +
              (selectedButton === 'environment'
                ? 'text-black border-b-2 border-yellow-200'
                : 'text-black/40') +
              ' pb-2 text-lg hidden sm:block hover:cursor-pointer'
            }>
            Environment
          </button>

          {/* FOR MOBILE VIEW */}
          <Icon
            icon='solar:hospital-bold-duotone'
            onClick={() => setSelectedButton('emergency_aid')}
            className={
              'text-5xl sm:hidden block ' +
              (selectedButton === 'emergency_aid'
                ? 'border-b-2 border-yellow-200'
                : 'text-gray-400')
            }
          />

          <Icon
            icon='solar:notebook-bookmark-bold-duotone'
            onClick={() => setSelectedButton('education')}
            className={
              'text-5xl sm:hidden block ' +
              (selectedButton === 'education'
                ? 'border-b-2 border-yellow-200'
                : 'text-gray-400')
            }
          />

          <Icon
            icon='solar:users-group-two-rounded-bold'
            onClick={() => setSelectedButton('community')}
            className={
              'text-5xl sm:hidden block ' +
              (selectedButton === 'community'
                ? 'border-b-2 border-yellow-200'
                : 'text-gray-400')
            }
          />

          <Icon
            icon='solar:earth-bold-duotone'
            onClick={() => setSelectedButton('environment')}
            className={
              'text-5xl sm:hidden block ' +
              (selectedButton === 'environment'
                ? 'border-b-2 border-yellow-200'
                : 'text-gray-400')
            }
          />
        </div>
        <div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start'>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CaseDetailSkeleton key={i} />
              ))
            ) : nameElements.length > 0 ? (
              nameElements
            ) : (
              <p>No data to show</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NamesList
