function injectedJavaScript() {
  function sendSearchList() {
    let result = { items: [], hasNext: false };
    document.querySelectorAll('.news-box li').forEach((_li) => {
      result.items.push({
        name: _li.querySelector('.tit').innerText,
        link: _li.querySelector('.img-box a').href,
        imgUrl: _li.querySelector('.img-box img').src,
        account: _li.querySelector('[name="em_weixinhao"]').innerText,
        description: _li.querySelectorAll('dd')[0].innerText,
      });
    });
    if (document.querySelector('#sogou_next')) {
      result.hasNext = true;
    }
    window.postMessage(JSON.stringify(result), '');
  }

  document.addEventListener('message', (messageEvent) => {
    if (messageEvent.data === '@Search') {
      sendSearchList();
    }
  });
}

export { injectedJavaScript };
