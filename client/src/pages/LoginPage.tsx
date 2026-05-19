import GithubLogo from "../shared/components/icons/GitHub_logo.svg";

type TechPill = {
  label: string;
  color: string;
  textColor?: string;
  left: number;
  top: number;
  rotate: number;
  width?: number;
};

const techPills: TechPill[] = [
  { label: "REACT", color: "#61dafb", textColor: "rgba(0,0,0,0.7)", left: 78, top: 906, rotate: 27 },
  { label: "VUE.JS++", color: "#4fc08d", left: 276, top: 928, rotate: -15, width: 232 },
  { label: "SPRING", color: "#6db33f", left: 948, top: 936, rotate: 10 },
  { label: "DJANGO", color: "#092e20", left: 682, top: 938, rotate: -10 },
  { label: "BOOTSTRAP", color: "#7952b3", left: 820, top: 854, rotate: 6 },
  { label: "FLASK", color: "#000000", left: 506, top: 948, rotate: 5 },
  { label: "ANGULAR.JS", color: "#dd0031", left: 404, top: 848, rotate: 11 },
  { label: "NODE.JS", color: "#339933", left: 202, top: 808, rotate: -48 },
  { label: "PYTHON", color: "#3776ab", left: 1172, top: 952, rotate: 0 },
  { label: "JAVASCRIPT", color: "#f7df1e", textColor: "rgba(0,0,0,0.7)", left: 1116, top: 844, rotate: -14 },
  { label: "GIT", color: "#f05032", left: 672, top: 832, rotate: 54 },
  { label: "FLUTTER", color: "#02569b", left: 34, top: 816, rotate: 11 },
  { label: "APACHE TOMCAT", color: "#f8dc75", textColor: "rgba(0,0,0,0.7)", left: 104, top: 704, rotate: -10 },
  { label: "AMAZON AWS", color: "#232f3e", left: 962, top: 786, rotate: -2 },
  { label: "FONTAWESOME", color: "#339af0", left: 598, top: 754, rotate: 8 },
  { label: "MARIADB", color: "#003545", left: 430, top: 678, rotate: -48 },
  { label: "HTML5", color: "#e34f26", left: -2, top: 660, rotate: 146 },
  { label: "JQUERY", color: "#0769ad", left: 860, top: 706, rotate: -178 },
  { label: "JAVA", color: "#007396", left: 400, top: 612, rotate: 23 },
  { label: "C++", color: "#00599c", left: 1280, top: 730, rotate: -34 },
  { label: "ORACLE", color: "#f80000", left: 1152, top: 684, rotate: -15 },
  { label: "EXPRESS", color: "#000000", left: 710, top: 630, rotate: -33 },
  { label: "FIREBASE", color: "#ffca28", textColor: "rgba(0,0,0,0.7)", left: 1010, top: 628, rotate: 90 },
  { label: "GITHUB", color: "#181717", left: 198, top: 616, rotate: 8 },
  { label: "LINUX", color: "#fcc624", textColor: "rgba(0,0,0,0.7)", left: 112, top: 532, rotate: 149 },
  { label: "MYSQL", color: "#4479a1", left: 642, top: 614, rotate: -25 },
];

function BrandHeader() {
  return (
    <header className="brand-header" aria-label="Smart blog">
      <div className="hamburger" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="brand-title">Smart blog</div>
    </header>
  );
}

function TechPill({ label, color, textColor = "#ffffff", left, top, rotate, width }: TechPill) {
  return (
    <div
      className="tech-pill"
      style={{
        backgroundColor: color,
        color: textColor,
        left,
        top,
        width,
        transform: `rotate(${rotate}deg)`,
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

export function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/api/auth/github";
  };

  return (
    <main className="login-page">
      <div className="login-canvas" aria-label="GitHub account login page">
        <BrandHeader />

        <button className="github-login-button" type="button" onClick={handleLogin}>
          <span className="github-logo" aria-hidden="true">
            <img src={GithubLogo} alt="GitHub Logo" width="140" height="140" />
          </span>
          <span className="github-login-text">
            <span>Github 계정으로</span>
            <span>로그인하기</span>
          </span>
        </button>

        <div className="tech-pill-layer" aria-hidden="true">
          {techPills.map((pill) => (
            <TechPill key={`${pill.label}-${pill.left}-${pill.top}`} {...pill} />
          ))}
        </div>
      </div>
    </main>
  );
}
