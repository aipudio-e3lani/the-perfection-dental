// === Tracking Configuration ===
const META_PIXEL_ID = 'YOUR_PIXEL_ID_HERE';       // ضع Pixel ID هنا
const GOOGLE_TAG_ID = 'G-XXXXXXXXXX';             // ضع Google Tag ID هنا
const CLARITY_ID = 'YOUR_CLARITY_ID_HERE';         // ضع Clarity ID هنا

// 1. Init Meta Pixel
if (META_PIXEL_ID !== 'YOUR_PIXEL_ID_HERE') {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
}

// 2. Init Google Tag
if (GOOGLE_TAG_ID !== 'G-XXXXXXXXXX') {
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GOOGLE_TAG_ID);
}

// 3. Init Microsoft Clarity
if (CLARITY_ID !== 'YOUR_CLARITY_ID_HERE') {
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_ID);
}

// Centralized Event Dispatcher
function trackEvent(eventName, params = {}) {
    console.log(`[Event Triggered]: ${eventName}`, params);
    
    // Meta Pixel
    if (typeof fbq === 'function' && META_PIXEL_ID !== 'YOUR_PIXEL_ID_HERE') {
        fbq('trackCustom', eventName, params);
    }
    // Google Tag
    if (typeof gtag === 'function' && GOOGLE_TAG_ID !== 'G-XXXXXXXXXX') {
        gtag('event', eventName, params);
    }
    // Clarity
    if (typeof clarity === 'function' && CLARITY_ID !== 'YOUR_CLARITY_ID_HERE') {
        clarity('event', eventName);
    }
}
