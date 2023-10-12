import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

import { fetchBreeds, fetchCatByBreed } from './cat-api';

const catInfo = document.querySelector('.cat-info');
let select;

Notiflix.Loading.standard('Loading...', {
  backgroundColor: 'rgba(2,2,2,0.8)',
});

window.addEventListener('DOMContentLoaded', () => {
  Notiflix.Loading.standard('Loading data, please wait...', {
    backgroundColor: 'rgba(2,2,2,0.8)',
  });

  select = new SlimSelect({
    select: '.breed-select',
    events: {
      afterChange: data => {
        const selectedBreedId = data[0].value;

        if (selectedBreedId) {
          Notiflix.Loading.standard('Loading data, please wait...', {
            backgroundColor: 'rgba(2,2,2,0.8)',
          });
          fetchCatByBreed(selectedBreedId)
            .then(Data => {
              console.log(Data);
              CatInfo(Data);
              Notiflix.Loading.remove();
            })
            .catch(error => {
              Notiflix.Loading.remove();
              Notiflix.Notify.failure(
                'Oops! Something goes wrong! Try to reload this page!'
              );
            });
        }
      },
    },
  });

  fetchBreeds()
    .then(breeds => {
      Notiflix.Loading.remove();
      select.setData(
        breeds.map(breed => ({
          text: breed.name,
          value: breed.id,
        }))
      );
    })
    .catch(error => {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });

  function CatInfo(Data) {
    const { url, breeds } = Data;

    if (breeds.length > 0) {
      const { name, description, temperament } = breeds[0];

      catInfo.innerHTML = `
    <img src="${url}" alt="${breeds.name}" style="width:500px;height:500px;"/>
    <div >
    <h2>${name}</h2>
    <p>${description}</p>
    <p>${temperament}</p>
    </div>
    `;
    }
  }
});
