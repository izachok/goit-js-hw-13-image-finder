import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = { key: '22249367-47a1cf5ba4f0f2c3f03999b11' };

export default class PixabyApi {
  #query;
  #page;
  constructor() {
    this.#query = '';
    this.#page = 1;
    this.perPage = 12;
  }

  async getPhotos() {
    const { data } = await axios.get(
      `?image_type=photo&orientation=horizontal&q=${this.#query}&page=${this.#page}&per_page=${
        this.perPage
      }`,
    );
    this.incrementPage();
    return data;
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
    this.#page = 1;
  }

  incrementPage(value = 1) {
    this.#page += value;
  }

  decrementPage(value = 1) {
    this.#page -= value;
  }
}
