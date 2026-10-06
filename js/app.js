document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. Booking Modal & Funnel Logic
    const bookingModal = document.getElementById('bookingModal');
    const step1Container = document.getElementById('step1Container');
    const step2Container = document.getElementById('step2Container');
    const step3Container = document.getElementById('step3Container');

    const step1Dot = document.getElementById('step1Dot');
    const step2Dot = document.getElementById('step2Dot');
    const step3Dot = document.getElementById('step3Dot');
    const step1Line = document.getElementById('step1Line');
    const step2Line = document.getElementById('step2Line');

    let bookingState = {
        service: 'خلع ضرس العقل غير الجراحي (عرض 1500 ج)',
        name: '',
        phone: '',
        date: '',
        slot: 'صباحاً (من 10 - 2)',
        notes: ''
    };

    window.openBookingModal = function() {
        if (!bookingModal) return;
        bookingModal.classList.remove('hidden');
        window.goToStep1();
        if (typeof trackEvent === 'function') trackEvent('InitiateBookingModal');
    };

    // حجز خدمة عادية
    window.openBookingWithService = function(serviceName) {
        window.openBookingModal();
        const serviceRadios = document.querySelectorAll('input[name="selectedService"]');
        serviceRadios.forEach(radio => {
            if (radio.value === serviceName) radio.checked = true;
        });
        bookingState.service = serviceName;
        window.goToStep2();
    };

    // حجز عرض محدد من عروض أكتوبر وفتح الخطوة الثانية مباشرة
    window.openBookingWithOffer = function(offerTitle) {
        window.openBookingModal();
        let found = false;
        const serviceRadios = document.querySelectorAll('input[name="selectedService"]');
        serviceRadios.forEach(radio => {
            if (radio.value === offerTitle) {
                radio.checked = true;
                found = true;
            }
        });
        bookingState.service = offerTitle;
        window.goToStep2();
    };

    window.closeBookingModal = function() {
        if (bookingModal) bookingModal.classList.add('hidden');
    };

    window.goToStep1 = function() {
        step1Container.classList.remove('hidden');
        step2Container.classList.add('hidden');
        step3Container.classList.add('hidden');

        step1Dot.className = 'w-8 h-8 rounded-full bg-brand-pink text-white font-bold text-xs flex items-center justify-center shadow';
        step2Dot.className = 'w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center';
        step3Dot.className = 'w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center';
        step1Line.className = 'flex-1 h-1 bg-slate-200 mx-2 rounded';
        step2Line.className = 'flex-1 h-1 bg-slate-200 mx-2 rounded';
    };

    window.goToStep2 = function() {
        const selectedRadio = document.querySelector('input[name="selectedService"]:checked');
        if (selectedRadio) bookingState.service = selectedRadio.value;

        step1Container.classList.add('hidden');
        step2Container.classList.remove('hidden');
        step3Container.classList.add('hidden');

        step1Dot.className = 'w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow';
        step2Dot.className = 'w-8 h-8 rounded-full bg-brand-pink text-white font-bold text-xs flex items-center justify-center shadow';
        step3Dot.className = 'w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center';
        step1Line.className = 'flex-1 h-1 bg-emerald-500 mx-2 rounded';
        step2Line.className = 'flex-1 h-1 bg-slate-200 mx-2 rounded';

        if (typeof trackEvent === 'function') trackEvent('BookingStep2_Viewed', { service: bookingState.service });
    };

    window.submitBooking = function() {
        const name = document.getElementById('patientName').value.trim();
        const phone = document.getElementById('patientPhone').value.trim();
        const date = document.getElementById('bookingDate').value;
        const slot = document.getElementById('bookingSlot').value;
        const notes = document.getElementById('patientNotes').value.trim();

        if (!name || !phone || !date) {
            alert('يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، التاريخ) لتثبيت العرض');
            return;
        }

        bookingState.name = name;
        bookingState.phone = phone;
        bookingState.date = date;
        bookingState.slot = slot;
        bookingState.notes = notes;

        document.getElementById('summaryService').innerText = bookingState.service;
        document.getElementById('summaryName').innerText = bookingState.name;
        document.getElementById('summaryTime').innerText = `${bookingState.date} (${bookingState.slot})`;

        const clinicWhatsApp = '201030747765';
        
        // رسالة واتساب منسقة بدقة مطابقة لإعلانات أكتوبر
        let msg = `*طلب حجز موعد - عروض أكتوبر الحصرية*%0A`;
        msg += `*عيادة The Perfection - د. عبد الرحمن الحامولي*%0A`;
        msg += `-------------------------%0A`;
        msg += `🦷 *الخدمة / العرض:* ${encodeURIComponent(bookingState.service)}%0A`;
        msg += `👤 *اسم المريض:* ${encodeURIComponent(name)}%0A`;
        msg += `📞 *رقم الهاتف:* ${encodeURIComponent(phone)}%0A`;
        msg += `📅 *اليوم المقترح:* ${encodeURIComponent(date)}%0A`;
        msg += `⏰ *الفترة:* ${encodeURIComponent(slot)}%0A`;
        if (notes) msg += `📝 *ملاحظات:* ${encodeURIComponent(notes)}%0A`;
        msg += `-------------------------%0A`;
        msg += `أرجو تأكيد الموعد وتثبيت سعر العرض. شكراً جزيلاً.`;

        const whatsappUrl = `https://wa.me/${clinicWhatsApp}?text=${msg}`;
        const submitBtn = document.getElementById('whatsappSubmitBtn');
        if (submitBtn) submitBtn.href = whatsappUrl;

        if (typeof trackEvent === 'function') {
            trackEvent('Lead', {
                service: bookingState.service,
                patient_name: name,
                patient_phone: phone,
                campaign: 'October_Offers'
            });
        }

        step1Container.classList.add('hidden');
        step2Container.classList.add('hidden');
        step3Container.classList.remove('hidden');

        step1Dot.className = 'w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center';
        step2Dot.className = 'w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center';
        step3Dot.className = 'w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow';
        step1Line.className = 'flex-1 h-1 bg-emerald-500 mx-2 rounded';
        step2Line.className = 'flex-1 h-1 bg-emerald-500 mx-2 rounded';

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 600);
    };

    // ضبط الحد الأدنى للتاريخ على اليوم الحالي
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        dateInput.min = today;
        dateInput.value = today;
    }

    // 3. Before & After Slider (سلايدر مقارنة الحالات التفاعلي)
    const sliderBox = document.getElementById('comparisonSlider');
    const overlay = document.getElementById('comparisonOverlay');
    const handle = document.getElementById('sliderHandle');
    let isSliding = false;

    function moveSlider(clientX) {
        if (!sliderBox || !overlay || !handle) return;
        const rect = sliderBox.getBoundingClientRect();
        let pos = (clientX - rect.left) / rect.width;
        if (pos < 0.05) pos = 0.05;
        if (pos > 0.95) pos = 0.95;
        const rightPct = (1 - pos) * 100;
        overlay.style.width = `${rightPct}%`;
        handle.style.right = `${rightPct}%`;
    }

    if (sliderBox) {
        sliderBox.addEventListener('mousedown', (e) => { isSliding = true; moveSlider(e.clientX); });
        window.addEventListener('mouseup', () => { isSliding = false; });
        window.addEventListener('mousemove', (e) => { if (isSliding) moveSlider(e.clientX); });

        sliderBox.addEventListener('touchstart', (e) => { isSliding = true; moveSlider(e.touches[0].clientX); });
        window.addEventListener('touchend', () => { isSliding = false; });
        window.addEventListener('touchmove', (e) => { if (isSliding) moveSlider(e.touches[0].clientX); });
    }

    // 4. Testimonials Slider (سلايدر آراء المرضى)
    const track = document.getElementById('testimonialTrack');
    let reviewIdx = 0;
    const totalReviews = 3;

    function renderReviews() {
        if (!track) return;
        const widthVal = window.innerWidth >= 768 ? 33.333 : 100;
        track.style.transform = `translateX(${reviewIdx * widthVal}%)`;
    }

    window.nextTestimonial = function() {
        reviewIdx = (reviewIdx < totalReviews - 1) ? reviewIdx + 1 : 0;
        renderReviews();
    };

    window.prevTestimonial = function() {
        reviewIdx = (reviewIdx > 0) ? reviewIdx - 1 : totalReviews - 1;
        renderReviews();
    };
});
