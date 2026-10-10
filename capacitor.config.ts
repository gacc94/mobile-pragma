import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'io.ionic.starter',
    appName: 'mobile-pragma',
    webDir: 'www',
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            launchFadeOutDuration: 200,
            backgroundColor: '#ffffff',
            androidScaleType: 'CENTER_CROP',
            showSpinner: false,
            splashFullScreen: false,
            splashImmersive: false,
        },
    },
};

export default config;
