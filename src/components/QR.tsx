'use client';

import QRCode from "react-qr-code";
import styles from "./QR.module.css";

export default function QR() {return (
        <div className={styles.qrCodeHolder}>
            <QRCode className={styles.qrCode} value={window.location.toString()} />
        </div>);
}
