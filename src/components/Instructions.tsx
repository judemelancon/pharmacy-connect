import styles from "./Instructions.module.css";

export default function Instructions() {
    return (
        <p className={styles.instructions}>
            Select 4 items at a time to make 4 sets of 4 items that go together.
            You lose if you make 4 incorrect guesses.
        </p>);
}
