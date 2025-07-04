document.addEventListener('DOMContentLoaded', function() {

    // Gestione navigazione mobile
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            // Per ora, un semplice log. In un'implementazione reale,
            // si aggiungerebbe/rimuoverebbe una classe per mostrare/nascondere il menu.
            console.log("Toggle mobile navigation");
            // Esempio: mainNav.classList.toggle('active');
        });
    }

    // Gestione FAQ "Smart"
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Chiudi tutte le altre risposte
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = 0;
            });

            // Apri/chiudi la risposta cliccata
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Gestione invio form (prevenzione default e log)
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        console.log('Dati del form inviati:', data);
        alert('Grazie per averci contattato! Ti risponderemo al più presto.');
        contactForm.reset();
        
        // QUI si integrerà Zapier/Airtable con una richiesta fetch() a un webhook.
    });

});
