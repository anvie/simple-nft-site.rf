import styles from "../styles/Home.module.sass";
import Image from "next/image";
import imageLoader from "../imageLoader";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="flex flex-col place-items-center items-center justify-center pt-10">

        <div className="promoted-by text-center pt-10">
          <div>Powered by</div>
          
          <div className="p-10">
            <Image
              src="Chainbox-logo-n-caption.png"
              loader={imageLoader}
              alt="Chainbox logo"
              width="200px"
              height="45px"
            />
          </div>
        </div>

        <div className="text-center text-sm">
          <div>Smart contract address:</div>
          <div>{process.env.SMART_CONTRACT_ADDRESS}</div>
        </div>

        <div className="pt-10 pb-10 text-center">
          Copyright &copy; $year$ $name$. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

