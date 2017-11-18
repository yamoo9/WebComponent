###### HTML Web Component

# HTML 웹 컴포넌트

웹 컴포넌트에 대한 필요성과 기술 표준에 대한 이야기는 몇 년에 걸쳐 거론되어 왔지만 Chrome, Opera를 제외한 주요 브라우저에서는 아직까지 일부만 지원하고 있는 실정입니다.
하지만 [웹 컴포넌트 폴리필](https://www.webcomponents.org/polyfills)을 사용하면 바로 적용해 사용할 수 있습니다.

## 목차

- [소개](#소개)
- [웹 컴포넌트를 구성하는 4가지 요소](#웹-컴포넌트를-구성하는-4가지-요소)
- [커스텀 HTML 요소 만들기](#커스텀-html-요소-만들기)
- [바인딩 할 데이터 API](#바인딩-할-데이터-api)
- [HTML 템플릿 구성하기](#html-템플릿-구성하기)
- [컴포넌트 스타일링](#컴포넌트-스타일링)
- [라이프 사이클 메서드](#라이프-사이클-메서드)
  - [connectedCallback](#connectedcallback)
    - [Shadow DOM이란?](#shadow-dom이란)
- [데이터 렌더링](#데이터-렌더링)
    - [크로스 브라우징](#크로스-브라우징)
- [테스트 서버](#테스트-서버)
      - [테스트 서버 개발 모듈](#테스트-서버-개발-모듈)
- [웹 컴포넌트 & Shadow DOM](#웹-컴포넌트--shadow-dom)
- [웹 컴포넌트를 사용할 때 알아두어야 할 점<i>!</i>](#웹-컴포넌트를-사용할-때-알아두어야-할-점ii)
  - [컴포넌트 이름 작성 규칙](#컴포넌트-이름-작성-규칙)
  - [컴포넌트 확장](#컴포넌트-확장)
  - [커스텀 요소는 컴포넌트 클래스 인스턴스](#커스텀-요소는-컴포넌트-클래스-인스턴스)
  - [비공개(Private) 메서드](#비공개private-메서드)
  - [컴포넌트 클래스 프리징(Freezing)](#컴포넌트-클래스-프리징freezing)
- [결론](#결론)
- [최신 정보](#최신-정보)
- [참고](#참고)

## 소개

웹 컴포넌트는 웹 애플리케이션 제작 시에 사용 가능한 부품(Component)을 말하며, 재사용을 목적으로 캡슐화 된 커스텀 HTML 요소를 만들 수 있는 웹 플랫폼 API 세트입니다.
표준 HTML, DOM 기술 사양에 추가된 웹 컴포넌트 기술을 사용하면 HTML/CSS/JavaScript를 사용하여 재사용 가능한 컴포넌트를 제작할 수 있습니다.

예를 들어, ID로 식별 가능한 데이터를 서버에서 가져와 데이터 바인딩하는 컴포넌트를 아래와 같은 HTML 코드로 사용할 수 있습니다.

```html
<y9-card data-id="1"></y9-card>
```

[⇪ 목차로 이동](#목차)

<br>

## 웹 컴포넌트를 구성하는 4가지 요소

HTML, DOM 표준 기술 사양은 웹 컴포넌트를 구성하기 위한 4가지 API를 제공하고 있습니다.

1. __[customElements](https://www.w3.org/TR/custom-elements/)__<br>
커스텀 엘리먼트를 사용하면 새로운 HTML 요소를 만들거나 기존 HTML 요소를 확장할 수 있습니다.

1. __[HTML Template](https://www.html5rocks.com/ko/tutorials/webcomponents/template/#toc-using)__<br>
클라이언트 측 템플릿을 위한 표준 DOM 기반 접근 방식으로 새로운 요소를 정의하기 위해 `<template>` 요소를 사용할 수 있습니다.

1. __[HTML Import](https://www.html5rocks.com/ko/tutorials/webcomponents/imports/)__<br>
HTML 템플릿(`<template>`)을 사용하면 새 템플릿을 만들 수 있지만 HTML 임포트(`<link rel="import" href="...">`)를 사용하면 다른 HTML 파일에서 이러한 템플릿으로 가져올 수 있습니다.
이를 통해 컴포넌트와 HTML 템플릿 파일을 분리 관리할 수 있습니다.

1. __[Shadow DOM](https://dom.spec.whatwg.org/#shadow-trees)__<br>
Shadow DOM은 컴포넌트 기반 애플리케이션을 작성하기 위한 도구로 설계 되었습니다.<br>
컴포넌트 스코프(Scope)를 DOM에서 분리하고 CSS 등을 단순화 할 수 있습니다.

[⇪ 목차로 이동](#목차)

<br>

## 커스텀 HTML 요소 만들기

컴포넌트를 구성할 디렉토리(Directory)를 만들고, 디렉토리 안에 커스텀 요소를 정의할 파일을 생성합니다.

```sh
.
└── Y9Card
    └── customElement.js ⬅︎
```

커스텀 HTML 요소를 생성하려면 먼저 요소를 정의하는 <strong>클래스(Class)를 선언</strong>해야 합니다.
새롭게 정의하는 클래스는 기존 HTML 요소의 능력을 그대로 물려 받아 사용하기 위해 브라우저 네이티브 클래스 <strong>HTMLElement 클래스를 상속</strong> 합니다.

클래스를 정의하고 상속하는 구문은 다음과 같습니다.

```js
/* Y9Card 컴포넌트 클래스 정의 */
class Y9Card extends HTMLElement {
  constructor() {
    // 상위 클래스로부터 상속된 후 생성자를 정의할 경우, 반드시 super() 호출이 요구됨.
    super();
    // <y9-card> 요소 click 이벤트 바인딩: toggleCard() 메서드 실행
    this.addEventListener('click', e => this.toggleCard());
  }
  // 메서드
  toggleCard() { console.log('카드 토글(Toggle)'); }
}
```

이어서 선언한 클래스를 커스텀 HTML 요소로 사용할 수 있도록 등록합니다.
이 과정을 마치면 HTML 문서에서 `<y9-card>` 요소를 사용할 수 있게 됩니다.

```js
/* 커스텀 HTML 요소 <y9-card> 등록 */
window.customElements.define('y9-card', Y9Card);
```

[⇪ 목차로 이동](#목차)

<br>

## 바인딩 할 데이터 API

[JSONPlaceholder](https://jsonplaceholder.typicode.com/) API를 사용해 등록된 커스텀 요소에 데이터를 바인딩 할 것입니다. 바인딩 될 데이터 구조는 다음과 같습니다.

```js
{
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: {
      lat: "-37.3159",
      lng: "81.1496"
    }
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org"
}
```

[⇪ 목차로 이동](#목차)

<br>

## HTML 템플릿 구성하기

API 데이터를 바인딩 할 템플릿을 만들어 봅시다. 템플릿으로 사용할 HTML 파일을 디렉토리 안에 만듭니다.

```sh
.
└── Y9Card
    ├── customElement.js
    └── template.html    ⬅︎
```

카드 컴포넌트 템플릿은 다음과 같이 HTML 코드로 구성합니다. 템플릿을 식별하기 위한 `id` 및 컴포넌트를 구성하는 각 파트를 식별하기 위한 `class` 속성을 설정할 때는
고유하게 식별 가능한 접두사(예제에서는 `y9-card`)를 사용해 기존 HTML 요소와 충돌나지 않도록 구성해야 합니다.

```html
<template id="y9-card__template">

  <div class="y9-card__container">
    <h2 class="y9-card__header"></h2>
    <p>웹사이트: <a href="" class="y9-card__website"></a></p>
    <div class="y9-card__content">
      <p class="y9-card__address"></p>
    </div>
    <button type="button" class="y9-card__detail-button">자세히 보기</button>
  </div>

</template>
```

마무리로 템플릿 정의 코드 아래 컴포넌트 커스텀 요소를 정의한 스크립트 파일을 호출합니다.

```html
<script src="/components/Y9Card/customElement.js"></script>
```

[⇪ 목차로 이동](#목차)

<br>

## 컴포넌트 스타일링

컴포넌트를 스타일링할 CSS 파일을 컴포넌트 디렉토리 내에 생성합니다.

```sh
.
└── Y9Card
    ├── customElement.js
    ├── template.html
    └── style.css       ⬅︎
```

생성된 CSS 파일에 카드 스타일링 코드를 작성합니다.

```css
.y9-card__template {
  display: inline-block;
  width: 30%;
  margin: 3px;
  border: 1px solid grey;
  font-family: Helvetica;
  text-align: center;
  border-radius: 5px;
}

.y9-card__:hover {
  box-shadow: 3px 3px 3px;
}

.y9-card__content {
  display: none;
}

.y9-card__details-button {
  margin-bottom: 8px;
  padding: 6px;
  background-color: #dedede;
}
```

이어서 템플릿 `<template>` 시작 부분에 컴포넌트 스타일 파일을 호출하는 구문을 추가합니다.

```html
<template id="y9-card__template">

  <link rel="stylesheet" href="/components/Y9Card/style.css">
  ...

</template>
```

[⇪ 목차로 이동](#목차)

<br>

## 라이프 사이클 메서드

커스텀 요소의 라이프 사이클(Life Cycle) 메소드는 이벤트에 따라 콜백(callback)하여 사용할 수 있습니다.

메서드 이름 | 설명
--- | ---
connectedCallback | 커스텀 요소가 __DOM에 삽입 될 때마다 호출__ 됩니다.
disconnectedCallback | 커스텀 요소가 __DOM에서 제거 될 때마다 호출__ 됩니다.
attributeChangedCallback | 커스텀 요소의 __속성이 추가, 제거, 업데이트 또는 교체 될 때마다 호출__ 됩니다.

자 그럼 이어서 `Y9Card/customElement.js` 파일에 라이프 사이클 메서드를 추가해봅시다.

### connectedCallback

우리가 정의한 커스텀 요소를 DOM에 삽입할 때 호출될 일련의 과정을 정의하려면 `connectedCallback` 메서드를 사용합니다.

__참고__

> `constructor`와 `connectedCallback` 메소드는 비슷해보이지만 용도가 다릅니다.
>
> `constructor`는 커스텀 요소 인스턴스가 생성되었을 때 실행되는 반면, `connectedCallback` 메서드는 DOM에 커스텀 요소가 삽입될 때마다 실행됩니다.
>
> __`connectedCallback` 메서드는 임포트(`import`)하거나 렌더링(`rendering`) 같은 설정 코드를 실행할 때 유용__ 합니다.

<br>

먼저 `Y9Card/customElement.js` 파일에 `currentDocument` 변수를 생성해야 합니다. 해당 변수에는 커스텀 컴포넌트 스크립트 파일을 호출한 HTML 파일의 DOM에 접근하기 위함입니다.

```js
const currentDocument = window.document.currentScript.ownerDocument;
```

이어서 `connectedCallback` 메서드를 클래스 구문 내에 정의합니다.

```js
/* 라이프사이클 메서드 */
// DOM에 커스텀 요소가 삽입될 때 호출
connectedCallback() {

  // #1. Shadow DOM
  const shadowRoot = this.attachShadow({mode: 'open'});

  // #2. 템플릿을 선택하고 복제합니다.
  const template   = currentDocument.querySelector('#y9-card__template');
  const instance   = tempalte.content.cloneNode(true);

  // #3. 복제된 노드를 ShadowRoot에 삽입합니다.
  shadowRoot.appendChild(instance);

  // #4. 커스텀 HTML 요소로 부터 data-id 속성 값을 가져옵니다.
  // e.g) <y9-card data-id="7"></y9-card>
  const id = this.getAttribute('data-id');

  // #5. API에서 해당 사용자 ID에 대한 데이터를 가져와 인스턴스 렌더링 메서드를 호출합니다.
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then( response => response.text() )
    // #6. JSON 데이터 ➜ 객체 변경 후, render() 메서드에 전달하여 실행합니다.
    .then( responseText => this.render(JSON.parse(responseText)) )
    .catch( error => console.error(error) );

}
```

1. `.attachShadow()` 메서드를 사용해 [Shadow DOM]()을 커스텀 요소에 연결합니다.
1. `currentDocument` 변수를 통해 템플릿 식별자를 쿼리하여 템플릿을 참조한 후, 템플릿 노드를 복제합니다.
1. 복제된 템플릿 노드를 `shadowRoot` 변수에 참조된 객체의 `.appendChild()` 메서드를 통해 삽입합니다.
1. 커스텀 요소의 `data-id` 속성 값을 가져와 변수 `id`에 복사합니다.
1. `fetch()` 함수를 사용해 API 데이터를 서버로부터 호출합니다.
1. 응답 받은 JSON 텍스트 데이터를 객체화 하고 커스텀 요소의 `render()` 메서드에 전달하여 실행합니다.

#### Shadow DOM이란?

[Shadow DOM](https://developer.mozilla.org/ko/docs/Web/Web_Components/Shadow_DOM)은 웹 컴포넌트 내에 존재하는
템플릿, 스타일, 스크립트 코드를 캡슐화 하는 기능을 가지고 있어 HTML 문서의 DOM에서 분리할 수 있습니다.
웹 컴포넌트에 연결하여 사용하는 방법이 아니더라도 Shadow DOM 만 따로 사용하는 것도 가능합니다.

<img src="../../ASSETS/shadowDOM.png" alt="Shadow DOM"><br>
> shadow host는 요소, Shadow DOM Subtrees는 Shadow DOM을 말합니다.

Shadow DOM은 반드시 이미 존재하는 요소(HTML 파일 내에 사용된 요소)에 추가해야 합니다.
요소는 `<div>`와 같은 네이티브 요소일 수도 있고, `<y9-card>`와 같은 커스텀 요소일 수도 있습니다.

위 예제에서 사용했던 [`.attachShadow()`](https://developer.mozilla.org/ko/docs/Web/API/Element/attachShadow) 메서드를 사용해
Shadow DOM을 요소에 추가할 수 있습니다. 구문은 다음과 같습니다.

```js
elementNode.attachShadow(shadowRootInit);
```

`shadowRootInit`은 옵션 객체로 `mode` 속성을 설정할 수 있습니다.

`mode` 속성은 Shadow DOM Tree의 캡슐화 모드를 설정합니다.

모드 값 | 설명
--- | ---
open | shadowRoot를 추가한 요소들이 `.shadowRoot` 속성을 사용해 HTML DOM으로부터 접근 가능하게 설정합니다.
close | shadowRoot를 추가한 요소들이 `.shadowRoot` 속성을 사용해 HTML DOM으로부터 접근 불가능하게 설정합니다.

```js
element.attachShadow({
  mode: 'open' // 'open' | 'close'
});
```

[⇪ 목차로 이동](#목차)

<br>

## 데이터 렌더링

서버로부터 전달 받아 객체화 한 데이터는 `render()` 메서드의 인자로 전달됩니다.
전달 받은 데이터의 각 속성을 템플릿에 바인딩하는 코드를 `render()` 메서드 내에 작성합니다.

```js
/* 렌더링 메서드 */
render(data) {

  // #1. ShadowRoot를 참조합니다.
  const shadowRoot = this.shadowRoot;

  // #2. 데이터 바인딩 할 템플릿 내부 요소를 참조합니다.
  let header  = shadowRoot.querySelector('.y9-card__header');
  let website = shadowRoot.querySelector('.y9-card__website');
  let address = shadowRoot.querySelector('.y9-card__address');

  // #3. 참조한 템플릿 요소마다 각각 데이터를 바인딩 합니다.
  header.innerHTML  = data.username;
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
```

1. ShadowRoot를 참조합니다.
1. 데이터 바인딩 할 템플릿 내부 요소(헤더, 웹사이트, 주소)를 참조합니다.
1. 참조한 템플릿 요소마다 각각 데이터를 바인딩 합니다.

<br>

마무리로 `toggle()` 메서드에 다음 코드를 추가합니다.

```js
toggle() {

  // #1. ShadowRoot를 참조합니다.
  const shadowRoot = this.shadowRoot;

  // #2. ShadowRoot를 통해 요소(콘텐츠, 버튼)를 참조합니다.
  let content = shadowRoot.querySelector('.y9-card__content');
  let button  = shadowRoot.querySelector('.y9-card__detail-button');

  // #3. 콘텐츠의 display 상태가 화면에 표시되는지 여부를 is_content_visible 변수에 복사합니다.
  let is_content_visible = content.style.display === 'none';

  // #4. 참조한 버튼 텍스트 값을 is_content_visible 조건 값에 따라 변경(토글)합니다.
  button.innerHTML = is_content_visible ? '자세한 정보 보기' : '펼쳐진 정보 감추기';
  // #5. 참조한 콘텐츠의 display 상태 값을 is_content_visible 조건 값에 따라 변경(토글)합니다.
  content.style.display  = is_content_visible ? 'block' : 'none';

}
```

1. ShadowRoot를 참조합니다.
1. ShadowRoot를 통해 요소(콘텐츠, 버튼)를 참조합니다.
1. 콘텐츠의 `display` 상태가 화면에 표시되는지 여부를 `is_content_visible` 변수에 복사합니다.
1. 참조한 버튼 텍스트 값을 `is_content_visible` 조건 값에 따라 변경(토글)합니다.
1. 참조한 콘텐츠의 `display` 상태 값을 `is_content_visible` 조건 값에 따라 변경(토글)합니다.

<br>

커스텀 컴포넌트를 생성하고 사용하기 위한 준비 과정이 마무리 되었으니 프로젝트에 해당 컴포넌트를 사용할 수 있습니다.
`index.html` 파일을 생성한 후 컴포넌트를 사용해봅시다.

```sh
.
├── components
│   └── Y9Card
│       ├── customElement.js
│       ├── style.css
│       └── template.html
└── index.html ⬅︎
```

아래는 `index.html` 전문입니다.

```html
<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>웹 컴포넌트 DEMO</title>

    <!-- #1. 커스텀 컴포넌트 템플릿 파일 로드 -->
    <link rel="import" href="./components/Y9Card/template.html">

  </head>
  <body>

    <!-- #2. 커스텀 컴포넌트 요소 사용 -->
    <y9-card data-id="9"></y9-card>

  </body>
</html>
```

1. `<link rel="import">` 구문을 추가한 다음 `href="./components/Y9Card/template.html"' 속성을 추가합니다.
1. `<y9-card data-id="9"></y9-card>` 커스텀 요소를 body 요소 내부에 추가합니다.

#### 크로스 브라우징

모든 브라우저가 웹 컴포넌트를 지원하는 것은 아니기 때문에 브라우저 호환성을 고려하려면 [webcomponents.js](https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.2/webcomponents-lite.js) 파일을 문서에 추가해야 합니다.
`</body>` 바로 앞에 아래 구문을 추가하여 웹 컴포넌트를 지원하지 않는 브라우저에서 webcomponents.js를 로드할 수 있도록 조건 처리합니다.

```html
...

<script>
    (function (global) {
      'use strict';

      var document = global.document;
      var body     = document.body;

      // 웹 컴포넌트를 사용할 수 있는지 검토
      var is_support_register = 'registerElement' in document;
      var is_support_import   = 'import'          in document.createElement('link');
      var is_support_template = 'content'         in document.createElement('template');

      // 웹 컴포넌트를 사용할 수 없다면 폴리필 스크립트 로드
      if ( !is_support_register || !is_support_import || !is_support_template) {
        var polyfill = document.createElement('script');
        polyfill.src = 'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.2/webcomponents-lite.js';
        body.appendChild(polyfill);
      }

    })(window);
  </script>

</body>
```

[⇪ 목차로 이동](#목차)

<br>

## 테스트 서버

웹 컴포넌트를 테스트하려면 서버를 구동해야 합니다. 테스트 서버 개발 모듈을 설치하여 사용해봅니다.

##### 테스트 서버 개발 모듈

- [http-server](https://www.npmjs.com/package/http-server)
- [static-server](https://www.npmjs.com/package/static-server)
- [json-server](https://github.com/typicode/json-server)
- [live-server](https://www.npmjs.com/package/live-server)

이 예제에서는 `http-server` 모듈을 설치하여 사용해봅니다.
`package.json` 파일을 생성하는 명령을 실행한 후, NPM 인스톨 명령을 사용하여 `http-server` 개발 모듈을 개발 의존성(`-d`, `--save-dev`) 용도로 설치합니다.

```sh
$ echo {} > package.json
$ npm i -D http-server
```

`package.json` 파일은 프로젝트 디렉토리 루트(Root)에 생성되어야 합니다.

```sh
.
├── components/
│   └── Y9Card/
│       ├── customElement.js
│       ├── style.css
│       └── template.html
├── index.html
├── node_modules/
└── package.json  ⬅
```

`package.json` 파일을 열어 NPM 스크립트 `test-server`를 추가합니다. 아래 코드를 참고하세요.

```json
{
  "scripts": {
    "test-server": "http-server"
  },
  "devDependencies": {
    "http-server": "^0.10.0"
  }
}
```

`test-server` 스크립트 명령을 실행한 후 웹 컴포넌트가 올바르게 작동하는지 확인합니다.

```sh
$ npm run test-server
```

[⇪ 목차로 이동](#목차)

<br>

## 웹 컴포넌트 & Shadow DOM

테스트 서버의 `index.html` 파일을 브라우저에서 테스트 하면 커스텀 요소가 올바르게 작동하는 것을 확인할 수 있습니다. (아래 그림 참고)

<img src="../../ASSETS/webComponent-shadowDOM.jpg" alt="" width="550">

<br>
<br>


[⇪ 목차로 이동](#목차)

---

## 웹 컴포넌트를 사용할 때 알아두어야 할 점<i>!</i>

### 컴포넌트 이름 작성 규칙

- 커스텀 요소의 이름 작성 시, 음절의 구분은 하이픈(`-`)을 사용해야 합니다. (e.g `<y9-card>`)<br>
※ `<card>`, `<y9_card>`, `<y9Card>` 처럼 사용하는 것은 올바른 방법이 아닙니다.

- 동일한 커스텀 요소를 중복해서 정의하면 안됩니다.<br>
즉, `class Y9Card extends HTMLElement {}` 구문이 2번 사용되서는 안됩니다.

- 네이티브 HTML 요소는 텅빈 요소(empty element, e.g `<link />`)를 허용하지만,<br>
커스텀 요소는 반드시 닫는 태그(e.g `</y9-card>`)가 필요합니다.

[⇪ 목차로 이동](#목차)

### 컴포넌트 확장

새로운 컴포넌트를 등록할 때 다른 컴포넌트를 상속 할 수 있습니다.
예를 들어 `Y9Card` 컴포넌트를 상속하는 `Y9FlipCard`를 만들고자 한다면 다음과 같은 구문을 사용할 수 있습니다.
컴포넌트를 확장하는 자세한 튜토리얼은 [재사용 가능한 웹 구성 요소: 요소 확장](https://developers.google.com/web/fundamentals/web-components/customelements#extend)을 참고하세요.

```js
// Y9Card 클래스를 상속한 Y9FlipCard 클래스 정의
class Y9FlipCard extend Y9Card {
  constructor() {
    // 상속 후, constructor()를 사용할 경우, 반드시 super()를 실행해야 함.
    super();
  }

  // 메서드 확장
  flipX() { ... }
  flipY() { ... }
  flipToggle() { ... }
}

window.customElements.define('y9-flip-card', Y9FlipCard);
```

[⇪ 목차로 이동](#목차)

### 커스텀 요소는 컴포넌트 클래스 인스턴스

사용자가 HTML 문서에 추가하는 커스텀 HTML 요소는 컴포넌트 클래스의 인스턴스입니다.

```html
<y9-card data-id="23"></y9-card>
```

컴포넌트 클래스에 인스턴스(공용) 메서드 추가하면 다른 커스텀 요소 또는 스크립트에서 해당 커스텀 요소를 손쉽게 제어할 수 있습니다.

```js
// 카드 참조
var card_23 = document.querySelector('y9-card[data-id="23"]');

// 카드 토글
card_23.toggle();
```

[⇪ 목차로 이동](#목차)

### 비공개(Private) 메서드

IIFE 패턴을 사용해 비공개 메서드를 정의할 수도 있습니다.
예를 들어, 컴포넌트 클래스 내부에서 매우 복잡한 작동을 요구하는 컴포넌트를 만들어야 할 경우 사용하면 유용합니다.

```js
(function() {
  'use strict';

  // 비공개 메서드 정의
  // ※ 외부 컨텍스트에서 접근이 불가능합니다.
  function _privateMethod(self, otherArgs) { ... }

  class Y9Card extends HTMLElement {
    ...

    // 클래스에서 공개된 메서드를 통해 감춰진 비공개 메서드 사용
    // ※ 외부 컨텍스트에서 접근이 가능합니다.
    publicMethod() {
      ...
      // 비공개 메서드 호출
      _privateMethod(this, args);
    }
    ...
  }

  customElements.define('y9-card', Y9Card);

})();
```

[⇪ 목차로 이동](#목차)

### 컴포넌트 클래스 프리징(Freezing)

만약 컴포넌트 클래스를 누군가에 의해 수정할 수 없도록 프리징하고자 한다면 `Object.freeze()`를 사용합니다.

```js
class Y9Card extends HTMLElement { ... }

const Frozen_Y9Card = Object.freeze(Y9Card); // 프리징
window.customElements.define('y9-card', Frozen_Y9Card);
```

> 개발 과정에서 컴포넌트 클래스를 프리징 할 경우 디버깅의 어려움이 있습니다. 배포할 때 프리징하길 권장합니다.

[⇪ 목차로 이동](#목차)

<br>

## 결론

웹 컴포넌트 API는 현재 개발 중인 표준 기술 사양으로 실무에 바로 사용하기는 무리가 있습니다.

하지만 [VueJS](https://vuejs.org/), [React](https://reactjs.org/), [Angular](https://angular.io/)와 같은 프레임워크는 컴포넌트 기반 개발을 지향하고 있고 웹 컴포넌트를 당장 실무에 사용할 수 있는 방법을 제공하고 있습니다.
실무에 컴포넌트 기반 개발을 도입할 생각이라면?! 웹 컴포넌트 표준 API가 개발 완성되고 브라우저 호환에 문제가 없을 때까지 프레임워크를 사용하시길 바랍니다.

[⇪ 목차로 이동](#목차)

<br>

## 최신 정보

[HTML 임포트(`import`) 방법에 대해 부정적인 의견과 대안책 논의](https://github.com/w3c/webcomponents/issues/645)를 살펴보면 HTML 임포트(`import`)를 사용하는 대신 __JavaScript 모듈 임포트로 대체하자__ 는 움직임이 있습니다.

만약 이와 같은 의견을 같이 하고자 한다면 다음 과정을 따라 위에서 다룬 예제를 수정합니다.

1. `index.html` 파일에서 `<link rel="import" href="/components/Y9Card/template.html">` 코드를 제거합니다.
1. `component/Y9Card/customElement.js` 파일을 아래와 같이 수정합니다.

```js
// Async Await 활용
(async () => {
  'use strict';

  // components/Y9Card/template.html 파일을 fetch() 한 후, templateHTML 변수에 참조합니다.
  const templateHTML = await fetch('/components/Y9Card/template.html');
  // textHTMLTemplate 변수에 textHTML 참조 값을 텍스트로 변환한 값을 대입합니다.
  const textHTMLTemplate = await templateHTML.text();
  // new DOMParser()를 사용해 textHTMLTemplate를 구문 분석한 후, <template>을 찾아 HTMLTemplate 변수에 참조합니다.
  const HTMLTemplate = new DOMParser().parseFromString(textHTMLTemplate, 'text/html').querySelector('template');

  /* Y9Card 클래스 정의 */
  class Y9Card extends HTMLElement {

    // 생성자
    constructor() { ... }

    // 라이프 사이클 메서드
    connectedCallback() {

      // Shadow DOM을 컴포넌트 요소에 추가합니다. (외부 접근 허용)
      const shadowRoot = this.attachShadow({ mode: 'open' });

      // HTMLTemplate 콘텐츠를 복제한 후 instance 변수에 참조합니다.
      const instance = HTMLTemplate.content.cloneNode(true);
      // Shadow DOM에 instance를 추가합니다.
      shadowRoot.appendChild(instance);

      ...
    }

    // 인스턴스 메서드
    render(data) { ... }
    toggle() { ... }

  }

  /* 커스텀 요소 등록 */
  customElements.define('y9-card', Y9Card);

})();
```

[⇪ 목차로 이동](#목차)

<br>

## 참고

- [W3C, 웹 컴포넌트 기술 사양 표준화 진행상황](https://www.w3.org/standards/techs/components)
- [HTML Web Component using Vanilla JavaScript](https://ayushgp.github.io/html-web-components-using-vanilla-js/)
- [웹 컴포넌트, NAVER D2](http://d2.naver.com/helloworld/188655)
- [웹 컴포넌트, MDN](https://developer.mozilla.org/ko/docs/Web/Web_Components)

[⇪ 목차로 이동](#목차)