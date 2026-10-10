import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'io.ionic.starter',
    appName: 'Catbreeds',
    webDir: 'www',
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: false,
            launchFadeOutDuration: 200,
            backgroundColor: '#ffffff',
            androidScaleType: 'CENTER_CROP',
            showSpinner: false,
            splashFullScreen: false,
            splashImmersive: false,
        },
        SystemBars: {
            insetsHandling: 'css',
            initialViewportFitValueHint: 'cover',
            hidden: false,
        },
    },
};

export default config;
