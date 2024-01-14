// Przewija do określonej sekcji na stronie
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: 'smooth' });
}

// Wyświetla potwierdzenie zakończenia ankiety
function showConfirmationPage() {
  alert('Ankieta zatwierdzona!');
}

// Wyświetla potwierdzenie zakończenia transakcji
function showTransactionConfirmation() {
  alert('Transakcja zatwierdzona!');
}

// Waliduje formularz przed zakupem subskrypcji
function validateForm() {
  // Pobiera wartości pól formularza
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const marketingConsent = document.getElementById('marketing-consent').checked;

  // Sprawdza poprawność wprowadzonych danych
  const isPhoneNumberValid = /^\d+$/.test(phone);

  // W zależności od warunków, wyświetla odpowiednie komunikaty
  if (name && isPhoneNumberValid && email.includes('@') && marketingConsent) {
      return true;
  } else if (name && phone && !email.includes('@') && marketingConsent) {
      alert('Proszę uzupełnić Adres e-mail poprawnie.');
  } else if (name && !isPhoneNumberValid) {
      alert('Numer telefonu może zawierać tylko cyfry.');
  } else if (!marketingConsent) {
      alert('Potrzeba zgody na przetwarzanie danych osobowych');
  } else {
      alert('Proszę uzupełnić wszystkie pola poprawnie.');
  }
  return false;
}

// Waliduje formularz i dokonuje zakupu subskrypcji
function validateFormAndPurchaseSubscription() {
  if (validateForm()) {
      showTransactionConfirmation();
      saveSubscriptionData();
      alert('Nastąpi przekierowanie...\n');
  }
}

// Zapisuje dane subskrypcji w formacie SQL
function saveSubscriptionData() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const marketingConsent = document.getElementById('marketing-consent').checked;

  // Pobiera preferencje dotyczące ksiazek
  const genrePreferences = document.querySelectorAll('input[name="genres"]:checked');
  const genres = Array.from(genrePreferences).map(genre => genre.value);

  const writingStylePreferences = document.querySelectorAll('input[name="writingStyle"]:checked');
  const writingStyles = Array.from(writingStylePreferences).map(style => style.value);

  // Tworzy zapytanie SQL
  const sqlFormat = `INSERT INTO Subscriptions (Name, Phone, Email, MarketingConsent, Genres, WritingStyles) VALUES ('${name}', '${phone}', '${email}', ${marketingConsent ? 1 : 0}, '${genres.join(', ')}', '${writingStyles.join(', ')}')`;

  alert(`Dane subskrypcji zapisane w formacie SQL:\n${sqlFormat}`);
}

// Pokazuje lub ukrywa elementy nawigacyjne
function toggleNavItems() {
  const navItemsContainer = document.querySelector('.nav-items-container');
  navItemsContainer.classList.toggle('show');
}

// Kopiuje tekst do schowka
function copyToClipboard(text) {
  const dummyElement = document.createElement('textarea');
  document.body.appendChild(dummyElement); // Dodaj element <textarea> do body
  dummyElement.value = text;
  dummyElement.select(); // Zaznacz wszystko co jest textarea
  document.execCommand('copy');
  document.body.removeChild(dummyElement); // Usuń element z body

  alert('Skopiowano do schowka: ' + text);
}

document.addEventListener('DOMContentLoaded', function () {

  // Obsługuje kliknięcie na logo, powoduje ponowne załadowanie strony
  const logo = document.querySelector('.logo');
  logo.addEventListener('click', function () {
      location.reload();
  });
  const footerCompanyName = document.querySelector('.footer-left .company-name');
  footerCompanyName.addEventListener('click', function () {
      location.reload();
  });

  // Tablica tytułów książek
  const bookTitles = ['Książka 1', 'Książka 2', 'Książka 3', 'Książka 4', 'Książka 5', 'Książka 6', 'Książka 7', 'Książka 8', 'Książka 9', 'Książka 10'];

  // Funkcja zwracająca losowy tytuł książki - uwzględnia €zyte wcześniej tytuły
  function getRandomBookTitle(usedTitles) {
      const availableTitles = bookTitles.filter(title => !usedTitles.includes(title));

      if (availableTitles.length === 0) {
          // Sprawdza czy wszystkie dostępne tytuły zostały już użyte i resetoje listę
          usedTitles = [];
      }

      const randomIndex = Math.floor(Math.random() * availableTitles.length);
      const selectedTitle = availableTitles[randomIndex];
      usedTitles.push(selectedTitle);

      return selectedTitle;
  }

  // Funkcja generująca losowy kolor w formacie HEX
  function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  // Tablica użytych tytułów książek
  const usedBookTitles = [];

  // Generuje elementy galerii z losowymi tytułami książek i kolorami
  function generateGalleryItems() {
      usedBookTitles.length = 0; // Czyści tablicę przed generowaniem nowych elementów
      const gallery = document.getElementById('gallery');
      for (let i = 0; i < 10; i++) {
          const bookTitle = getRandomBookTitle(usedBookTitles);
          const bookColor = getRandomColor();

          // Tworzy element galerii i dodaje go do DOM
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery-item';
          galleryItem.innerHTML = `
            <div class="book gallery-book" style="background-color: ${bookColor}">
              <div class="title">${bookTitle}</div>
            </div>
          `;

          // Obsługuje kliknięcie na element galerii, otwiera lightbox
          galleryItem.addEventListener('click', function () {
              openLightbox(bookTitle, bookColor);
          });

          gallery.appendChild(galleryItem);
      }
  }

  // Funkcja otwierająca lightbox z tytułem i kolorem książki
  function openLightbox(title, color) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content" style="background-color: ${color}">
          <div class="lightbox-title">${title}</div>
          <div class="lightbox-close" onclick="closeLightbox()"></div>
        </div>
      `;

      // Obsługuje kliknięcie na obszarze lightboza, zamyka lightbox
      lightbox.addEventListener('click', function (event) {
          if (event.target === lightbox) {
              closeLightbox(lightbox);
          }
      });

      document.body.appendChild(lightbox);
  }

  // Funkcja zamykająca lightbox
  function closeLightbox(lightbox) {
      lightbox.remove();
  }

  // Inicjalizuje generowanie elementów galerii po załadowaniu strony
  generateGalleryItems();
});
