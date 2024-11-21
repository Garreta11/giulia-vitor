import styles from './FAQ.module.scss';
import { useTranslations } from 'next-intl';

const keys = ['question1', 'question2', 'question3'];

const FAQ = () => {
  const t = useTranslations('FAQ');

  return (
    <div id='faq' className={`${styles.faq} section`}>
      <h2 className={styles.faq__title}>FAQ</h2>

      <div className={styles.faq__wrapper}>
        {keys.map((key) => (
          <div key={key} className={styles.faq__wrapper__item}>
            <h3 className={styles.faq__wrapper__item__question}>
              {t(`${key}.question`)}
            </h3>
            <p className={styles.faq__wrapper__item__answer}>
              {t(`${key}.answer`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
