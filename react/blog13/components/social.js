import styles from "@/styles/social.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebookF,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

export default function Social({ iconSize = "initial" }) {
  return (
    <ul className={styles.list} style={{ "--icon-size": iconSize }}>
      <li>
        <a href="https://twitter.com/">
          <FontAwesomeIcon icon={faTwitter} />
          <span className={styles.srOnly}>Twitter</span>
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/">
          <FontAwesomeIcon icon={faFacebookF} />
          <span className={styles.srOnly}>Facebook</span>
        </a>
      </li>
      <li>
        <a href="https://github.com/">
          <FontAwesomeIcon icon={faGithub} />
          <span className={styles.srOnly}>Github</span>
        </a>
      </li>
    </ul>
  );
}
