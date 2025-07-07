document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Previene il ricaricamento della pagina

            // Qui potresti inserire una logica per inviare i dati a un server (es. con fetch)
            // Per questa demo, nascondiamo semplicemente il form e mostriamo un messaggio di successo.

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            console.log(`Invio del modulo da: ${name}`);

            // Nascondi il form e mostra il messaggio di successo
            contactForm.style.display = 'none';
            successMessage.style.display = 'block';

            // Opzionale: pulisci il form dopo un po' e lo mostri di nuovo
            setTimeout(() => {
                contactForm.reset();
                // contactForm.style.display = 'flex';
                // successMessage.style.display = 'none';
            }, 5000); // Il form rimane nascosto, l'utente dovrà ricaricare la pagina per inviare di nuovo.
        });
    }
});
