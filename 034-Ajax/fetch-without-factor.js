const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
        <article class="country ${className}">
            <img class="country__img" src=${data.flags.svg} />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(
                  +data.population / 1000000
                ).toFixed(1)}M people</p>
                <p class="country__row"><span>🗣️</span>${
                  data.languages[0].name
                }</p>
                <p class="country__row"><span>💰</span>${
                  data.currencies[0].name
                }</p>
            </div>
        </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const getCountryData = function (country) {
  // Here, fetch API returns a promise obj, make the promise ready to be consume
  // call then method to handle promises
  // Country 1:
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
      // Creating a new error
      if (!response.ok)
        // throw - immediately terminate the current function - promise will reject
        throw new Error(`Country not found: (${response.status})`);

      return response.json(); // will return a new promise
    })
    .then(data => {
      console.log(data); // return of response.json() promise, will be the data itself

      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) return;
      // Country 2:
      // use fetch again, fetching by code
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`); // return a promise
    })
    // handle the promise outside
    .then(response => {
      if (!response.ok) {
        throw new Error(`Country N not found! (${response.status})`);
      }

      return response.json();
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(
      // add catch at the end, to catch any err ocurrs in the promise chain
      err => {
        console.error(`${err} ❤️‍🔥🔥`);
        renderError(`Something went wrong🤪 (${err.message}) Please try gain!`);
      }
    )
    .finally(() => {
      // runs no matter fulfill or reject
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('portugal');
});
