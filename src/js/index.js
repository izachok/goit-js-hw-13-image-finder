import '../sass/main.scss';
import PixabayApi from './pixabay-api';
import galleryCardsTpl from '../templates/gallery-cards.hbs';
import LoadMoreBtn from './components/load-more-btn';

import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/src/simple-lightbox.scss';

const refs = {
  galleryContainer: document.querySelector('.gallery'),
  searchForm: document.querySelector('#search-form'),
};
refs.submitBtn = refs.searchForm.querySelector('[type="submit"]');

const loadMoreBtn = new LoadMoreBtn({ selector: '[data-action="load-more"]', isHidden: true });

const pixabayApi = new PixabayApi();

const gallery = new SimpleLightbox('.gallery a', {
  /* options */
});
gallery.on('show.simplelightbox', function () {
  alert('open');
});

gallery.on('error.simplelightbox', function (e) {
  alert(e);
});

bindEvents();

// functions
function bindEvents() {
  refs.searchForm.addEventListener('submit', onSearch);
  loadMoreBtn.refs.loadMoreBtn.addEventListener('click', () => fetchPhotos());
}

function onSearch(e) {
  e.preventDefault();
  pixabayApi.query = refs.searchForm.query.value;
  clearGalleryContainer();

  fetchPhotos(true);
  loadMoreBtn.show();
}

async function fetchPhotos(isFirstQuery = false) {
  loadMoreBtn.disable();
  const data = await pixabayApi.getPhotos();
  loadMoreBtn.enable();
  appendGalleryMarkup(data.hits);

  if (isFirstQuery) {
    if (data.totalHits) Notify.success(`Hooray! We found ${data.totalHits} images.`);
    else {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.hide();
      return;
    }
  }

  if (data.hits.length < pixabayApi.perPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.hide();
  }
}

function appendGalleryMarkup(hits) {
  const markup = galleryCardsTpl(hits);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  scrollToNew();
  gallery.refresh();
  console.log(gallery);
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function scrollToNew() {
  const labels = refs.galleryContainer.querySelectorAll('.new-portion');
  if (labels.length) {
    labels[labels.length - 1].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
