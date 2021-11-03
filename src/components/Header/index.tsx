import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../AtiveLink';

import styles from './styles.module.scss';



export function Header () {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
               <img src="/images/logo.svg" alt="I G News" />
               <nav>
                   <ActiveLink activeClassName={styles.active} href="/" > 
                        <a>Home</a>
                   </ActiveLink>

                   <ActiveLink activeClassName={styles.active}  href="/posts" > 
                        <a>Posts</a>
                   </ActiveLink>
               </nav>
               
               <SignInButton />
            </div>
        </header>
    )
}