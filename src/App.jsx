import { useState, useEffect, useRef, useCallback } from 'react'
import MonkeytypeWidget from './MonkeytypeWidget'
import './App.css'

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handle = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])
  return progress
}

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = useCallback(() => setDark(prev => !prev), [])

  return [dark, toggle]
}

function useParallax() {
  const orbsRef = useRef([])

  useEffect(() => {
    const orbs = orbsRef.current
    if (orbs.length < 3) return

    let mouseX = 0, mouseY = 0
    let scrollY = 0
    let rafId

    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const onScroll = () => {
      scrollY = window.scrollY
    }

    const tick = () => {
      const mx = mouseX * 20
      const my = mouseY * 20
      if (orbs[0]) {
        orbs[0].style.transform = `translate(${mx * 0.5}px, ${my * 0.5 - scrollY * 0.15}px)`
      }
      if (orbs[1]) {
        orbs[1].style.transform = `translate(${mx * -0.3}px, ${my * -0.3 + scrollY * 0.1}px)`
      }
      if (orbs[2]) {
        orbs[2].style.transform = `translate(${mx * 0.2}px, ${my * -0.2}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return orbsRef
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          } else {
            entry.target.classList.remove('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const els = document.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

function ParallaxBg() {
  const orbsRef = useParallax()

  return (
    <div className="parallax-bg">
      <div className="orb orb-1" ref={(el) => (orbsRef.current[0] = el)} />
      <div className="orb orb-2" ref={(el) => (orbsRef.current[1] = el)} />
      <div className="orb orb-3" ref={(el) => (orbsRef.current[2] = el)} />
      <div className="grid-overlay" />
    </div>
  )
}

function Navbar({ dark, onToggle }) {
  return (
    <nav>
      <div className="nav-inner">
        <span />
        <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
          {dark ? '\u2600' : '\u263E'}
        </button>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-badge">
        <span className="badge-dot" />
        Computer Science @ Mahindra University
      </div>
      <h1 className="hero-name">
        Nikil{' '}
        <span className="gradient-text">Viswanathan</span>
      </h1>
      <div className="scroll-indicator">
        <div className="scroll-mouse" />
        <span className="scroll-label">Scroll</span>
      </div>
    </section>
  )
}

function Steps() {
  const steps = [
    { num: '01', title: 'Plan', desc: 'Requirements analysis, architecture design, and tech stack selection tailored to each project.' },
    { num: '02', title: 'Build', desc: 'Iterative development with clean code, testing, and performance optimization throughout.' },
    { num: '03', title: 'Ship', desc: 'Deployment, documentation, and continuous iteration based on real-world usage.' },
  ]

  return (
    <section className="steps-section">
      <div className="section-header reveal">
        <p className="section-label">How I Work</p>
        <h2 className="section-heading">From concept to production</h2>
      </div>
      <div className="steps">
        {steps.map((s, i) => (
          <div key={i} className={`step reveal reveal-delay-${i + 1}`}>
            <div className="step-number">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="about-section">
      <div className="section-header reveal">
        <p className="section-label">About</p>
        <h2 className="section-heading">Background & Education</h2>
      </div>
      <div className="about-grid">
        <div className="glass-card about-text reveal">
          <p>
            Undergraduate Computer Science student at Mahindra University with hands-on experience in software
            development, data analytics, and systems programming. Demonstrated ability to build end-to-end projects
            across game development, automation, and network security, with a strong interest in operating systems,
            data-driven applications, and real-time systems. Actively involved in leadership and open-source initiatives.
          </p>
        </div>
        <div className="edu-stack">
          <div className="glass-card edu-card reveal reveal-delay-2">
            <div className="edu-year">2024 &ndash; 2028</div>
            <h3>Mahindra University</h3>
            <p>B.Tech in Computer Science Engineering</p>
            <span className="edu-cgpa">CGPA: 8.41</span>
          </div>
          <div className="glass-card edu-card reveal reveal-delay-3">
            <div className="edu-year">2022 &ndash; 2024</div>
            <h3>Don Bosco School of Excellence</h3>
            <p>Higher Secondary Education</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ title, date, tech, items, url }) {
  const CardTag = url ? 'a' : 'div'
  const linkProps = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <CardTag className="project-card glass-card reveal" {...linkProps}>
      <div className="project-header">
        <span className="project-date">{date}</span>
        <span className="project-tech">{tech}</span>
      </div>
      <h3 className="project-title">{title}</h3>
      <ul className="project-items">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {url && (
        <span className="project-link">
          View project <span className="project-link-arrow">&rarr;</span>
        </span>
      )}
    </CardTag>
  )
}

function Projects() {
  const projects = [
    {
      title: '2D Survival Arena Game',
      date: 'Early 2025',
      tech: 'Unity, C#',
      items: [
        'Wave-based survival game inspired by Survivor.io',
        'Enemy AI, collision detection, combat systems',
        'Modular OOP scripts for entities and spawning',
        'Optimized for smooth real-time performance',
      ],
    },
    {
      title: 'Automated File Organization System',
      date: 'Late 2025',
      tech: 'Bash, Linux Utilities',
      items: [
        'MIME-based file classification system',
        'Metadata extraction and cryptographic hashing',
        'Cron-based automated scheduling',
        'Markdown reporting with dependency validation',
      ],
    },
    {
      title: 'League of Legends Match Analytics',
      date: 'Mid 2026',
      tech: 'Python, Pandas, Riot API, Streamlit',
      url: 'https://lol-project-amber.vercel.app',
      items: [
        'Data pipeline for 10,000+ match analysis',
        '"Higher or Lower" minigame with real stats',
        'Interactive visualizations and gameplay logic',
      ],
    },
    {
      title: 'ARP Spoofing Detection Tool',
      date: 'Mid 2026',
      tech: 'Python, Scapy',
      items: [
        'MAC-IP baseline verification detection',
        'Live packet capture and analysis',
        'Automated alert system for ARP anomalies',
      ],
    },
    {
      title: 'Fruit Ninja CV',
      date: 'Mid 2026',
      tech: 'Python, OpenCV, MediaPipe',
      url: 'https://github.com/Nikil-Viswanathan/FruitNinja',
      items: [
        'Gesture-controlled game with hand tracking',
        'Real-time finger slicing mechanics',
        'Physics-based fruit splitting effects',
        'Persistent high scores with gesture UI',
      ],
    },
  ]

  return (
    <section id="projects" className="projects-section">
      <div className="section-header reveal">
        <p className="section-label">Projects</p>
        <h2 className="section-heading">Things I've built</h2>
      </div>
      <div className="project-grid">
        {projects.map((p, i) => (
          <ProjectCard key={i} {...p} />
        ))}
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="section-header reveal">
        <p className="section-label">Skills &amp; Leadership</p>
        <h2 className="section-heading">Tools &amp; involvement</h2>
      </div>
      <div className="skills-grid">
        <div className="glass-card skill-card reveal reveal-delay-1">
          <h3>Languages</h3>
          <p>Python, C, MATLAB, Bash</p>
        </div>
        <div className="glass-card skill-card reveal reveal-delay-2">
          <h3>Tools / Platforms</h3>
          <p>Git, Linux, WSL, Cron, VS Code, Unity</p>
        </div>
        <div className="glass-card skill-card reveal reveal-delay-3">
          <h3>Libraries</h3>
          <p>Pandas, Streamlit, Scapy, Riot API</p>
        </div>
        <div className="glass-card skill-card reveal reveal-delay-4">
          <h3>Concepts</h3>
          <p>Data Structures &amp; Algorithms, Operating Systems, Computer Networks, Theory of Computation</p>
        </div>
      </div>
      <div className="glass-card leadership-card reveal">
        <h3>Leadership</h3>
        <ul>
          <li>Lead E-Sports Head of ENIGMA, the CS Club of Mahindra University</li>
          <li>Organized tournaments during GameCon 2025 (Valorant, CODM, FIFA, Clash Royale)</li>
          <li>Organized FIFA tournament during Aeon, the Tech fest of Mahindra University</li>
          <li>Participated in Hacktoberfest (2024 &amp; 2025) through ENIGMA</li>
        </ul>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="section-header reveal">
        <p className="section-label">Contact</p>
        <h2 className="section-heading">Get in touch</h2>
      </div>
      <p className="contact-text reveal">
        Feel free to reach out &mdash; I&rsquo;m always open to discussing new projects, ideas, or opportunities.
      </p>
      <div className="contact-grid">
        <a href="mailto:nikilv376@gmail.com" className="contact-item glass-card reveal reveal-delay-1">
          <span className="contact-label">Email</span>
          <span className="contact-value">nikilv376@gmail.com</span>
        </a>
        <a href="https://linkedin.com/in/nikil-viswanathan" target="_blank" rel="noopener noreferrer" className="contact-item glass-card reveal reveal-delay-2">
          <span className="contact-label">LinkedIn</span>
          <span className="contact-value">Nikil Viswanathan</span>
        </a>
        <a href="https://github.com/Nikil-Viswanathan" target="_blank" rel="noopener noreferrer" className="contact-item glass-card reveal reveal-delay-3">
          <span className="contact-label">GitHub</span>
          <span className="contact-value">Nikil-Viswanathan</span>
        </a>
      </div>
    </section>
  )
}

function Footer() {
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Nikil-Viswanathan' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/nikil-viswanathan' },
    { name: 'Email', url: 'mailto:nikilv376@gmail.com' },
  ]

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-socials">
          {socialLinks.map((link) => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.name}
            </a>
          ))}
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Nikil Viswanathan. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

function App() {
  const [dark, toggleTheme] = useTheme()
  useScrollReveal()
  const scrollProgress = useScrollProgress()

  return (
    <div className="app">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <ParallaxBg />
      <div className="site-wrap">
        <Navbar dark={dark} onToggle={toggleTheme} />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <MonkeytypeWidget />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

export default App
