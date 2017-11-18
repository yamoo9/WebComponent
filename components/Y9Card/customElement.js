(global => {

  const currentDocument = global.document.currentScript.ownerDocument;
  const customElements  = global.customElements;
  const JSON            = global.JSON;

  // 커스텀 요소 정의
  class Y9Card extends HTMLElement {

    // 생성자
    constructor() {
      super();
      this.addEventListener('click', e => this.toggle());
    }

    // 라이프사이클 메서드
    connectedCallback() {

      const id         = this.getAttribute('data-id');
      const shadowRoot = this.attachShadow({mode: 'open'});
      const template   = currentDocument.querySelector('#y9-card__template');
      const instance   = template.content.cloneNode(true);

      shadowRoot.appendChild(instance);

      fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then( response => response.text() )
        .then( responseText => this.render(JSON.parse(responseText)) )
        .catch( error => console.error(error) );

    }

    /* 인스턴스 메서드 */

    // 레더링 메서드
    render(data) {

      const shadowRoot = this.shadowRoot;

      let header, website, address;
      header  = shadowRoot.querySelector('.y9-card__header');
      website = shadowRoot.querySelector('.y9-card__website');
      address = shadowRoot.querySelector('.y9-card__address');

      header.innerHTML = data.username;
      website.innerHTML = data.website;

      let data_address = data.address;
      address.innerHTML = `
        <h4>주소</h4>
        ${data_address.suite},<br>
        ${data_address.street},<br>
        ${data_address.city},<br>
        우편번호: ${data_address.zipcode}
      `;


    }

    // 토글 메서드
    toggle() {

      const shadowRoot = this.shadowRoot;

      let content, button;

      content = shadowRoot.querySelector('.y9-card__content');
      button  = shadowRoot.querySelector('.y9-card__detail-button');

      let is_content_visible = content.style.display === 'none';

      button.innerHTML = is_content_visible ? '자세한 정보 보기' : '펼쳐진 정보 감추기';
      content.style.display = is_content_visible ? 'block' : 'none';

    }

  }

  // 커스텀 요소 등록
  customElements.define('y9-card', Y9Card);

})(window);
