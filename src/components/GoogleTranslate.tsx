/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import Image from 'next/image'

import styles from '../styles/Translate.module.css'

const App = () => {
  const [isActive, setActive] = useState(false)

  const toggleClass = () => {
    setActive(!isActive)
  }

  const googleTranslateElementInit = () => {
    // @ts-ignore
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en-us',
        autoDisplay: false,
      },
      'google_translate_element'
    )
  }

  useEffect(() => {
    const addNewScript = document.createElement('script')
    addNewScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    )
    document.body.appendChild(addNewScript)
    // @ts-ignore
    window.googleTranslateElementInit = googleTranslateElementInit
  }, [])
  return (
    <>
      <div
        className={`${styles.translateBtn} ${isActive ? styles.active : ''}`}
      >
        <div>
          <a
            onClick={toggleClass}
            className={styles.toggle}
            data-tooltip="Traduzir página"
          >
            <Image
              src="/translator_icon.png"
              alt="Ícone do google tradutor"
              width={32}
              height={32}
            />
          </a>
        </div>
        <div id="google_translate_element"></div>
      </div>
    </>
  )
}

export default App
