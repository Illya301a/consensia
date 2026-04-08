import illiaPhoto from '../photos/illia.png'
import andriiPhoto from '../photos/andrii.png'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import { Reveal } from '../components/Reveal.jsx'
import './DevelopersPage.scss'

const DEVELOPERS = [
  {
    id: 'illia',
    name: 'Илья',
    role: 'Product / Frontend / Integration',
    photo: illiaPhoto,
    about:
      'Отвечает за клиентскую часть сайта: визуальный интерфейс, пользовательский опыт (UX) и интеграцию всех визуальных компонентов.',
    email: 'andrelukaillya@gmail.com',
    linkedin: 'https://www.linkedin.com/in/illiaandreluka/',
    instagram: 'https://www.instagram.com/andreluka.nginx/',
    telegram: 'https://t.me/arietistudelive',
    whatsapp: 'https://wa.me/420722760690',
  },
  {
    id: 'andrii',
    name: 'Андрей',
    role: 'AI / Backend / ML',
    photo: andriiPhoto,
    about:
      'Отвечает за техническую архитектуру и бекенд. Разработал оркестратор, который синхронизирует работу 6 различных AI-моделей в единую систему.',
    email: 'andriishumko@gmail.com',
    linkedin: 'https://www.linkedin.com/in/andrii-shumko-3aa818313/',
    instagram: 'https://www.instagram.com/andrii_shumko/',
    telegram: 'https://t.me/thefabyworld',
    threads: 'https://www.threads.com/@andrii_shumko',
  },
]

function SocialIcon({ type }) {
  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.94 8.5a1.58 1.58 0 1 1 0-3.16 1.58 1.58 0 0 1 0 3.16ZM5.58 18.66h2.72V9.86H5.58v8.8Zm4.28-8.8v8.8h2.72v-4.62c0-1.22.23-2.4 1.74-2.4 1.5 0 1.52 1.4 1.52 2.48v4.54h2.72v-5.1c0-2.5-.54-4.42-3.46-4.42-1.4 0-2.34.77-2.72 1.5h-.04v-1.28H9.86Z" />
      </svg>
    )
  }
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.45 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 1.8A2.4 2.4 0 1 0 14.4 12 2.4 2.4 0 0 0 12 9.6Z" />
      </svg>
    )
  }
  if (type === 'threads') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.2 10.1a3.7 3.7 0 0 0-.8-1.9c-.8-.9-2-1.4-3.4-1.4-2.5 0-4.2 1.6-4.2 4 0 2.4 1.7 4 4.2 4 1.8 0 3-.8 3.5-2.2.1-.3.2-.7.2-1.1h-2c0 .2 0 .3-.1.5-.2.6-.7 1-1.6 1-1.2 0-2-.8-2-2.1 0-1.3.8-2.1 2-2.1.7 0 1.2.3 1.5.7.2.2.3.5.3.8v.1c-.7.1-1.3.3-1.9.5-1.3.5-2 1.4-2 2.6 0 1.5 1.1 2.5 2.8 2.5 1.1 0 1.9-.3 2.5-.9.6-.6.9-1.4.9-2.5 0-.2 0-.5-.1-.7.7.2 1.2.7 1.2 1.5 0 1.4-1.2 2.5-3 2.5-2.5 0-4.3-1.8-4.3-4.7 0-2.8 1.8-4.7 4.4-4.7 2.1 0 3.6 1.1 4 2.9h2.1a5.9 5.9 0 0 0-2-3.6C14.4 4.5 12.9 4 11.2 4 7.3 4 4.7 6.8 4.7 11s2.7 7 6.6 7c3 0 5.2-1.8 5.2-4.4 0-1.7-.9-2.9-2.3-3.5Z" />
      </svg>
    )
  }
  if (type === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.3a7.7 7.7 0 0 0-6.6 11.7l-.8 3 3.1-.8A7.7 7.7 0 1 0 12 4.3Zm0 13.9c-1.2 0-2.3-.3-3.3-.9l-.2-.1-1.8.5.5-1.7-.1-.2a5.9 5.9 0 1 1 4.9 2.4Zm3.2-4.4c-.2-.1-1.1-.6-1.3-.7-.2-.1-.3-.1-.5.1l-.4.5c-.1.1-.3.2-.5.1-.9-.4-1.7-1.1-2.1-2-.1-.2 0-.3.1-.5l.3-.4c.1-.1.2-.3.1-.5 0-.1-.5-1.2-.7-1.6-.1-.3-.3-.3-.5-.3h-.4c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.4.1.1 1.6 2.5 3.8 3.4.5.2 1 .4 1.4.5.6.2 1.2.2 1.7.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.2 5.14c.26-.87-.57-1.66-1.4-1.34L4.75 9.6c-.98.38-.93 1.8.07 2.11l3.73 1.13 1.3 4.16c.3.96 1.56 1.15 2.12.32l2.08-3.1 3.86 2.85c.7.52 1.7.14 1.88-.72L21.2 5.14Zm-5.44 2.17-5.3 5.22-.5 1.88-.86-2.74-2.63-.8 9.29-3.56Z" />
    </svg>
  )
}

