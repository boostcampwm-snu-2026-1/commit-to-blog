export const Footer = () => {
  return (
    <footer
      className="h-[200px] overflow-hidden border-border border-t"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(203, 203, 203, 0.2) 0%, rgba(255, 255, 255, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)',
      }}
    >
      <div className="relative mx-auto h-full max-w-[1280px]">
        <div className="absolute top-[33px] left-10 flex flex-col gap-6">
          <div className="flex h-[20px] items-end gap-[11px]">
            <span className="font-pretendard font-semibold text-black text-lg">
              김연우
            </span>
            <span className="font-normal font-pretendard text-black text-sm">
              Yeonu Kim
            </span>
          </div>
          <div className="flex items-center gap-6 font-light font-pretendard text-black text-xs">
            <a
              href="https://github.com/Yeonu-Kim"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
            <a
              href="mailto:ywk0524@snu.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
            <a
              href="https://velog.io/@Yeonu-Kim"
              target="_blank"
              rel="noopener noreferrer"
            >
              Velog
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
