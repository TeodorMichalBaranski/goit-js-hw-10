import { fetchBreeds } from './cat-api.js';
import { fetchCatByBreed } from './cat-api.js';

const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const select = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
let options = [];

window.addEventListener('load', () => {
  loader.classList.remove('hidden');

  select.style.display = 'none';
  error.classList.add('hidden');
  fetchBreeds()
    .then(catsList => {
      loader.classList.add('hidden');

      select.style.display = 'block';

      catsList.forEach(e => {
        const option = document.createElement('option');
        option.setAttribute('value', `${e.id}`);
        option.textContent = `${e.name}`;
        options.push(option);
      });
      select.append(...options);
    })
    .catch(err => {
      // Obsługa błędów
      loader.classList.add('hidden'); // Ukryj loader
      error.classList.remove('hidden'); // Wyświetl komunikat o błędzie
      console.error('Wystąpił błąd:', err); // Opcjonalnie: wypisz błąd do konsoli
    });
});

select.addEventListener('change', e => {
  // Pokaż animację ładowania
  loader.classList.remove('hidden');
  // Ukryj informacje o kocie
  catInfo.style.display = 'none';

  const currentValue = e.currentTarget.value;
  catInfo.replaceChildren();

  fetchCatByBreed(currentValue)
    .then(catUrl => {
      //loader.style.display = 'none';
      loader.classList.add('hidden');

      catInfo.style.display = 'flex'; //tutaj zmiana wyswietlania

      const catImage = document.createElement('img');
      catInfo.append(catImage);
      catImage.setAttribute('src', `${catUrl}`);
      catImage.setAttribute('width', '500');
      catImage.setAttribute('height', '500');
    })
    .then(
      fetch(
        'https://api.thecatapi.com/v1/breeds?api_key=live_e5uNK38D2LdYvYq9jrw7OoTkULXjhFXHcTTTLfhQCmB8zyjET14WEzbSaUbxwzC4'
      )
        .then(response => response.json())
        .then(data => {
          data.forEach(cat => {
            if (currentValue === cat.id) {
              const textContainer = document.createElement('div');
              textContainer.classList.add('text-container');
              const catName = document.createElement('h1');
              const catDescr = document.createElement('p');
              const catTemp = document.createElement('span');
              textContainer.append(catName, catDescr, catTemp);
              catInfo.append(textContainer);
              catName.textContent = `${cat.name}`;
              catDescr.textContent = `${cat.description}`;
              catTemp.textContent = `Temperament: ${cat.temperament}`;
            }
          });
        })
    );
});
