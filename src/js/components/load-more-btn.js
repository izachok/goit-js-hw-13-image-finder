export default class LoadMoreBtn {
  #selector;
  constructor({ selector, isHidden = false }) {
    this.#selector = selector;
    this.refs = this.setRefs();
    if (isHidden) this.hide();
  }

  setRefs() {
    const refs = {};
    refs.loadMoreBtn = document.querySelector(this.#selector);
    refs.spinner = refs.loadMoreBtn.querySelector('.spinner');
    refs.label = refs.loadMoreBtn.querySelector('.label');
    return refs;
  }

  enable() {
    this.refs.loadMoreBtn.disable = false;
    this.refs.spinner.classList.add('is-hidden');
    this.refs.label.textContent = 'Load more';
  }

  disable() {
    this.refs.loadMoreBtn.disable = true;
    this.refs.spinner.classList.remove('is-hidden');
    this.refs.label.textContent = 'Loading...';
  }

  show() {
    this.refs.loadMoreBtn.classList.remove('is-hidden');
  }

  hide() {
    this.refs.loadMoreBtn.classList.add('is-hidden');
  }
}
