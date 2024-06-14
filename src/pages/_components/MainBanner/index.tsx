import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

type MainBannerProps = {}

const MainBanner = ({}: MainBannerProps) => {
  return (
    <Carousel
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      className='py-8'
    >
      {Array.from({ length: 3 })
        .map((url, index) => (
          <div key={index} className='h-96'>
            <img src={'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22640%22%20height%3D%22480%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23d16da2%22%2F%3E%3Ctext%20x%3D%22320%22%20y%3D%22240%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E640x480%3C%2Ftext%3E%3C%2Fsvg%3E'} alt="메인배너 이미지" className='w-full h-full' />
          </div>
      )).concat(
        <div key={4} className='h-96 flex justify-center items-center'>
          <strong>광고영역</strong>
        </div>
      )}
    </Carousel>
  );
};

export default MainBanner;
