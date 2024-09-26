import Game from './components/Game/Game';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.page}>
      <Game />
    </div>
  );
}
