import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
 scrollSepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Signele',
  projectId: 'f5c3ab4688a7a9eedaa18f1ba8e02934',
  chains: [
    scrollSepolia
  ],
  ssr: true,
});