'use client';

import dynamic from 'next/dynamic'

const DynamicQR = dynamic(() => import('./QR'), { ssr: false });

export default DynamicQR;
