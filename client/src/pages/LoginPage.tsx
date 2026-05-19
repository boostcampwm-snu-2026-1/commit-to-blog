import GithubLogo from "../shared/components/icons/GitHub_logo.svg";
import type { CSSProperties } from "react";

type TechPill = {
  label: string;
  color: string;
  textColor?: string;
  left: string;
  top: string;
  rotate: number;
  width?: number;
};

const techPills: TechPill[] = [
  { label: "LINUX", color: "#fcc624", textColor: "rgba(0,0,0,0.7)", left: "8%", top: "-10%", rotate: 149 },
  { label: "GITHUB", color: "#181717", left: "13%", top: "7%", rotate: 8 },
  { label: "JAVA", color: "#007396", left: "28%", top: "6%", rotate: 23 },
  { label: "MYSQL", color: "#4479a1", left: "44%", top: "7%", rotate: -25 },
  { label: "EXPRESS", color: "#000000", left: "52%", top: "8%", rotate: -33 },
  { label: "FIREBASE", color: "#ffca28", textColor: "rgba(0,0,0,0.7)", left: "73%", top: "10%", rotate: 120 },
  { label: "HTML5", color: "#e34f26", left: "0%", top: "22%", rotate: 146 },
  { label: "APACHE TOMCAT", color: "#f8dc75", textColor: "rgba(0,0,0,0.7)", left: "7%", top: "27%", rotate: -10 },
  { label: "MARIADB", color: "#003545", left: "30%", top: "26%", rotate: -48 },
  { label: "JQUERY", color: "#0769ad", left: "59%", top: "28%", rotate: -178 },
  { label: "ORACLE", color: "#f80000", left: "83%", top: "26%", rotate: -15 },
  { label: "C++", color: "#00599c", left: "93%", top: "37%", rotate: -34 },
  { label: "FLUTTER", color: "#02569b", left: "2%", top: "51%", rotate: 11 },
  { label: "NODE.JS", color: "#339933", left: "15%", top: "56%", rotate: -48 },
  { label: "ANGULAR.JS", color: "#dd0031", left: "27%", top: "60%", rotate: 11 },
  { label: "FONTAWESOME", color: "#339af0", left: "42%", top: "45%", rotate: 8 },
  { label: "AMAZON AWS", color: "#232f3e", left: "66%", top: "49%", rotate: -2 },
  { label: "JAVASCRIPT", color: "#f7df1e", textColor: "rgba(0,0,0,0.7)", left: "80%", top: "62%", rotate: -14 },
  { label: "REACT", color: "#61dafb", textColor: "rgba(0,0,0,0.7)", left: "5%", top: "77%", rotate: 27 },
  { label: "VUE.JS++", color: "#4fc08d", left: "19%", top: "83%", rotate: -15, width: 232 },
  { label: "FLASK", color: "#000000", left: "36%", top: "88%", rotate: 5 },
  { label: "GIT", color: "#f05032", left: "45%", top: "70%", rotate: 54 },
  { label: "BOOTSTRAP", color: "#7952b3", left: "56%", top: "68%", rotate: 6 },
  { label: "DJANGO", color: "#092e20", left: "50%", top: "82%", rotate: -10 },
  { label: "SPRING", color: "#6db33f", left: "71%", top: "82%", rotate: 10 },
  { label: "PYTHON", color: "#3776ab", left: "86%", top: "84%", rotate: 0 },
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

function TechPill({ label, color, textColor = "#ffffff", left, top, rotate, width, index }: TechPill & { index: number }) {
  const style = {
    "--pill-bg": color,
    "--pill-color": textColor,
    "--pill-rotation": `${rotate}deg`,
    "--pill-delay": `${0.08 + (index % 13) * 0.06}s`,
    left,
    top,
    width,
  } as CSSProperties;

  return (
    <div
      className="tech-pill"
      style={style}
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
          {techPills.map((pill, index) => (
            <TechPill key={`${pill.label}-${pill.left}-${pill.top}`} {...pill} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
