import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import TestimonialSkeleton from '../../Skeleton/Testimonial/TestimonialSkeleton'

// CAROUSEL SETTINGS

const Testimonial = () => {
  const [loading, setLoading] = useState(true)

  const testimonial = [
  {
    profession: 'Verified Donor',
    name: 'Andrew W. Dubai',
    imgSrc: '/images/testimonial/user-1.jpg',
    detail:
      "I appreciate how transparent everything is. It feels good to know exactly where my donation is going and who it’s helping.",
  },
  {
    profession: 'Community Member',
    name: 'Amina R - Amman',
    imgSrc: '/images/testimonial/user-2.jpg',
    detail:
      "This platform makes giving effortless. I love being able to browse different cases and support the ones I connect with.",
  },
  {
    profession: 'Case Owner',
    name: 'Tanzeel U. - New Delhi',
    imgSrc: '/images/testimonial/user-3.jpg',
    detail:
      "The clarity and updates gave me so much confidence. I could see the difference my contribution made, even if it was small.",
  },
  {
    profession: 'Platform User',
    name: 'Andrew W. Dubai',
    imgSrc: '/images/testimonial/user-1.jpg',
    detail:
      "The clarity and updates gave me so much confidence. I could see the difference my contribution made, even if it was small.",
  },
  ] 

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }
  useEffect(() => {
    setLoading(false);
  }, [])
  return (
    <section id='testimonial-section' className='bg-cream'>
      <div className='container'>
        <div className='flex flex-col sm:flex-row gap-5 justify-between sm:items-center mb-6'>
          <h2 className='font-bold tracking-tight'>
            Stories From Our <br /> Supporters
          </h2>
          <div>
            <button className='bg-transparent cursor-pointer hover:bg-primary text-primary font-semibold hover:text-white py-3 px-4 border border-primary hover:border-transparent rounded-sm duration-300'>
              Share your experience
            </button>
          </div>
        </div>
        <p className='text-lg font-medium mb-6'>
          Every contribution creates a story  <br /> worth sharing.
        </p>
        <Slider {...settings}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TestimonialSkeleton key={i} />
              ))
            : testimonial.map((items, i) => (
                <div key={i}>
                  <div className='bg-white m-4 pt-8 px-12 pb-10 text-center rounded-lg'>
                    <div className="relative z-0 flex justify-center items-center before:absolute before:h-6 before:w-6 before:bottom-0 before:z-10 before:left-54%">
                      <img
                        src={items.imgSrc}
                        alt='gaby'
                        width={64}
                        height={64}
                        className='inline-block rounded-full ring-2 ring-white relative'
                      />
                    </div>
                    <p className='text-sm pt-4 pb-2'>{items.profession}</p>
                    <p className='text-2xl font-semibold pb-3'>{items.name}</p>
                    <p className='text-lg font-medium leading-7'>
                      {items.detail}
                    </p>
                  </div>
                </div>
              ))}
        </Slider>
      </div>
    </section>
  );
}

export default Testimonial
