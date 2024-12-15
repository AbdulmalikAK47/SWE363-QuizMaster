import Header from "../components/Header";
import styles from "../styles/AboutUs-style.module.css";
const AboutUs = () => {
    return (
        <div>
            <Header />
            <div className={styles.aboutus_container}>
                <div className={styles.main_container_about}>
                    <div className={styles.aoutUs_container}>
                        <h2 className={styles.h2_about}>ABOUT US</h2>
                    </div>
                    <p className={styles.para}>
                        At
                        <span className={styles.quiz_master}> QuizMaster</span>,
                        we blend fun with learning, providing an enjoyable way
                        to test your knowledge on a variety of topics. Whether
                        you’re preparing for an exam or just looking to have
                        fun, our platform has something for everyone!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
