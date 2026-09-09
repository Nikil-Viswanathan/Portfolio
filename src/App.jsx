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
            Computer Science undergraduate with hands-on experience building AI-powered web applications
            using Flask and Google Gemini API during an internship at George Oakes Ltd. Strong foundation in Python,
            data structures, operating systems, and computer networks, with a proven record of shipping end-to-end
            projects in web development, automation, data analytics, and computer vision.
          </p>
        </div>
        <div className="edu-stack">
          <div className="glass-card edu-card reveal reveal-delay-2">
            <div className="edu-year">2024 &ndash; 2028</div>
            <h3>Mahindra University</h3>
            <p>B.Tech in Computer Science Engineering</p>
            <span className="edu-cgpa">CGPA: 8.41</span>
            <p className="edu-coursework">Relevant Coursework: Data Structures &amp; Algorithms, Operating Systems, Computer Networks, Database Management, Theory of Computation</p>
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

function Experience() {
  return (
    <section id="experience" className="about-section">
      <div className="section-header reveal">
        <p className="section-label">Experience</p>
        <h2 className="section-heading">Where I've worked</h2>
      </div>
      <div className="glass-card reveal" style={{ marginBottom: '24px' }}>
        <div className="project-header">
          <span className="project-date">June 2026 &ndash; July 2026</span>
          <span className="project-tech">George Oakes Ltd, Chennai</span>
        </div>
        <h3 className="project-title">AI Intern for HR</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>
          Worked alongside a fellow intern to design and develop AI-powered web applications.
        </p>
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>GOL Screener &amp; Extractor &ndash; AI Resume Screening Tool</h4>
        <ul className="project-items">
          <li>Built an AI-powered resume screening web app using Flask and Google Gemini API that parses PDF resumes, extracts structured candidate data, and screens candidates against job descriptions with match scores, gap analysis, and tailored interview questions</li>
          <li>Engineered a one-click TSV export feature that copies all 37 extracted candidate fields to the clipboard for direct pasting into Excel tracking sheets</li>
          <li>Built an SMTP email pipeline that auto-generates formatted screening reports and sends them with the original resume attached to hiring managers</li>
          <li>Designed a multi-format document processing pipeline using pdfplumber with Tesseract OCR fallback, supporting PDF, DOCX, PNG, JPG, TIFF, and BMP files with parallel batch screening</li>
          <li>Created a role-based admin panel with manager directory CRUD, user account management, and a timestamped audit trail of every screening</li>
        </ul>
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', marginTop: '16px' }}>Learning Library &ndash; Role-Based AI Literacy Platform</h4>
        <ul className="project-items">
          <li>Developed a multi-company AI literacy platform using Flask, SQLAlchemy, and Google Gemini API serving four companies, 41 job roles across eight departments, and 123+ role-specific lessons</li>
          <li>Designed a three-tier lesson architecture paired with an AI-generated quiz system that creates 5 MCQs per role with client-side grading and progress tracking</li>
          <li>Built a comprehensive admin dashboard with CRUD functionality for roles, lessons, resources, categories, and AI course modules</li>
          <li>Integrated Google Translate with support for 16 Indian languages and persistent language preferences</li>
          <li>Deployed on Render using Gunicorn and PostgreSQL with a responsive, company-branded interface</li>
        </ul>
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
      tech: 'Unity, C#, Game Development',
      items: [
        'Developed a 2D wave-based survival game inspired by Survivor.io using Unity and C#, implementing enemy AI, collision detection, combat systems, and player progression mechanics',
        'Designed modular object-oriented scripts for game entities, spawning systems, and UI management, optimizing gameplay loops to maintain smooth real-time performance during large enemy waves',
      ],
    },
    {
      title: 'Automated File Organization System',
      date: 'Late 2025',
      tech: 'Bash, Linux Utilities, Shell Scripting',
      items: [
        'Developed a Bash-based file organization system that classifies files using MIME type detection, with metadata extraction, EXIF analysis, and cryptographic hashing',
        'Integrated cron job scheduling for automated periodic organization, with dependency validation, error handling, and markdown-based reporting',
      ],
    },
    {
      title: 'League of Legends Match Analytics Minigame',
      date: 'Mid 2026',
      tech: 'Python, Pandas, Riot API, Streamlit',
      url: 'https://lol-project-amber.vercel.app',
      items: [
        'Built a data pipeline using the Riot API, analyzing player statistics from over 10,000 League of Legends matches',
        'Developed a Streamlit-based "Higher or Lower" minigame with interactive visualizations',
      ],
    },
    {
      title: 'ARP Spoofing Detection Tool',
      date: 'Mid 2026',
      tech: 'Python, Scapy, Networking',
      items: [
        'Implemented ARP spoofing detection using MAC-IP baseline verification, capturing and monitoring live network packets with Scapy',
        'Designed automated alerts for suspicious ARP table modifications',
      ],
    },
    {
      title: 'Fruit Ninja CV',
      date: 'Mid 2026',
      tech: 'Python, OpenCV, MediaPipe, NumPy',
      url: 'https://github.com/Nikil-Viswanathan/FruitNinja',
      items: [
        'Developed a gesture-controlled Fruit Ninja clone using Python, OpenCV, and MediaPipe hand tracking',
        'Implemented real-time finger-gesture slicing, physics-driven fruit splitting, a persistent high-score system, and hover-based restart mechanics',
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
          <p>Python, C, HTML, Bash</p>
        </div>
        <div className="glass-card skill-card reveal reveal-delay-2">
          <h3>Web &amp; Frameworks</h3>
          <p>Flask, SQLAlchemy, Google Gemini API, pdfplumber, Tesseract OCR, REST APIs, JSON, SMTP</p>
        </div>
        <div className="glass-card skill-card reveal reveal-delay-3">
          <h3>Libraries &amp; Data</h3>
          <p>Pandas, NumPy, OpenCV, MediaPipe, Streamlit, Scapy, Riot API</p>
        </div>
        <div className="glass-card skill-card reveal reveal-delay-4">
          <h3>Tools &amp; Platforms</h3>
          <p>Git, Linux, WSL, PostgreSQL, Gunicorn, Render, Cron, VS Code, Unity</p>
        </div>
      </div>
      <div className="glass-card leadership-card reveal">
        <h3>Leadership &amp; Activities</h3>
        <ul>
          <li>Lead E-Sports Head of ENIGMA, the Computer Science Club of Mahindra University</li>
          <li>Organized multiple E-Sports tournaments during GameCon 2025 (Valorant, CODM, FIFA, Clash Royale) and a FIFA tournament during Aeon, the university tech fest</li>
          <li>Participated in Hacktoberfest 2024 and 2025, contributing to open-source projects using Git and GitHub workflows</li>
        </ul>
      </div>
      <div className="glass-card leadership-card reveal" style={{ marginTop: '16px' }}>
        <h3>Interests</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Operating Systems, Computer Networks, Computer Vision, Data Analytics, Cybersecurity, Game Development, Open-Source Collaboration
        </p>
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
        <a href="tel:+917358456727" className="contact-item glass-card reveal reveal-delay-2">
          <span className="contact-label">Phone</span>
          <span className="contact-value">+91 73584 56727</span>
        </a>
        <a href="https://linkedin.com/in/nikil-viswanathan" target="_blank" rel="noopener noreferrer" className="contact-item glass-card reveal reveal-delay-3">
          <span className="contact-label">LinkedIn</span>
          <span className="contact-value">Nikil Viswanathan</span>
        </a>
        <a href="https://github.com/Nikil-Viswanathan" target="_blank" rel="noopener noreferrer" className="contact-item glass-card reveal reveal-delay-4">
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
        <Experience />
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
