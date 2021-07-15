import '../sass/main.scss';
import PixabayApi from './pixabay-api';
import galleryCardsTpl from '../templates/gallery-cards.hbs';

import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/src/simple-lightbox.scss';

const refs = {
  galleryContainer: document.querySelector('.gallery'),
  searchForm: document.querySelector('#search-form'),
};

const pixabayApi = new PixabayApi();

const gallery = new SimpleLightbox('.gallery a');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchPhotos();
      observer.unobserve(entry.target);
    }
  });
});

bindEvents();

// functions
function bindEvents() {
  refs.searchForm.addEventListener('submit', onSearch);
}

function AddObserver() {
  observer.observe(refs.galleryContainer.querySelector('li:last-child'));
}

function onSearch(e) {
  e.preventDefault();
  pixabayApi.query = refs.searchForm.query.value.trim();
  clearGalleryContainer();

  fetchPhotos(true);
}

async function fetchPhotos(isFirstQuery = false) {
  try {
    const data = await pixabayApi.getPhotos();

    appendGalleryMarkup(data.hits);

    if (isFirstQuery) {
      if (data.totalHits) Notify.success(`Hooray! We found ${data.totalHits} images.`);
      else {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
    }

    if (data.hits.length < pixabayApi.perPage) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }

    AddObserver();
  } catch (err) {
    console.log(err);
    Notify.failure(`Something went wrong(${err.message})`);
  }
}

function appendGalleryMarkup(hits) {
  const markup = galleryCardsTpl(hits);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
