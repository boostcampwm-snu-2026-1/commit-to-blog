import { type MouseEvent } from 'react';
import { ASSET } from '../entity/asset';
import { PATH } from '../entity/path';
import { useRouteNavigation } from '../shared/use-route-navigation';
import { useHeaderVideo } from './use-header';

type MENU = 'HOME' | 'BLOG' | 'ABOUT';
type MenuItem = {
  menu: MENU;
  path: string;
  label: string;
  video: string;
};

const NAV_ITEMS: MenuItem[] = [
  {
    menu: 'HOME',
    path: PATH.HOME,
    label: '프로젝트',
    video: ASSET.PROJECT_TRWIL,
  },
  {
    menu: 'BLOG',
    path: PATH.BLOG,
    label: '블로그',
    video: ASSET.POST_TRWIL,
  },
  {
    menu: 'ABOUT',
    path: PATH.ABOUT,
    label: '자기소개',
    video: ASSET.ABOUT_TRWIL,
  },
];

export const Header = () => {
  const { setVideoRef, handleMouseEnter, currentPath } =
    useHeaderVideo(NAV_ITEMS);
  const { toHome, toBlog, toAbout } = useRouteNavigation();

  const handleClick = (e: MouseEvent<HTMLButtonElement>, menu: MENU) => {
    e.preventDefault();
    switch (menu) {
      case 'HOME':
        toHome();
        break;
      case 'BLOG':
        toBlog();
        break;
      case 'ABOUT':
        toAbout();
        break;
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-header border-border border-b bg-surface">
      <div className="relative mx-auto h-full max-w-[1280px]">
        <span className="absolute top-1/2 left-[30px] -translate-y-1/2 whitespace-nowrap font-pretendard font-semibold text-black text-lg">
          포트폴리오_김연우
        </span>
        <nav className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-10">
          {NAV_ITEMS.map((item, index) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.label}
                className="flex flex-col items-end gap-2 no-underline"
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={(e) => handleClick(e, item.menu)}
              >
                <div className="flex items-center gap-2">
                  <video
                    ref={setVideoRef(index)}
                    src={item.video}
                    className="size-8 object-cover"
                    muted
                    playsInline
                  />
                  <span
                    className={`whitespace-nowrap font-pretendard text-black text-sm ${isActive ? 'font-semibold' : 'font-normal'}`}
                  >
                    {item.label}
                  </span>
                </div>
                {isActive && <div className="h-px w-full bg-black" />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
