<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('icons.png') }}">
        <link rel="shortcut icon" type="image/png" href="{{ asset('icons.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('icons.png') }}">
        <meta name="msapplication-TileImage" content="{{ asset('icons.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        
        <!-- CSRF Token Refresh Script -->
        <script>
            // CSRF token auto-refresh function
            function refreshCSRFToken() {
                fetch('/sanctum/csrf-cookie', {
                    method: 'GET',
                    credentials: 'same-origin'
                }).then(() => {
                    // Token is refreshed in cookies, update meta tag if needed
                    const metaToken = document.querySelector('meta[name="csrf-token"]');
                    if (metaToken && window.axios) {
                        // Get new token from Laravel
                        const newToken = document.head.querySelector('meta[name="csrf-token"]').getAttribute('content');
                        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
                    }
                }).catch(error => {
                    console.warn('Failed to refresh CSRF token:', error);
                });
            }
            
            // Refresh CSRF token every 30 minutes
            setInterval(refreshCSRFToken, 30 * 60 * 1000);
            
            // Listen for page visibility changes
            document.addEventListener('visibilitychange', function() {
                if (!document.hidden) {
                    // Page became visible, refresh token
                    refreshCSRFToken();
                }
            });
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
