import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';

// routeをグローバルに設定
window.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Inertia.js用の419エラーハンドリング
router.on('error', (event) => {
    if (event.detail.response?.status === 419) {
        console.warn('419 Page Expired error detected, reloading page...');
        window.location.reload();
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