function DevCard({ dev, side }) {
  return (
    <article className={`developers__card developers__card--${side}`}>
      <div className="developers__photo-wrap">
        <img className="developers__photo" src={dev.photo} alt={dev.name} loading="lazy" />
        <div className="developers__photo-strip" aria-hidden="true" />
      </div>

      <div className="developers__content">
        <p className="developers__role">{dev.role}</p>
        <h2>{dev.name}</h2>
        <p className="developers__about">{dev.about}</p>

        <div className="developers__links">
          <a className="developers__link-btn" href={dev.linkedin} target="_blank" rel="noreferrer">
            <SocialIcon type="linkedin" />
            LinkedIn
          </a>
          <a className="developers__link-btn" href={dev.instagram} target="_blank" rel="noreferrer">
            <SocialIcon type="instagram" />
            Instagram
          </a>
          <a className="developers__link-btn" href={dev.telegram} target="_blank" rel="noreferrer">
            <SocialIcon type="telegram" />
            Telegram
          </a>
          {dev.threads ? (
            <a className="developers__link-btn" href={dev.threads} target="_blank" rel="noreferrer">
              <SocialIcon type="threads" />
              Threads
            </a>
          ) : null}
          {dev.whatsapp ? (
            <a className="developers__link-btn" href={dev.whatsapp} target="_blank" rel="noreferrer">
              <SocialIcon type="whatsapp" />
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default function DevelopersPage() {
  return (
    <main className="developers-page">
      <SiteHeader />

      <Reveal>
        <header className="developers-page__top">
          <p className="developers-page__eyebrow">Builders of Consensia</p>
          <h1>Разработчики</h1>
          <p className="developers-page__lead">
            Команда, которая собрала Consensia от идеи до реального продукта.
          </p>
        </header>
      </Reveal>

      <Reveal>
        <section className="developers">
          <DevCard dev={DEVELOPERS[0]} side="left" />
          <DevCard dev={DEVELOPERS[1]} side="right" />
        </section>
      </Reveal>

      <Reveal>
        <section className="developers-page__contacts" aria-label="Контакты разработчиков">
          <div className="developers-page__question">
            <h3>Илья</h3>
            <p>Вопросы по продукту, предложения и баг-репорты:</p>
            <a
              className="developers__link-btn developers__link-btn--mail"
              href="mailto:andrelukaillya@gmail.com"
            >
              andrelukaillya@gmail.com
            </a>
          </div>
          <div className="developers-page__question">
            <h3>Андрей</h3>
            <p>Сложные технические вопросы и фидбек по качеству AI-ответов:</p>
            <a
              className="developers__link-btn developers__link-btn--mail"
              href="mailto:andriishumko@gmail.com"
            >
              andriishumko@gmail.com
            </a>
          </div>
        </section>
      </Reveal>

      <SiteFooter />
    </main>
  )
}